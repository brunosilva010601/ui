import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '../lib/utils';
import { Field, fieldClass } from './field';
import type { FieldProps } from './field';
import { plainTextField } from './input';

const bareClass =
    'w-full min-w-0 border border-transparent bg-transparent py-4px text-foreground outline-none placeholder:text-foreground-muted';

type Props = FieldProps & {
    bare?: boolean;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
    maxLength?: number;
    autoFocus?: boolean;
    enterKeyHint?: 'send';
    value: string;
    ranges: [number, number][];
    onChange: (value: string) => void;
};

function pieces(value: string, ranges: [number, number][]) {
    const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
    const result: { text: string; marked: boolean }[] = [];
    let cursor = 0;

    for (const [start, end] of sorted) {
        result.push({ text: value.slice(cursor, start), marked: false });
        result.push({ text: value.slice(start, end), marked: true });
        cursor = end;
    }

    result.push({ text: value.slice(cursor), marked: false });

    return result.filter((piece) => piece.text !== '');
}

export function HighlightInput(props: Props) {
    const id = useId();
    const [scroll, setScroll] = useState(0);
    const surface = props.bare ? bareClass : fieldClass;

    return (
        <Field
            id={id}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            hint={props.hint}
            optional={props.optional}
            error={props.error}
        >
            <div className="relative">
                <div
                    aria-hidden
                    className={cn(
                        surface,
                        'pointer-events-none absolute inset-0 overflow-hidden whitespace-pre',
                        props.disabled && 'opacity-50',
                    )}
                >
                    <span
                        className="inline-block"
                        style={{ transform: `translateX(-${scroll}px)` }}
                    >
                        {pieces(props.value, props.ranges).map(
                            (piece, index) =>
                                piece.marked ? (
                                    <span
                                        key={index}
                                        className="text-primary-text"
                                    >
                                        {piece.text}
                                    </span>
                                ) : (
                                    piece.text
                                ),
                        )}
                    </span>
                </div>
                <input
                    id={id}
                    aria-invalid={props.error ? true : undefined}
                    autoComplete="off"
                    {...plainTextField}
                    autoFocus={props.autoFocus}
                    disabled={props.disabled}
                    {...(props.enterKeyHint
                        ? { enterKeyHint: props.enterKeyHint }
                        : {})}
                    placeholder={props.placeholder}
                    maxLength={props.maxLength}
                    value={props.value}
                    onChange={(event) => props.onChange(event.target.value)}
                    onKeyDown={props.onKeyDown}
                    onBlur={props.onBlur}
                    onScroll={(event) =>
                        setScroll(event.currentTarget.scrollLeft)
                    }
                    className={cn(
                        surface,
                        'relative bg-transparent text-transparent caret-foreground',
                    )}
                />
            </div>
        </Field>
    );
}
