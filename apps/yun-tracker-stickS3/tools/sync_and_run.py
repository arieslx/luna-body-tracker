"""Sync Yun Tracker Python files to StickS3 and run with fresh imports.

This script uses serial paste mode because the tested UiFlow2 firmware does not
enter mpremote raw REPL reliably.
"""

import argparse
import base64
from pathlib import Path
import sys
import time

import serial


DEFAULT_PORT = "/dev/cu.usbmodem1101"
TARGET_DIR = "/flash/yun_app"
MODULES = (
    "main",
    "config",
    "controller",
    "device_adapter",
    "state",
    "storage",
    "ui",
)


def read_all(ser, wait=0.22):
    time.sleep(wait)
    out = b""
    idle = 0
    while idle < 3:
        waiting = ser.in_waiting
        if waiting:
            out += ser.read(waiting)
            idle = 0
        else:
            idle += 1
            time.sleep(0.05)
    return out


def paste(ser, code, wait=0.3):
    ser.write(b"\x03\r")
    read_all(ser, 0.15)
    ser.write(b"\x05")
    time.sleep(0.08)
    ser.write(code.encode("ascii"))
    if not code.endswith("\n"):
        ser.write(b"\n")
    ser.write(b"\x04")
    text = read_all(ser, wait).decode("utf-8", "replace")
    if "Traceback" in text:
        raise RuntimeError(text)
    return text


def upload_file(ser, source, target_dir):
    data = source.read_bytes()
    target = "{}/{}".format(target_dir.rstrip("/"), source.name)
    paste(
        ser,
        'open("{}", "wb").close()\nprint("start {} {}")\n'.format(target, source.name, len(data)),
        0.22,
    )
    for index in range(0, len(data), 1536):
        chunk = base64.b64encode(data[index : index + 1536]).decode("ascii")
        paste(
            ser,
            'import binascii\nf=open("{}", "ab")\nf.write(binascii.a2b_base64("{}"))\nf.close()\n'.format(
                target, chunk
            ),
            0.16,
        )
    paste(
        ser,
        'print("done {}", len(open("{}", "rb").read()))\n'.format(source.name, target),
        0.22,
    )


def run_app(ser, target_dir):
    clear_modules = "\n".join('sys.modules.pop("{}", None)'.format(name) for name in MODULES)
    code = (
        "import sys,gc\n"
        "{}\n"
        'sys.path.insert(0, "{}")\n'
        "gc.collect()\n"
        "import main\n"
        "main.main()\n"
    ).format(clear_modules, target_dir)
    return paste(ser, code, 1.5)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", default=DEFAULT_PORT)
    parser.add_argument("--no-run", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    files = sorted(root.glob("*.py"))
    if not files:
        raise SystemExit("no python files found")

    with serial.Serial(args.port, 115200, timeout=1) as ser:
        time.sleep(0.5)
        paste(
            ser,
            'import os\ntry:\n    os.mkdir("{}")\nexcept OSError:\n    pass\nprint("yun_app ready")\n'.format(
                TARGET_DIR
            ),
        )
        for source in files:
            upload_file(ser, source, TARGET_DIR)
        print("uploaded {} python files".format(len(files)))
        if not args.no_run:
            output = run_app(ser, TARGET_DIR)
            sys.stdout.write(output)


if __name__ == "__main__":
    main()
