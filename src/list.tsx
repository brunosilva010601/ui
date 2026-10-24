import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { useUi } from './provider';

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

type ListRowProps = {
    leading?: ReactNode;
    actions?: ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
    children: ReactNode;
};

export function ListRow(props: ListRowProps) {
    const { link: Link } = useUi();
    const clickable = Boolean(props.onClick || props.href);
    const content = (
        <>
            {props.leading && (
                <span className="flex shrink-0 items-center">
                    {props.leading}
                </span>
            )}
            <div className="min-w-0 flex-1">{props.children}</div>
        </>
    );
    const actions = props.actions && (
        <div className="relative flex shrink-0 items-center gap-xs">
            {props.actions}
        </div>
    );

    if (!clickable) {
        return (
            <li className={cn(staticRowClass, props.className)}>
                {content}
                {actions}
            </li>
        );
    }

    if (!actions) {
        return (
            <li>
                {props.href ? (
                    <Link
                        href={props.href}
                        className={cn(coverRowClass, props.className)}
                    >
                        {content}
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={props.onClick}
                        className={cn(coverRowClass, props.className)}
                    >
                        {content}
                    </button>
                )}
            </li>
        );
    }

    const layer = 'absolute inset-0 cursor-pointer focus-visible:-outline-offset-2';

    return (
        <li className={cn(layerRowClass, 'relative items-center', props.className)}>
            {props.href ? (
                <Link href={props.href} data-layer className={layer} />
            ) : (
                <button
                    type="button"
                    data-layer
                    onClick={props.onClick}
                    className={layer}
                />
            )}
            <div className="pointer-events-none relative flex min-w-0 flex-1 items-center gap-md">
                {content}
            </div>
            {actions}
        </li>
    );
}

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
