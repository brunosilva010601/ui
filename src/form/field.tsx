import type { ReactNode } from 'react';
import { Hint } from '../hint';
import { cn } from '../lib/utils';
import { useUiLabels } from '../provider';

export const fieldClass =
    'border border-border rounded bg-control text-foreground placeholder:text-foreground-muted w-full min-w-0 px-md py-md transition-shadow outline-none focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger';

export const bareFieldClass =
    'w-full min-w-0 bg-transparent outline-none [text-decoration:inherit] placeholder:text-foreground-muted disabled:cursor-not-allowed disabled:opacity-50';

export type FieldProps = {
    label?: ReactNode;
    hideLabel?: boolean;
    description?: ReactNode;
    error?: string;
};

type LabelProps = {
    htmlFor?: string;
    className?: string;
    children: ReactNode;
};

function Label(props: LabelProps) {
    const { className, ...rest } = props;

    return (
        <label
            className={cn('block text-sm text-foreground', className)}
            {...rest}
        />
    );
}

type FieldErrorProps = {
    message?: string;
};

export function FieldError(props: FieldErrorProps) {
    if (!props.message) {
        return null;
    }

    return <p className="text-sm text-danger">{props.message}</p>;
}

type Props = FieldProps & {
    id?: string;
    optional?: boolean;
    hint?: ReactNode;
    descriptionAside?: boolean;
    className?: string;
    children: ReactNode;
};

export function Field(props: Props) {
    const labels = useUiLabels();

    if (!props.label && !props.description && !props.error) {
        return props.children;
    }

    const description = props.description && (
        <p
            className={cn(
                'text-sm text-foreground-muted',
                props.descriptionAside && 'text-right',
            )}
        >
            {props.description}
        </p>
    );

    return (
        <div
            className={cn('grid min-w-0 content-start gap-sm', props.className)}
        >
            {props.label && (
                <div
                    className={cn(
                        'flex items-baseline justify-between gap-md',
                        props.hideLabel &&
                            !props.hint &&
                            !props.descriptionAside &&
                            'sr-only',
                    )}
                >
                    <Label
                        htmlFor={props.id}
                        className={cn('shrink-0', props.hideLabel && 'sr-only')}
                    >
                        {props.label}
                        {props.optional && (
                            <span className="text-foreground-muted">
                                {' '}
                                ({labels.optional})
                            </span>
                        )}
                    </Label>
                    {props.descriptionAside && description}
                    {props.hint && <Hint>{props.hint}</Hint>}
                </div>
            )}
            {props.children}
            {!(props.descriptionAside && props.label) && description}
            <FieldError message={props.error} />
        </div>
    );
}
