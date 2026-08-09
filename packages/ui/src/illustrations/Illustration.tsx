import { useId } from "react";
import type { IllustrationFrameProps } from "./types";

export function Illustration({
  children,
  viewBox = "0 0 64 64",
  size = 64,
  state = "default",
  title,
  className = "",
  animated = false,
  decorative = false,
  style,
  svgProps,
}: IllustrationFrameProps) {
  const titleId = useId();
  const dimension = typeof size === "number" ? `${size}px` : size;
  const accessible = !decorative && Boolean(title);

  return (
    <svg
      {...svgProps}
      className={`luna-illustration${animated ? " is-animated" : ""}${className ? ` ${className}` : ""}`}
      viewBox={viewBox}
      width={dimension}
      height={dimension}
      role={accessible ? "img" : undefined}
      aria-labelledby={accessible ? titleId : undefined}
      aria-hidden={accessible ? undefined : true}
      data-state={state}
      style={style}
    >
      {accessible && <title id={titleId}>{title}</title>}
      <g className="luna-illustration-art">{children}</g>
      {state === "selected" && <circle className="luna-state-mark" cx="55" cy="54" r="4" />}
      {state === "completed" && (
        <g className="luna-complete-mark">
          <circle cx="54" cy="53" r="8" />
          <path d="m49.5 53 2-1.8 2 2.1 4.7-5 1.8 1.8-6.5 7Z" />
        </g>
      )}
    </svg>
  );
}
