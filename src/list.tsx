import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const rowPadding = 'p-md';

const rowClass =
    'flex w-full cursor-pointer items-start gap-md text-left transition-colors';

export const coverRowClass = cn(
    rowClass,
    'hover:bg-surface-hover focus-visible:-outline-offset-2 active:bg-surface-hover',
    rowPadding,
);

export const layerRowClass = cn(
    rowClass,
    'has-[>[data-layer]:active]:bg-surface-hover [@media(hover:hover)]:has-[>[data-layer]:hover]:bg-surface-hover',
    rowPadding,
    'lg:py-sm',
);

export const staticRowClass = cn(
    'flex items-center gap-md',
    rowPadding,
);

type ListProps = {
    bleed?: boolean;
    columns?: boolean;
    horizontal?: boolean;
    children: ReactNode;
};

export function List(props: ListProps) {
    return (
        <ul
            className={cn(
                props.bleed && '-mx-(--row-inset)',
                props.columns &&
                    'grid grid-cols-1 gap-px bg-border lg:grid-cols-2 [&>li]:bg-surface lg:[&>li:last-child:nth-child(odd)]:col-span-2',
                props.horizontal && 'flex divide-x divide-border *:flex-1',
                !props.columns && !props.horizontal && 'divide-y divide-border',
            )}
        >
            {props.children}
        </ul>
    );
}
