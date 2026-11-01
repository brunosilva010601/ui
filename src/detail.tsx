import type { ReactNode } from 'react';
import { IconGroup } from './icon-group';
import { cn } from './lib/utils';

type Props = {
    label: ReactNode;
    children: ReactNode;
} & (
    | {
          inline: true;
          side?: never;
          action?: never;
          className?: never;
      }
    | {
          inline?: false;
          side?: boolean;
          action?: ReactNode;
          className?: string;
      }
);

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
            className={cn(
                'grid min-w-0 items-center gap-x-8px',
                props.side
                    ? 'grid-cols-[auto_minmax(0,1fr)_auto]'
                    : 'grid-cols-[minmax(0,1fr)_auto] gap-y-4px',
                props.className,
            )}
        >
            <dt className="ui-note">{props.label}</dt>
            <dd className="contents">
                <div
                    className={cn(
                        'min-w-0 text-14px break-words',
                        props.side ? 'text-right' : 'col-start-1',
                    )}
                >
                    {props.children}
                </div>
                {props.action && (
                    <IconGroup
                        className={cn(
                            !props.side && 'col-start-2 row-span-2 row-start-1',
                        )}
                    >
                        {props.action}
                    </IconGroup>
                )}
            </dd>
        </div>
    );
}
