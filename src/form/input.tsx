import { useId } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from 'react';
import { touch } from '../lib/device';
import { cn } from '../lib/utils';
import { bareFieldClass, Field, fieldClass } from './field';
import type { FieldProps } from './field';

type Props = FieldProps & {
    hint?: string;
    optional?: boolean;
    bare?: boolean;
    ref?: Ref<HTMLInputElement>;
    type?: 'email' | 'search' | 'date' | 'time' | 'password';
    min?: string;
    max?: string;
    maxLength?: number;
    name?: string;
    className?: string;
    placeholder?: string;
    autoComplete?: string;
    autoCapitalize?: 'none';
    autoFocus?: boolean;
    enterKeyHint?: 'next' | 'done';
    inputMode?: 'decimal' | 'numeric';
    required?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export const plainTextField = touch
    ? ({
          type: 'search',
          role: 'textbox',
          enterKeyHint: 'done',
          autoCapitalize: 'sentences',
      } as const)
    : {};

export function Input(props: Props) {
    const {
        label,
        hideLabel,
        description,
        hint,
        optional,
        error,
        className,
        bare,
        ...rest
    } = props;
    const inputId = useId();
    const plain = props.type === undefined && props.autoComplete === undefined;

    return (
        <Field
            id={inputId}
            label={label}
            hideLabel={hideLabel}
            description={description}
            hint={hint}
            optional={optional}
            error={error}
        >
            <input
                id={inputId}
                aria-invalid={error ? true : undefined}
                autoComplete="off"
                {...(plain ? plainTextField : {})}
                className={cn(
                    bare ? bareFieldClass : fieldClass,
                    'leading-none',
                    className,
                )}
                {...rest}
            />
        </Field>
    );
}
