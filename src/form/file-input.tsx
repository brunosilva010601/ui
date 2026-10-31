import { FileCheck, FileUp } from 'lucide-react';
import { useId } from 'react';
import { tintClass } from '../icon-badge';
import { cn } from '../lib/utils';
import { useUiLabels } from '../provider';
import { Field } from './field';
import type { FieldProps } from './field';

type Props = FieldProps & {
    accept?: string;
    file: File | null;
    onChange: (file: File | null) => void;
};

export function FileInput(props: Props) {
    const inputId = useId();
    const labels = useUiLabels();
    const Icon = props.file ? FileCheck : FileUp;

    return (
        <Field
            id={inputId}
            label={props.label}
            hideLabel={props.hideLabel ?? true}
            description={props.description}
            hint={props.hint}
            optional={props.optional}
            error={props.error}
        >
            <label
                className={cn(
                    'flex cursor-pointer items-center gap-12px rounded border border-dashed border-border bg-control p-12px transition-colors hover:bg-control-hover active:bg-control-hover has-focus-visible:border-primary',
                    props.file && `border-solid ${tintClass}`,
                    props.error && 'border-danger',
                    props.disabled && 'pointer-events-none opacity-50',
                )}
            >
                <Icon className="size-icon-20px shrink-0" />
                <span className="flex min-w-0 flex-col">
                    <span className="truncate text-14px font-semibold">
                        {props.file?.name ?? labels.chooseFile}
                    </span>
                    {props.accept && !props.file && (
                        <span className="text-12px text-foreground-muted">
                            {props.accept}
                        </span>
                    )}
                </span>
                <input
                    id={inputId}
                    type="file"
                    accept={props.accept}
                    disabled={props.disabled}
                    aria-invalid={props.error ? true : undefined}
                    className="sr-only"
                    onChange={(event) =>
                        props.onChange(event.target.files?.[0] ?? null)
                    }
                />
            </label>
        </Field>
    );
}
