import { Check, ChevronDown } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { Button } from '../button';
import { itemClass, menuPanelClass } from '../dropdown-menu';
import { cn, folded } from '../lib/utils';
import { Popover, PopoverAnchor, PopoverContent } from '../popover';
import { useUiLabels } from '../provider';
import {
    bareFieldClass,
    describedBy,
    Field,
    fieldClass,
    fieldPlaceholder,
} from './field';
import type { FieldProps } from './field';
import { usePlainTextField } from './input';

type Props = FieldProps & {
    value: string;
    suggestions: string[];
    maxLength?: number;
    placeholder?: string;
    descriptionAside?: boolean;
    onChange: (value: string) => void;
    onPick?: (value: string) => void;
};

export function SuggestInput(props: Props) {
    const { value, suggestions, onChange, onPick } = props;
    const labels = useUiLabels();
    const inputId = useId();
    const listId = useId();
    const plainTextField = usePlainTextField();
    const box = useRef<HTMLDivElement>(null);
    const [browsing, setBrowsing] = useState(false);
    const [focused, setFocused] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [active, setActive] = useState(-1);
    const typed = folded(value.trim());
    const exact = suggestions.some((suggestion) => folded(suggestion) === typed);
    const list = browsing
        ? suggestions
        : typed && !exact
          ? suggestions.filter((suggestion) =>
                folded(suggestion).includes(typed),
            )
          : [];
    const open = list.length > 0 && (browsing || (focused && !dismissed));

    const close = () => {
        setBrowsing(false);
        setDismissed(true);
        setActive(-1);
    };

    const pick = (suggestion: string) => {
        (onPick ?? onChange)(suggestion);
        close();
    };

    const move = (step: number) =>
        setActive(
            ((active + 1 + step + list.length + 1) % (list.length + 1)) - 1,
        );

    const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!open) {
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            move(event.key === 'ArrowDown' ? 1 : -1);
        }

        if (event.key === 'Enter' && list[active]) {
            event.preventDefault();
            pick(list[active]);
        }
    };

    return (
        <Field
            id={inputId}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            descriptionAside={props.descriptionAside}
            hint={props.hint}
            optional={props.optional}
            error={props.error}
        >
            <Popover open={open} onOpenChange={(next) => !next && close()}>
                <PopoverAnchor
                    virtualRef={box as RefObject<HTMLDivElement>}
                />
                <div
                    ref={box}
                    className={cn(
                        fieldClass,
                        'flex items-center gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
                        props.error &&
                            'border-danger focus-within:border-danger focus-within:ring-danger',
                        props.disabled && 'opacity-50',
                    )}
                >
                    <input
                        {...plainTextField}
                        id={inputId}
                        role="combobox"
                        aria-expanded={open}
                        aria-controls={listId}
                        aria-autocomplete="list"
                        aria-activedescendant={
                            open && list[active]
                                ? `${listId}-${active}`
                                : undefined
                        }
                        aria-invalid={props.error ? true : undefined}
                        aria-describedby={describedBy(inputId, props)}
                        autoComplete="off"
                        className={bareFieldClass}
                        placeholder={fieldPlaceholder(props)}
                        maxLength={props.maxLength}
                        disabled={props.disabled}
                        value={value}
                        onChange={(event) => {
                            setBrowsing(false);
                            setDismissed(false);
                            setActive(-1);
                            onChange(event.target.value);
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={keyDown}
                    />
                    {suggestions.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            square
                            bleed
                            aria-label={labels.suggestions}
                            aria-expanded={open}
                            aria-controls={listId}
                            disabled={props.disabled}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() =>
                                browsing ? close() : setBrowsing(true)
                            }
                        >
                            <ChevronDown
                                className={cn(
                                    'transition-transform',
                                    open && 'rotate-180',
                                )}
                            />
                        </Button>
                    )}
                </div>
                <PopoverContent
                    align="start"
                    className="w-(--radix-popover-trigger-width) overflow-hidden"
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    onInteractOutside={(event) => {
                        if (box.current?.contains(event.target as Node)) {
                            event.preventDefault();
                        }
                    }}
                >
                    <div
                        id={listId}
                        role="listbox"
                        className={cn(menuPanelClass, 'max-h-80')}
                    >
                        {list.map((suggestion, at) => (
                            <button
                                key={suggestion}
                                id={`${listId}-${at}`}
                                type="button"
                                role="option"
                                tabIndex={-1}
                                aria-selected={at === active}
                                data-state={at === active ? 'on' : 'off'}
                                className={itemClass}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => pick(suggestion)}
                            >
                                <span className="min-w-0 flex-1">
                                    {suggestion}
                                </span>
                                {folded(suggestion) === typed && <Check />}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </Field>
    );
}
