export function getThisWeeksFriday(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = 5 - day + (day > 5 ? 7 : 0);
    const friday = new Date(today.setDate(today.getDate() + diff));

    const month = friday.getMonth() + 1;
    const date = friday.getDate();
    return `${month}/${date}`;
}

export function getStartAndEndOfWeekStrings(date: Date = new Date()): { start: string; end: string } {
  const dayIndex = date.getDay(); // 0 = Sunday
  const start = new Date(date);
  start.setDate(date.getDate() - dayIndex);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const format = (d: Date) =>
    d.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  return {
    start: format(start),
    end: format(end),
  };
}
