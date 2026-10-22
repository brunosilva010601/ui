import { CalendarSync, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { buttonClass } from '../button';
import { ControlStrut } from '../control-strut';
import { monthYear, weekdayName } from '../lib/dates';
import { cn } from '../lib/utils';
import { useUi } from '../provider';

const DAY_MS = 86_400_000;

const CELLS = 42;

type Props = {
    value: string;
    today: string;
    min?: string;
    marked?: (date: string) => boolean;
    onChange: (date: string) => void;
};

function iso(time: number): string {
    return new Date(time).toISOString().slice(0, 10);
}

export function Calendar(props: Props) {
    const { labels, locale, weekStart: offset } = useUi();
    const [shown, setShown] = useState(
        (props.value || props.today).slice(0, 7),
    );
    const [year, month] = shown.split('-').map(Number);
    const first = Date.UTC(year, month - 1, 1);
    const start =
        first - ((new Date(first).getUTCDay() - offset + 7) % 7) * DAY_MS;
    const days = Array.from({ length: CELLS }, (_, index) =>
        iso(start + index * DAY_MS),
    );
    const move = (step: number) =>
        setShown(iso(Date.UTC(year, month - 1 + step, 1)).slice(0, 7));
    const arrowClass = buttonClass({
        variant: 'ghost',
        square: true,
        bleed: true,
        className: '[&_svg]:size-icon-md',
    });
    const title = monthYear(locale, month, year);

    return (
        <div className="flex flex-col gap-sm">
            <div className="flex items-center">
                <ControlStrut />
                <div className="flex min-w-0 flex-1 items-center gap-md">
                    <span className="min-w-0 flex-1 truncate font-semibold">
                        {title}
                    </span>
                    <button
                        type="button"
                        aria-label={labels.previous}
                        className={arrowClass}
                        onClick={() => move(-1)}
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        type="button"
                        aria-label={labels.today}
                        className={arrowClass}
                        onClick={() => setShown(props.today.slice(0, 7))}
                    >
                        <CalendarSync />
                    </button>
                    <button
                        type="button"
                        aria-label={labels.next}
                        className={arrowClass}
                        onClick={() => move(1)}
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2xs text-center">
                {Array.from({ length: 7 }, (_, index) => (
                    <span
                        key={index}
                        className="text-xs font-semibold text-foreground-muted"
                    >
                        {weekdayName(locale, (index + offset) % 7, 'narrow')}
                    </span>
                ))}
                {days.map((day) => {
                    const selected = day === props.value;
                    const marked = !selected && props.marked?.(day);

                    return (
                        <button
                            key={day}
                            type="button"
                            aria-pressed={selected}
                            disabled={
                                props.min !== undefined && day < props.min
                            }
                            onClick={() => {
                                setShown(day.slice(0, 7));
                                props.onChange(day);
                            }}
                            className={cn(
                                'mx-auto size-10 cursor-pointer rounded-full text-sm transition-colors hover:bg-control-hover disabled:pointer-events-none disabled:opacity-40',
                                day.slice(0, 7) !== shown &&
                                    'text-foreground-faint',
                                day === props.today &&
                                    'font-semibold text-primary-text',
                                marked && 'bg-primary/20',
                                selected &&
                                    'bg-primary font-semibold text-primary-foreground hover:bg-primary',
                            )}
                        >
                            {Number(day.slice(8))}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
