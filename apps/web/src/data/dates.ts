export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function precedingDateKeys(endDate = new Date(), count = 7): string[] {
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(endDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (count - offset - 1));
    return toLocalDateKey(date);
  });
}

export function currentWeekDateKeys(referenceDate = new Date()): string[] {
  const monday = new Date(referenceDate);
  monday.setHours(12, 0, 0, 0);
  const weekday = monday.getDay();
  monday.setDate(monday.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + offset);
    return toLocalDateKey(date);
  });
}
