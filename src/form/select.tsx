import { Check, ChevronDown } from 'lucide-react';
import { useId } from 'react';
import type { ReactNode } from 'react';
import { DropdownItem, DropdownMenu } from '../dropdown-menu';
import { describedBy, Field, fieldClass } from './field';
import type { FieldProps } from './field';

type Option<T extends string> = {
    value: T;
    label: string;
    description?: string;
    lang?: string;
    content?: ReactNode;
};

type Props<T extends string> = Omit<FieldProps, 'label'> & {
    label: string;
    value: T;
    options: Option<T>[];
    className?: string;
    onChange: (value: T) => void;
};

type OptionTextProps<T extends string> = {
    option: Option<T>;
};

function OptionText<T extends string>(props: OptionTextProps<T>) {
    return (
        <span
            className="flex min-w-0 flex-1 items-center gap-2"
            lang={props.option.lang}
        >
            {props.option.content ?? (
                <span className="truncate">{props.option.label}</span>
            )}
        </span>
    );
}

export function Select<T extends string>(props: Props<T>) {
    const id = useId();
    const current = props.options.find(
        (option) => option.value === props.value,
    );

    return (
        <Field
            id={id}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            hint={props.hint}
            optional={props.optional}
            error={props.error}
            className={props.className}
        >
            <DropdownMenu
                choice
                wide
                label={props.label}
                align="start"
                trigger={
                    <button
                        id={id}
                        type="button"
                        disabled={props.disabled}
                        aria-invalid={props.error ? true : undefined}
                        aria-describedby={describedBy(id, props)}
                        className={`${fieldClass} flex cursor-pointer items-center gap-2 text-left`}
                    >
                        {current && <OptionText option={current} />}
                        <ChevronDown className="size-4 shrink-0 text-foreground-muted" />
                    </button>
                }
            >
                {props.options.map((option) => (
                    <DropdownItem
                        key={option.value}
                        selected={option.value === props.value}
                        onSelect={() => props.onChange(option.value)}
                    >
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <OptionText option={option} />
                            {option.description && (
                                <span className="ui-note">
                                    {option.description}
                                </span>
                            )}
                        </span>
                        {option.value === props.value && <Check />}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Field>
    );
}
