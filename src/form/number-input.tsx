import { Minus, Plus } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { buttonClass } from '../button';
import { cn } from '../lib/utils';
import { useUiLabels } from '../provider';
import { Field } from './field';
import type { FieldProps } from './field';
import { plainTextField } from './input';

export const stepperClass =
    'grid grid-cols-[auto_1fr_auto] rounded border border-border bg-control transition-shadow focus-within:border-primary focus-within:ring-1 focus-within:ring-primary has-aria-invalid:border-danger has-aria-invalid:focus-within:ring-danger';

export const stepButtonClass = cn(
    buttonClass({ variant: 'ghost', square: true }),
    'py-0',
);

const bareStepButtonClass = buttonClass({ variant: 'ghost', square: true });

const HOLD_DELAY_MS = 400;
const HOLD_START_MS = 150;
const HOLD_FASTEST_MS = 30;
const HOLD_SPEEDUP = 0.85;
const RUSH_TICK_MS = 80;

const RUSH_STAGES = [
    { after: 30, factor: 25 },
    { after: 12, factor: 5 },
];

function rushFactor(ticks: number): number {
    return RUSH_STAGES.find((stage) => ticks >= stage.after)?.factor ?? 1;
}

type Props = FieldProps & {
    value: number | '';
    min: number;
    max: number;
    step?: number;
    pad?: number;
    start?: number;
    wrap?: boolean;
    bare?: boolean;
    rush?: boolean;
    className?: string;
    onBlur?: () => void;
    onChange: (value: number | '') => void;
};

export function NumberInput(props: Props) {
    const inputId = useId();
    const labels = useUiLabels();
    const timer = useRef<number | undefined>(undefined);
    const current = useRef(0);
    const ticks = useRef(0);
    const size = props.step ?? 1;

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const clamp = (value: number) =>
        Math.min(props.max, Math.max(props.min, value));

    const top = props.max - ((props.max - props.min) % size);

    const next = (value: number) => {
        if (!props.wrap) {
            return clamp(value);
        }

        if (value > props.max) {
            return props.min;
        }

        return value < props.min ? top : value;
    };

    const rushed = (delta: number): number => {
        const factor = props.rush ? rushFactor(ticks.current) : 1;
        const jump = Math.abs(delta) * factor;
        const aligned =
            factor === 1
                ? current.current
                : delta > 0
                  ? Math.floor(current.current / jump) * jump
                  : Math.ceil(current.current / jump) * jump;

        return aligned + Math.sign(delta) * jump;
    };

    const step = (delta: number): boolean => {
        current.current = next(rushed(delta));
        props.onChange(current.current);

        return next(current.current + delta) !== current.current;
    };

    const startFrom = (delta: number) => {
        ticks.current = 0;
        current.current =
            props.value !== ''
                ? props.value
                : (props.start ?? props.min) - delta;
    };

    const hold = (delta: number, delay: number) => {
        timer.current = window.setTimeout(() => {
            ticks.current++;

            if (step(delta)) {
                hold(
                    delta,
                    props.rush
                        ? RUSH_TICK_MS
                        : Math.max(HOLD_FASTEST_MS, delay * HOLD_SPEEDUP),
                );
            }
        }, delay);
    };

    const press = (delta: number) => {
        startFrom(delta);

        if (step(delta)) {
            timer.current = window.setTimeout(
                () => hold(delta, props.rush ? RUSH_TICK_MS : HOLD_START_MS),
                HOLD_DELAY_MS - (props.rush ? RUSH_TICK_MS : HOLD_START_MS),
            );
        }
    };

    const release = () => window.clearTimeout(timer.current);

    const keyboardClick = (delta: number) => (event: MouseEvent) => {
        if (event.detail === 0) {
            startFrom(delta);
            step(delta);
        }
    };

    const enterKey = (event: KeyboardEvent<HTMLInputElement>) => {
        const fixed =
            props.value === '' ? (props.start ?? '') : clamp(props.value);

        if (fixed !== props.value) {
            event.preventDefault();
            props.onChange(fixed);
        }

        if (props.bare) {
            event.currentTarget.blur();
        }
    };

    const keys = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            enterKey(event);

            return;
        }

        const delta = { ArrowUp: size, ArrowDown: -size }[event.key];

        if (delta) {
            event.preventDefault();
            startFrom(delta);
            step(delta);
        }
    };

    const stepButton = (delta: number) => (
        <button
            type="button"
            tabIndex={-1}
            aria-label={delta > 0 ? labels.increase : labels.decrease}
            disabled={
                props.disabled ||
                (!props.wrap &&
                    props.value !== '' &&
                    (delta > 0
                        ? props.value >= props.max
                        : props.value <= props.min))
            }
            onPointerDown={() => press(delta)}
            onPointerUp={release}
            onPointerLeave={release}
            onPointerCancel={release}
            onClick={keyboardClick(delta)}
            className={props.bare ? bareStepButtonClass : stepButtonClass}
        >
            {delta > 0 ? <Plus /> : <Minus />}
        </button>
    );

    return (
        <Field
            id={inputId}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            hint={props.hint}
            optional={props.optional}
            error={props.error}
        >
            <div
                className={cn(
                    props.bare
                        ? 'grid w-fit grid-cols-[auto_auto_auto] items-center gap-8px'
                        : stepperClass,
                    props.className,
                )}
            >
                {stepButton(-size)}
                <input
                    id={inputId}
                    {...plainTextField}
                    role="spinbutton"
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={props.disabled}
                    style={
                        props.bare
                            ? {
                                  width: `${Math.max(String(props.max).length, props.pad ?? 0) + 1}ch`,
                              }
                            : undefined
                    }
                    aria-valuemin={props.min}
                    aria-valuemax={props.max}
                    aria-valuenow={props.value === '' ? undefined : props.value}
                    aria-invalid={props.error ? true : undefined}
                    value={
                        props.value === ''
                            ? ''
                            : String(props.value).padStart(props.pad ?? 0, '0')
                    }
                    onChange={(event) => {
                        const digits = event.target.value.replace(/\D/g, '');
                        props.onChange(digits === '' ? '' : Number(digits));
                    }}
                    onBlur={() => {
                        if (props.value !== '') {
                            props.onChange(clamp(props.value));
                        }

                        props.onBlur?.();
                    }}
                    onKeyDown={keys}
                    className={cn(
                        'min-w-0 bg-transparent py-8px text-center text-foreground tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-50',
                        props.bare ? 'text-30px font-bold' : 'font-semibold',
                        props.bare && props.error && 'text-danger',
                    )}
                />
                {stepButton(size)}
            </div>
        </Field>
    );
}
