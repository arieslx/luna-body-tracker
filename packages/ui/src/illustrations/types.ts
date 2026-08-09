import type { CSSProperties, ReactNode, SVGProps } from "react";

export type IllustrationState = "default" | "muted" | "selected" | "completed";

export interface IllustrationProps {
  size?: number | string;
  state?: IllustrationState;
  title?: string;
  className?: string;
  animated?: boolean;
  decorative?: boolean;
}

export interface IllustrationFrameProps extends IllustrationProps {
  children: ReactNode;
  viewBox?: string;
  style?: CSSProperties;
  svgProps?: Omit<SVGProps<SVGSVGElement>, "children" | "viewBox" | "role">;
}
