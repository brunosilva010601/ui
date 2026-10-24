import { OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';
import { useId, useRef } from 'react';
import { cn } from '../lib/utils';
import { Field } from './field';
import type { FieldProps } from './field';

const CODE_LENGTH = 6;

type Props = FieldProps & {
    name: string;
    autoFocus?: boolean;
    submitOnComplete?: boolean;
};

function onlyDigits(text: string): string {
    return text.normalize('NFKC').replace(/\D/g, '');
}

export function CodeInput(props: Props) {
    const inputId = useId();
    const input = useRef<HTMLInputElement>(null);

    return (
        <Field
            id={inputId}
            label={props.label}
            hideLabel={props.hideLabel}
            description={props.description}
            error={props.error}
            className="justify-items-center text-center"
        >
            <OTPInput
                ref={input}
                id={inputId}
                name={props.name}
                maxLength={CODE_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                pasteTransformer={(pasted) =>
                    onlyDigits(pasted).slice(0, CODE_LENGTH)
                }
                autoFocus={props.autoFocus}
                onComplete={() =>
                    props.submitOnComplete &&
                    input.current?.form?.requestSubmit()
                }
                aria-invalid={props.error ? true : undefined}
                containerClassName="flex items-center justify-center gap-sm has-[:disabled]:opacity-50"
                render={({ slots }) => (
                    <>
                        {slots.map((slot, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'relative flex w-11 items-center justify-center rounded border border-border bg-control py-sm font-bold transition-shadow',
                                    slot.isActive &&
                                        'border-primary ring-1 ring-primary',
                                    props.error && 'border-danger',
                                )}
                            >
                                {slot.char ?? ' '}
                            </div>
                        ))}
                    </>
                )}
            />
        </Field>
    );
}
