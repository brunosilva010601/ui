import { Check, ChevronDown } from 'lucide-react';
import { useId } from 'react';
import type { ReactNode } from 'react';
import { DropdownItem, DropdownMenu } from '../dropdown-menu';
import { Field } from './field';

type Option<T extends string> = {
    value: T;
    label: string;
    emoji?: string;
    lang?: string;
    content?: ReactNode;
};

type Props<T extends string> = {
    label: string;
    description?: string;
    hint?: string;
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
            className="flex min-w-0 flex-1 items-center gap-sm"
            lang={props.option.lang}
        >
            {props.option.content ?? (
                <>
                    {props.option.emoji && (
                        <span aria-hidden>{props.option.emoji}</span>
                    )}
                    <span className="truncate">{props.option.label}</span>
                </>
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
            description={props.description}
            hint={props.hint}
            className={props.className}
        >
            <DropdownMenu
                choice
                variant="field"
                label={props.label}
                align="start"
                trigger={
                    <>
                        {current && <OptionText option={current} />}
                        <ChevronDown className="size-icon-sm shrink-0 text-foreground-muted" />
                    </>
                }
            >
                {props.options.map((option) => (
                    <DropdownItem
                        key={option.value}
                        asChild
                        selected={option.value === props.value}
                    >
                        <button
                            type="button"
                            onClick={() => props.onChange(option.value)}
                        >
                            <OptionText option={option} />
                            {option.value === props.value && <Check />}
                        </button>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Field>
    );
}
