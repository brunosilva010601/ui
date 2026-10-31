import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

type Props = {
    label: string;
    description?: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
};

export function Switch(props: Props) {
    return (
        <div className="flex flex-col gap-12px">
            <button
                type="button"
                role="switch"
                aria-checked={props.checked}
                disabled={props.disabled}
                onClick={() => props.onChange(!props.checked)}
                className="flex w-full cursor-pointer items-center gap-12px text-start disabled:pointer-events-none disabled:opacity-50"
            >
                <span className="flex min-w-0 flex-1 flex-col gap-2px">
                    <span className="text-14px font-semibold">
                        {props.label}
                    </span>
                    {props.description && (
                        <span className="ui-note">{props.description}</span>
                    )}
                </span>
                <span
                    aria-hidden
                    className={cn(
                        'relative h-24px w-[44px] shrink-0 rounded-full border transition-colors',
                        props.checked
                            ? 'border-primary bg-primary'
                            : 'border-border bg-control',
                    )}
                >
                    <span
                        className={cn(
                            'absolute start-px top-px size-icon-20px rounded-full bg-background shadow-control transition-transform',
                            props.checked && 'translate-x-20px',
                        )}
                    />
                </span>
            </button>
            {props.checked && props.children && (
                <div className="flex flex-col gap-12px">{props.children}</div>
            )}
        </div>
    );
}
