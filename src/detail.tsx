import type { ReactNode } from 'react';
import { cn } from './lib/utils';

type Props = {
    label: ReactNode;
    inline?: boolean;
    side?: boolean;
    action?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function Detail(props: Props) {
    if (props.inline) {
        return (
            <div className="contents">
                <dt className="ui-note">{props.label}</dt>
                <dd className="text-14px">{props.children}</dd>
            </div>
        );
    }

    return (
        <div
            className={cn('flex min-w-0 items-center gap-8px', props.className)}
        >
            <div
                className={cn(
                    'flex min-w-0 flex-1',
                    props.side
                        ? 'items-center justify-between gap-12px'
                        : 'flex-col gap-4px',
                )}
            >
                <dt className="ui-note">{props.label}</dt>
                <dd
                    className={cn(
                        'min-w-0 text-14px break-words',
                        props.side && 'text-right',
                    )}
                >
                    {props.children}
                </dd>
            </div>
            {props.action}
        </div>
    );
}
