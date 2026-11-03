import { useId, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from 'react';
import { cn } from '../lib/utils';
import { bareFieldClass, describedBy, Field, fieldClass } from './field';
import type { FieldProps } from './field';

const sizes = {
    md: 'max-h-[168px] min-h-[80px]',
    lg: 'max-h-[384px] min-h-[192px]',
};

type Props = FieldProps & {
    ref?: Ref<HTMLTextAreaElement>;
    size?: keyof typeof sizes;
    bare?: boolean;
    className?: string;
    autoFocus?: boolean;
    required?: boolean;
    rows?: number;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    defaultValue?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: () => void;
    onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export function Textarea(props: Props) {
    const {
        label,
        hideLabel,
        description,
        hint,
        optional,
        error,
        size,
        bare,
        className,
        ...rest
    } = props;
    const textareaId = useId();
    const [typed, setTyped] = useState(props.defaultValue?.length ?? 0);
    const length = props.value?.length ?? typed;
    const counted = Boolean(props.maxLength) && !bare;

    return (
        <Field
            id={textareaId}
            label={label}
            hideLabel={hideLabel}
            description={
                counted ? (
                    <span className="tabular-nums">
                        {length}/{props.maxLength}
                    </span>
                ) : (
                    description
                )
            }
            descriptionAside={counted}
            hint={hint}
            optional={optional}
            error={error}
        >
            <textarea
                id={textareaId}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(textareaId, {
                    description: counted || description,
                    error,
                })}
                autoComplete="off"
                className={cn(
                    'field-sizing-content resize-none',
                    bare ? bareFieldClass : [fieldClass, sizes[size ?? 'md']],
                    className,
                )}
                {...rest}
                onChange={(event) => {
                    setTyped(event.target.value.length);
                    props.onChange?.(event);
                }}
            />
        </Field>
    );
}
