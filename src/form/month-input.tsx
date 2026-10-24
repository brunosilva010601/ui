import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { monthYear } from '../lib/dates';
import { cn } from '../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { useUi } from '../provider';
import { Field } from './field';
import type { FieldProps } from './field';
import { stepButtonClass, stepperClass } from './number-input';

const MONTHS_IN_YEAR = 12;

const HOLD_DELAY_MS = 400;

const HOLD_REPEAT_MS = 150;

const HOLD_FASTEST_MS = 40;

const HOLD_ACCELERATION = 0.92;

const FUTURE_YEARS = 10;

type Month = {
    year: number;
    month: number;
};

type Props = FieldProps & {
    value: Month;
    min: Month;
    max?: Month;
    yearOnly?: boolean;
    onChange: (value: Month) => void;
};

function index(value: Month): number {
    return value.year * MONTHS_IN_YEAR + value.month - 1;
}

function fromIndex(value: number): Month {
    return {
        year: Math.floor(value / MONTHS_IN_YEAR),
        month: (value % MONTHS_IN_YEAR) + 1,
    };
}

function useRepeatOnHold(action: () => boolean) {
    const timer = useRef(0);
    const latest = useRef(action);
    latest.current = action;

    const stop = () => window.clearTimeout(timer.current);

    const start = (event: PointerEvent) => {
        event.preventDefault();

        if (!latest.current()) {
            return;
        }

        const repeat = (delay: number) => {
            timer.current = window.setTimeout(() => {
                if (latest.current()) {
                    repeat(
                        Math.max(HOLD_FASTEST_MS, delay * HOLD_ACCELERATION),
                    );
                }
            }, delay);
        };

        timer.current = window.setTimeout(
            () => repeat(HOLD_REPEAT_MS),
            HOLD_DELAY_MS,
        );
    };

    useEffect(() => stop, []);

    return {
        onPointerDown: start,
        onPointerUp: stop,
        onPointerLeave: stop,
        onPointerCancel: stop,
    };
}

type YearPickerProps = {
    value: number;
    first: number;
    last: number;
    onChange: (year: number) => void;
};

function YearPicker(props: YearPickerProps) {
    const years = Array.from(
        { length: props.last - props.first + 1 },
        (_, offset) => props.last - offset,
    );

    return (
        <div className="grid max-h-72 w-64 grid-cols-4 gap-xs overflow-y-auto p-sm">
            {years.map((year) => (
                <button
                    key={year}
                    type="button"
                    ref={(button) => {
                        if (button && year === props.value) {
                            button.scrollIntoView({ block: 'center' });
                        }
                    }}
                    onClick={() => props.onChange(year)}
                    className={cn(
                        'cursor-pointer rounded py-sm text-sm transition-colors hover:bg-control-hover',
                        year === props.value &&
                            'bg-foreground text-background hover:bg-foreground',
                    )}
                >
                    {year}
                </button>
            ))}
        </div>
    );
}

export function MonthInput(props: Props) {
    const inputId = useId();
    const { locale } = useUi();
    const [picking, setPicking] = useState(false);
    const unit = props.yearOnly ? MONTHS_IN_YEAR : 1;
    const current = useRef(index(props.value));
    current.current = index(props.value);
    const first = index(props.min);
    const last = props.max ? index(props.max) : Infinity;
    const atMin = current.current - unit < first;
    const atMax = current.current + unit > last;
    const text = props.yearOnly
        ? String(props.value.year)
        : monthYear(locale, props.value.month, props.value.year);

    const change = (next: number): boolean => {
        const clamped = Math.min(Math.max(next, first), last);

        if (clamped === current.current) {
            return false;
        }

        current.current = clamped;
        props.onChange(fromIndex(clamped));

        return true;
    };

    const step = (direction: number) =>
        change(current.current + direction * unit);

    const previous = useRepeatOnHold(() => step(-1));
    const next = useRepeatOnHold(() => step(1));

    const arrowKeys = (event: KeyboardEvent) => {
        const direction = {
            ArrowUp: 1,
            ArrowRight: 1,
            ArrowDown: -1,
            ArrowLeft: -1,
        }[event.key];

        if (direction) {
            event.preventDefault();
            step(direction);
        }
    };

    const pickYear = (year: number) => {
        change(index({ year, month: props.value.month }));
        setPicking(false);
    };

    return (
        <Field
            id={inputId}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            error={props.error}
        >
            <div className={stepperClass}>
                <button
                    type="button"
                    tabIndex={-1}
                    disabled={atMin}
                    className={stepButtonClass}
                    {...previous}
                >
                    <ChevronLeft />
                </button>
                <Popover open={picking} onOpenChange={setPicking}>
                    <PopoverTrigger asChild>
                        <button
                            id={inputId}
                            type="button"
                            role="spinbutton"
                            aria-valuenow={current.current}
                            aria-valuetext={text}
                            aria-invalid={props.error ? true : undefined}
                            onKeyDown={arrowKeys}
                            className="cursor-pointer py-sm text-center leading-5 font-semibold text-foreground outline-none [text-box:normal]"
                        >
                            {text}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <YearPicker
                            value={props.value.year}
                            first={props.min.year}
                            last={
                                props.max?.year ??
                                new Date().getFullYear() + FUTURE_YEARS
                            }
                            onChange={pickYear}
                        />
                    </PopoverContent>
                </Popover>
                <button
                    type="button"
                    tabIndex={-1}
                    disabled={atMax}
                    className={stepButtonClass}
                    {...next}
                >
                    <ChevronRight />
                </button>
            </div>
        </Field>
    );
}
