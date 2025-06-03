export function getThisWeeksFriday(): string {
    const today = new Date();
    const day = today.getDay();
    const diff = 5 - day + (day > 5 ? 7 : 0);
    const friday = new Date(today.setDate(today.getDate() + diff));

    const month = friday.getMonth() + 1;
    const date = friday.getDate();
    return `${month}/${date}`;
}