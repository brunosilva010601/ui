import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type Props = {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
};

export function Switch(props: Props) {
    return (
        <div className="flex flex-col gap-md">
            <button
                type="button"
                role="switch"
                aria-checked={props.checked}
                onClick={() => props.onChange(!props.checked)}
                className="flex w-full cursor-pointer items-center gap-md text-start"
            >
                <span className="flex min-w-0 flex-1 flex-col gap-2xs">
                    <span className="text-sm font-semibold">{props.label}</span>
                    {props.description && (
                        <span className="text-sm text-foreground-muted">
                            {props.description}
                        </span>
                    )}
                </span>
                <span
                    aria-hidden
                    className={cn(
                        'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
                        props.checked
                            ? 'border-primary bg-primary'
                            : 'border-border bg-control',
                    )}
                >
                    <span
                        className={cn(
                            'absolute start-px top-px size-icon-md rounded-full bg-background shadow-sm transition-transform',
                            props.checked && 'translate-x-5',
                        )}
                    />
                </span>
            </button>
            {props.checked && props.children && (
                <div className="flex flex-col gap-md">{props.children}</div>
            )}
        </div>
    );
}
