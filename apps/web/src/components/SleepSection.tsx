import { useEffect, useRef } from "react";

const hourTimes = ["13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01", "00", "23", "22", "21", "20", "19"];
const times = hourTimes.flatMap((hour, index) => {
  const fullHour = { hour: Number(hour), minute: 0, label: hour };
  const nextHour = hourTimes[index + 1];
  return nextHour ? [fullHour, { hour: Number(nextHour), minute: 30, label: "30" }] : [fullHour];
});
const geometry = { height: 600, cx: 268, cy: 300, outerRx: 230, outerRy: 280, innerRx: 215, innerRy: 265 };

function pointAt(index: number, track: "outer" | "inner") {
  const progress = index / (times.length - 1);
  return pointAtProgress(progress, track);
}

function pointAtProgress(progress: number, track: "outer" | "inner") {
  const angleDegrees = 250 - progress * 140;
  const angle = angleDegrees * Math.PI / 180;
  const rx = track === "outer" ? geometry.outerRx : geometry.innerRx;
  const ry = track === "outer" ? geometry.outerRy : geometry.innerRy;
  return {
    x: geometry.cx + rx * Math.cos(angle),
    y: geometry.cy + ry * Math.sin(angle),
    rotation: -32 + progress * 64,
    tangent: Math.atan2(ry * Math.cos(angle), -rx * Math.sin(angle)) * 180 / Math.PI,
  };
}

function hoursBetween(startIndex: number, endIndex: number) {
  const startTime = times[startIndex];
  const endTime = times[endIndex];
  const start = startTime.hour + startTime.minute / 60;
  const end = endTime.hour + endTime.minute / 60;
  return (end - start + 24) % 24;
}

function formatTime(index: number) {
  const time = times[index];
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
}

type SleepValue = { value: number; unit: "hour"; bedtime?: string; wakeTime?: string };

function indexForTime(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const index = times.findIndex((time) => `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}` === value);
  return index < 0 ? fallback : index;
}

export function SleepSection({ value, onChange }: { value?: SleepValue; onChange: (value: SleepValue) => void }) {
  const bedtime = indexForTime(value?.bedtime, 28);
  const wakeTime = indexForTime(value?.wakeTime, 12);
  const dialRef = useRef<HTMLDivElement>(null);
  const arcCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = arcCanvasRef.current;
    if (!canvas) return;
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = 258 * pixelRatio;
    canvas.height = geometry.height * pixelRatio;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(pixelRatio, pixelRatio);
    context.clearRect(0, 0, 258, geometry.height);
    const startAngle = (250 - (wakeTime / (times.length - 1)) * 140) * Math.PI / 180;
    const endAngle = (250 - (bedtime / (times.length - 1)) * 140) * Math.PI / 180;
    context.beginPath();
    context.ellipse(geometry.cx, geometry.cy, geometry.innerRx, geometry.innerRy, 0, startAngle, endAngle, true);
    context.strokeStyle = "rgba(120, 155, 114, 0.82)";
    context.lineWidth = 10;
    context.lineCap = "round";
    context.stroke();
  }, [bedtime, wakeTime]);

  function updateFromPointer(event: React.PointerEvent, target: "bed" | "wake") {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const progress = Math.max(0, Math.min(1, (event.clientY - rect.top - 36) / 528));
    const index = Math.round(progress * (times.length - 1));
    if (target === "bed") commit(Math.max(index, wakeTime + 1), wakeTime);
    else commit(bedtime, Math.min(index, bedtime - 1));
  }

  function commit(nextBedtime: number, nextWakeTime: number) {
    onChange({
      value: hoursBetween(nextBedtime, nextWakeTime),
      unit: "hour",
      bedtime: formatTime(nextBedtime),
      wakeTime: formatTime(nextWakeTime)
    });
  }

  const bedPoint = pointAt(bedtime, "inner");
  const wakePoint = pointAt(wakeTime, "inner");
  const duration = hoursBetween(bedtime, wakeTime);

  return (
    <section className="today-section sleep-section" id="sleep" data-section="sleep">
      <header className="sleep-heading">
        <p className="section-kicker">last night</p>
        <h2>Rest</h2>
        <p>沿着月亮的弧线，<br />轻轻记下睡眠。</p>
      </header>

      <div className="sleep-dial" ref={dialRef}>
        <div className="sleep-arc" aria-hidden="true" />
        <canvas className="sleep-arc-canvas" ref={arcCanvasRef} aria-hidden="true" />
        {times.map((time, index) => {
          const point = pointAt(index, "outer");
          return (
            <div className={`sleep-tick${time.minute === 30 ? " is-half" : ""}${index === bedtime || index === wakeTime ? " is-selected" : ""}`} key={`${time.hour}:${time.minute}`} style={{ left: point.x, top: point.y, "--tick-rotation": `${point.rotation}deg` } as React.CSSProperties}>
              <i />
              {time.minute === 0 && <span>{time.label}</span>}
            </div>
          );
        })}

        <div className="sleep-reading" aria-live="polite">
          <small>sleep</small>
          <strong>{formatTime(bedtime)}</strong>
          <span>—</span>
          <strong>{formatTime(wakeTime)}</strong>
          <em>{duration} 小时</em>
        </div>

        <button
          aria-label={`入睡时间 ${formatTime(bedtime)}`}
          className="sleep-handle sleep-handle-bed"
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") commit(Math.max(wakeTime + 1, bedtime - 1), wakeTime);
            if (event.key === "ArrowDown") commit(Math.min(times.length - 1, bedtime + 1), wakeTime);
          }}
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event, "bed"); }}
          style={{ left: bedPoint.x, top: bedPoint.y }}
          type="button"
        ><span className="moon-mark" /></button>
        <button
          aria-label={`醒来时间 ${formatTime(wakeTime)}`}
          className="sleep-handle sleep-handle-wake"
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") commit(bedtime, Math.max(0, wakeTime - 1));
            if (event.key === "ArrowDown") commit(bedtime, Math.min(bedtime - 1, wakeTime + 1));
          }}
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event, "wake"); }}
          style={{ left: wakePoint.x, top: wakePoint.y }}
          type="button"
        ><span className="sun-mark" /></button>
      </div>
    </section>
  );
}
