import { Illustration } from "../Illustration";
import { lunaPalette as c } from "../palette";
import type { IllustrationProps } from "../types";

interface WaterIllustrationProps extends IllustrationProps { level?: number; }

export function WaterIllustration({ level = 0, ...props }: WaterIllustrationProps) {
  const safeLevel = Math.max(0, Math.min(8, level));
  const waterTop = 56 - safeLevel * 6;
  const edgeAt = (y: number) => 12 + (y - 7) * 4 / 49;
  return <Illustration title="Water" svgProps={{ preserveAspectRatio: "none" }} {...props}><path fill={c.blueLight} opacity=".28" d="M10 5c11-3 33-3 44 0l-6 53H16Z" /><path fill="#edf4f2" opacity=".9" d="M12 7c10-2 30-2 40 0l-6 49H18Z" />{Array.from({ length: 8 }).map((_, index) => {
    const top = 50 - index * 6;
    const bottom = top + 5.75;
    const topEdge = edgeAt(top);
    const bottomEdge = edgeAt(bottom);
    const isFilled = index < safeLevel;
    return <path key={index} fill={isFilled ? c.blue : c.blueLight} opacity={isFilled ? ".5" : ".035"} d={`M${topEdge} ${top} Q32 ${top - .65} ${64 - topEdge} ${top} L${64 - bottomEdge} ${bottom} L${bottomEdge} ${bottom}Z`} />;
  })}{safeLevel > 0 && <ellipse cx="32" cy={waterTop} rx={32 - edgeAt(waterTop)} ry="1.25" fill="#afd0d7" opacity=".72" />}</Illustration>;
}
export function AmericanoIllustration(props: IllustrationProps) { return <Illustration title="Iced Americano" {...props}><path fill={c.cream} d="M13 13h38l-4 43c-8 4-22 4-30 0Z" /><path fill={c.coffee} d="M17 23h30l-3 30c-7 3-17 3-24 0Z" /><ellipse cx="32" cy="23" rx="15" ry="5" fill={c.brown} /><rect x="21" y="29" width="5" height="5" rx="1" fill={c.oat} opacity=".58" transform="rotate(8 23.5 31.5)" /><rect x="35" y="33" width="5" height="5" rx="1" fill={c.oat} opacity=".58" transform="rotate(-9 37.5 35.5)" /><rect x="27" y="43" width="5" height="5" rx="1" fill={c.oat} opacity=".58" transform="rotate(6 29.5 45.5)" /><path fill={c.orange} d="m37 4 4 1-8 24-4-1Z" /><path fill={c.paper} opacity=".42" d="M17 19c8-3 22-3 30 0v3c-9-2-21-2-30 0Z" /></Illustration>; }
export function LatteIllustration(props: IllustrationProps) { return <Illustration title="Latte" {...props}><ellipse cx="34" cy="51" rx="27" ry="10" fill={c.sageLight} /><ellipse cx="34" cy="49" rx="20" ry="6" fill={c.sage} opacity=".42" /><path fill={c.sage} d="M14 18h39v22c-2 9-10 14-20 14S16 49 14 40Z" /><path fill={c.sage} fillRule="evenodd" d="M16 25C5 21 0 27 4 36c3 7 9 9 15 6l-2-6c-4 2-7 0-9-3-2-4 1-6 8-3Z" /><ellipse cx="33.5" cy="18" rx="19.5" ry="8" fill={c.orange} /><ellipse cx="33.5" cy="18" rx="16.5" ry="6" fill="#d7a56f" /><path fill={c.paper} d="M31 19c-4-1-6-2-6-4 3-1 5 1 6 4Zm2-1c-1-3 0-6 2-7 2 3 1 5-2 7Zm2 2c3-3 6-4 8-2-1 2-4 3-8 2Zm-3 1c-2 2-5 3-7 1 2-2 4-2 7-1Z" /><path fill={c.leaf} opacity=".35" d="M20 45c8 5 21 5 29 0-5 9-24 10-29 0Z" /></Illustration>; }
export function WineIllustration(props: IllustrationProps) { return <Illustration title="Wine" {...props}><path fill={c.oat} d="M15 8h34l-3 24c-1 9-6 14-13 15v9h11v4H20v-4h11v-9c-8-1-13-6-14-15Z" /><path fill={c.wine} d="M19 24h26l-1 8c-1 8-5 12-12 12-6 0-11-4-12-12Z" /><path fill={c.rose} d="M19 24c7-3 19-3 26 0-7 4-19 4-26 0Z" /></Illustration>; }
export function OtherDrinkIllustration(props: IllustrationProps) { return <Illustration title="Other drink" {...props}><path fill={c.cream} d="M14 9h36l-4 46H18Z" /><path fill={c.sageLight} d="M18 21h28l-3 30H21Z" /><circle cx="26" cy="30" r="3" fill={c.paper} /><circle cx="38" cy="39" r="4" fill={c.paper} /><circle cx="28" cy="45" r="2" fill={c.paper} /><path fill={c.orange} d="m37 4 4 1-8 23-4-1Z" /></Illustration>; }
