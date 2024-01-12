export function isValidScheduleDate(date: Date): boolean {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    const isWithinBusinessHours = date.getHours() >= 8 && date.getHours() < 18;

    const isWeekday = date.getDay() > 0 && date.getDay() < 6;

    const isCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;

    const isAfterOrEqualCurrentDay = date.getDate() >= currentDay;

    const isValidMinutes = date.getMinutes() === 0 || date.getMinutes() === 30;

    return isWithinBusinessHours && isWeekday && isCurrentMonth && isAfterOrEqualCurrentDay && isValidMinutes;
}
