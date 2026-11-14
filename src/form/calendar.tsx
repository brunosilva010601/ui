import {
    CalendarSync,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { buttonClass } from '../button';
import { ControlStrut } from '../control-strut';
import { DropdownMenu } from '../dropdown-menu';
import { monthName, monthYear, weekdayName } from '../lib/dates';
import { cn } from '../lib/utils';
import { useUi, useUiLabels } from '../provider';

const DAY_MS = 86_400_000;

const CELLS = 42;

const MONTHS = 12;

export type CalendarTone = 'done' | 'skipped' | 'missed';

const tones: Record<CalendarTone, string> = {
    done: 'bg-primary font-semibold text-primary-foreground',
    skipped: 'bg-foreground/10 text-foreground-muted line-through',
    missed: 'border border-dashed border-danger text-danger',
};

type Props = {
    value?: string;
    today: string;
    min?: string;
    marked?: (date: string) => boolean;
    tone?: (date: string) => CalendarTone | undefined;
    legend?: Partial<Record<CalendarTone, string>>;
    onChange?: (date: string) => void;
    onMonth?: (month: string) => void;
    dayMenu?: {
        label: string;
        items: (date: string) => ReactNode;
    };
};

function iso(time: number): string {
    return new Date(time).toISOString().slice(0, 10);
}

export function Calendar(props: Props) {
    const { locale, weekStart: offset } = useUi();
    const labels = useUiLabels();
    const [shown, setShown] = useState(
        (props.value || props.today).slice(0, 7),
    );
    const [months, setMonths] = useState(false);
    const onMonth = useRef(props.onMonth);

    onMonth.current = props.onMonth;

    useEffect(() => onMonth.current?.(shown), [shown]);
    const [year, month] = shown.split('-').map(Number);
    const first = Date.UTC(year, month - 1, 1);
    const start =
        first - ((new Date(first).getUTCDay() - offset + 7) % 7) * DAY_MS;
    const days = Array.from({ length: CELLS }, (_, index) =>
        iso(start + index * DAY_MS),
    );
    const move = (step: number) =>
        setShown(
            iso(
                Date.UTC(year, month - 1 + (months ? step * MONTHS : step), 1),
            ).slice(0, 7),
        );
    const pickMonth = (chosen: number) => {
        setShown(iso(Date.UTC(year, chosen - 1, 1)).slice(0, 7));
        setMonths(false);
    };
    const showToday = () => {
        setShown(props.today.slice(0, 7));
        setMonths(false);
    };
    const arrowClass = buttonClass({
        variant: 'ghost',
        square: true,
        bleed: true,
    });
    const title = monthYear(locale, month, year);
    const picked = props.value?.slice(0, 7);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center">
                <ControlStrut />
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex min-w-0 flex-1">
                        <button
                            type="button"
                            aria-expanded={months}
                            className="flex min-w-0 cursor-pointer items-center gap-2 font-semibold"
                            onClick={() => setMonths(!months)}
                        >
                            <span className="truncate">
                                {months ? year : title}
                            </span>
                            <ChevronDown
                                className={cn(
                                    'size-4 shrink-0 text-foreground-muted transition-transform',
                                    months && 'rotate-180',
                                )}
                            />
                        </button>
                    </div>
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
                        onClick={showToday}
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
            <div className="grid">
                {months && (
                    <div className="col-start-1 row-start-1 grid grid-cols-4 grid-rows-3 items-center text-center">
                        {Array.from({ length: MONTHS }, (_, index) => {
                            const value = `${year}-${String(index + 1).padStart(2, '0')}`;

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={value === picked}
                                    disabled={
                                        props.min !== undefined &&
                                        value < props.min.slice(0, 7)
                                    }
                                    onClick={() => pickMonth(index + 1)}
                                    className={cn(
                                        'mx-auto cursor-pointer rounded-full px-3 py-2.5 text-sm transition-colors hover:bg-control-hover disabled:pointer-events-none disabled:opacity-40',
                                        value === props.today.slice(0, 7) &&
                                            'font-semibold text-primary-text',
                                        value === picked &&
                                            'bg-primary font-semibold text-primary-foreground hover:bg-primary',
                                    )}
                                >
                                    {monthName(locale, index + 1)}
                                </button>
                            );
                        })}
                    </div>
                )}
                <div
                    className={cn(
                        'col-start-1 row-start-1 grid grid-cols-7 gap-0.5 text-center',
                        months && 'invisible',
                    )}
                >
                    {Array.from({ length: 7 }, (_, index) => (
                        <span
                            key={index}
                            className="text-xs font-semibold text-foreground-muted"
                        >
                            {weekdayName(
                                locale,
                                (index + offset) % 7,
                                'narrow',
                            )}
                        </span>
                    ))}
                    {days.map((day) => {
                        const selected = day === props.value;
                        const marked = !selected && props.marked?.(day);
                        const tone = props.tone?.(day);
                        const pick = props.onChange;

                        if (!pick) {
                            const items = props.dayMenu?.items(day);
                            const cellClass = cn(
                                'mx-auto flex size-10 items-center justify-center rounded-full text-sm',
                                day.slice(0, 7) !== shown &&
                                    'text-foreground-faint',
                                day === props.today &&
                                    'font-semibold text-primary-text',
                                tone && tones[tone],
                            );

                            if (props.dayMenu && items) {
                                return (
                                    <DropdownMenu
                                        key={day}
                                        label={props.dayMenu.label}
                                        align="center"
                                        trigger={
                                            <button
                                                type="button"
                                                className={cn(
                                                    cellClass,
                                                    'cursor-pointer transition-colors data-[state=open]:outline-2 data-[state=open]:outline-offset-2 data-[state=open]:outline-foreground/30',
                                                    !tone &&
                                                        'hover:bg-control-hover',
                                                )}
                                            >
                                                {Number(day.slice(8))}
                                            </button>
                                        }
                                    >
                                        {items}
                                    </DropdownMenu>
                                );
                            }

                            return (
                                <span key={day} className={cellClass}>
                                    {Number(day.slice(8))}
                                </span>
                            );
                        }

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
                                    pick(day);
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
            {props.legend && (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {(Object.keys(tones) as CalendarTone[])
                        .filter((tone) => props.legend?.[tone])
                        .map((tone) => (
                            <span
                                key={tone}
                                className="flex items-center gap-2 ui-note"
                            >
                                <span
                                    className={cn(
                                        'size-3 rounded-full',
                                        tones[tone],
                                    )}
                                />
                                {props.legend?.[tone]}
                            </span>
                        ))}
                </div>
            )}
        </div>
    );
}
