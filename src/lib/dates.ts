const DAY_MS = 86_400_000;

const A_SUNDAY = Date.UTC(2023, 0, 1);

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function monthYear(locale: string, month: number, year: number): string {
    return capitalize(
        new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
        }).format(Date.UTC(year, month - 1, 1)),
    );
}

export function weekdayName(
    locale: string,
    day: number,
    width: 'long' | 'narrow' = 'long',
): string {
    return capitalize(
        new Intl.DateTimeFormat(locale, {
            weekday: width,
            timeZone: 'UTC',
        }).format(A_SUNDAY + day * DAY_MS),
    );
}
