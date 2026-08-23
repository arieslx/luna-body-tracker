export type SleepValue = {
  value: number;
  unit: "hour";
  bedtime?: string;
  wakeTime?: string;
};

const DEFAULT_BEDTIME = "23:00";

function parseTime(value: string | undefined) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return undefined;
  const [hour, minute] = value.split(":").map(Number);
  if (hour > 23 || minute > 59) return undefined;
  return hour * 60 + minute;
}

function formatMinutes(value: number) {
  const minutes = ((Math.round(value) % 1440) + 1440) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Adds concrete times to legacy duration-only sleep records. */
export function normalizeSleepValue(value: SleepValue): SleepValue {
  const durationMinutes = Math.round(value.value * 60);
  const bedtimeMinutes = parseTime(value.bedtime);
  const wakeTimeMinutes = parseTime(value.wakeTime);

  if (bedtimeMinutes !== undefined && wakeTimeMinutes !== undefined) return value;
  if (wakeTimeMinutes !== undefined) {
    return { ...value, bedtime: formatMinutes(wakeTimeMinutes - durationMinutes), wakeTime: formatMinutes(wakeTimeMinutes) };
  }

  const start = bedtimeMinutes ?? parseTime(DEFAULT_BEDTIME)!;
  return { ...value, bedtime: formatMinutes(start), wakeTime: formatMinutes(start + durationMinutes) };
}

/** Updates a duration while keeping the recorded bedtime as the time anchor. */
export function sleepValueFromDuration(duration: number, previous?: SleepValue): SleepValue {
  const bedtime = previous?.bedtime ?? DEFAULT_BEDTIME;
  return normalizeSleepValue({ value: duration, unit: "hour", bedtime });
}
