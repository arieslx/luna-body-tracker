import type { ReactNode } from "react";
import { Illustration } from "../Illustration";
import { lunaPalette as c } from "../palette";
import type { IllustrationProps } from "../types";

const faceLine = {
  fill: "none",
  stroke: c.ink,
  strokeWidth: 1.55,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function MoodBase({
  title,
  color,
  shape,
  children,
  ...props
}: IllustrationProps & { title: string; color: string; shape: string; children: ReactNode }) {
  return <Illustration title={title} {...props}><path fill={color} d={shape} />{children}</Illustration>;
}

export function CalmIllustration(props: IllustrationProps) {
  return <MoodBase title="Calm" color={c.sageLight} shape="M7 32C7 16 17 7 32 7c16 0 25 10 25 25 0 16-9 25-25 25S7 48 7 32Z" {...props}><circle cx="24" cy="28.5" r="1.55" fill={c.ink} /><circle cx="40" cy="28.5" r="1.55" fill={c.ink} /><path {...faceLine} d="M27 37q5 6 10 0" /></MoodBase>;
}

export function HappyIllustration(props: IllustrationProps) {
  return <MoodBase title="Happy" color={c.yellow} shape="M8 30C9 15 19 7 34 8c15 0 23 10 22 25-1 15-10 24-25 24C16 56 7 46 8 30Z" {...props}><path {...faceLine} d="m21 25 5 4-5 4m22-8-5 4 5 4M27 38q5 6 10 0" /></MoodBase>;
}

export function TiredIllustration(props: IllustrationProps) {
  return <MoodBase title="Tired" color={c.softGray} shape="M7 33C7 18 17 9 32 8c15 0 25 9 25 24 0 16-9 25-25 25S7 49 7 33Z" {...props}><ellipse cx="24.5" cy="32" rx="4" ry="2.6" fill={c.warmGray} opacity=".2" /><ellipse cx="39.5" cy="32" rx="4" ry="2.6" fill={c.warmGray} opacity=".2" /><circle cx="24.5" cy="29.5" r="1.35" fill={c.ink} /><circle cx="39.5" cy="29.5" r="1.35" fill={c.ink} /><path {...faceLine} d="M28 41q4-2 8 0" /></MoodBase>;
}

export function SadIllustration(props: IllustrationProps) {
  return <MoodBase title="Sad" color={c.blue} shape="M8 31C8 16 18 7 33 7c15 0 24 10 24 25 0 16-10 25-25 25S7 47 8 31Z" {...props}><circle cx="24.5" cy="31" r="1.25" fill={c.ink} /><circle cx="39.5" cy="31" r="1.25" fill={c.ink} /><path fill={c.blueLight} d="M24.5 34c2 2.5 2 4.4 0 5.2-2-.8-2-2.7 0-5.2Zm15 0c2 2.5 2 4.4 0 5.2-2-.8-2-2.7 0-5.2Z" /><path {...faceLine} d="M27 44q5-6 10 0" /><path {...faceLine} opacity=".58" d="m21.5 26 5-1m11 0 5 1" /></MoodBase>;
}

export function EmoIllustration(props: IllustrationProps) {
  return <MoodBase title="Emo" color={c.lavender} shape="M7 31C8 16 18 8 32 7c16 0 25 9 25 25 0 15-9 25-24 25C17 58 7 47 7 31Z" {...props}><circle cx="24.5" cy="30" r="1.8" {...faceLine} /><circle cx="39.5" cy="31" r="1.8" {...faceLine} /><path {...faceLine} d="m28 41 8 1" /></MoodBase>;
}

export function AngryIllustration(props: IllustrationProps) {
  return <MoodBase title="Angry" color={c.coral} shape="M8 32C8 17 17 8 32 7c15 0 25 10 25 25 0 16-10 25-25 25S8 48 8 32Z" {...props}><path {...faceLine} d="m21 27 6 2m16-2-6 2M28.5 41q3.5-2 7 0" /><circle cx="26" cy="33" r="1.2" fill={c.ink} /><circle cx="38" cy="33" r="1.2" fill={c.ink} /></MoodBase>;
}
