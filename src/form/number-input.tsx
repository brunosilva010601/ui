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

const HOLD_DELAY_MS = 400;
const HOLD_START_MS = 150;
const HOLD_FASTEST_MS = 30;
const HOLD_SPEEDUP = 0.85;

type Props = FieldProps & {
    value: number | '';
    min: number;
    max: number;
    step?: number;
    pad?: number;
    start?: number;
    wrap?: boolean;
    onChange: (value: number | '') => void;
};

export function NumberInput(props: Props) {
    const inputId = useId();
    const labels = useUiLabels();
    const timer = useRef<number | undefined>(undefined);
    const current = useRef(0);
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

    const step = (delta: number): boolean => {
        current.current = next(current.current + delta);
        props.onChange(current.current);

        return next(current.current + delta) !== current.current;
    };

    const startFrom = (delta: number) => {
        current.current =
            props.value !== ''
                ? props.value
                : (props.start ?? props.min) - delta;
    };

    const hold = (delta: number, delay: number) => {
        timer.current = window.setTimeout(() => {
            if (step(delta)) {
                hold(delta, Math.max(HOLD_FASTEST_MS, delay * HOLD_SPEEDUP));
            }
        }, delay);
    };

    const press = (delta: number) => {
        startFrom(delta);

        if (step(delta)) {
            timer.current = window.setTimeout(
                () => hold(delta, HOLD_START_MS),
                HOLD_DELAY_MS - HOLD_START_MS,
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

    const arrowKeys = (event: KeyboardEvent) => {
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
            aria-label={
                delta > 0 ? labels.increase : labels.decrease
            }
            disabled={
                !props.wrap &&
                props.value !== '' &&
                (delta > 0
                    ? props.value >= props.max
                    : props.value <= props.min)
            }
            onPointerDown={() => press(delta)}
            onPointerUp={release}
            onPointerLeave={release}
            onPointerCancel={release}
            onClick={keyboardClick(delta)}
            className={stepButtonClass}
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
            error={props.error}
        >
            <div className={stepperClass}>
                {stepButton(-size)}
                <input
                    id={inputId}
                    {...plainTextField}
                    role="spinbutton"
                    inputMode="numeric"
                    autoComplete="off"
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
                    onBlur={() =>
                        props.value !== '' && props.onChange(clamp(props.value))
                    }
                    onKeyDown={arrowKeys}
                    className="min-w-0 bg-transparent py-sm text-center font-semibold text-foreground tabular-nums outline-none"
                />
                {stepButton(size)}
            </div>
        </Field>
    );
}
