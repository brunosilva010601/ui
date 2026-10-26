import { ChevronDown, ChevronRight, ChevronUp, Ellipsis } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { DropdownMenu } from './dropdown-menu';
import { Heading } from './heading';
import { HeldMenu } from './held-menu';
import { Hint } from './hint';
import { IconBadge } from './icon-badge';
import { cn } from './lib/utils';
import { useUi } from './provider';
import { SortHandle, sortItemClass } from './sortable';

const variants = {
    flat: 'flex flex-col gap-md [--row-surface:var(--color-background)]',
    outlined: 'border border-border rounded bg-surface',
};

const hoverClass =
    'focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/header:opacity-100';

const bandClass = 'flex flex-col [--row-surface:var(--color-background)]';

export const sectionPadding = { all: 'p-md', x: 'px-md' };

type SectionProps = {
    title?: ReactNode;
    note?: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    hint?: ReactNode;
    icon?: LucideIcon;
    action?: ReactNode;
    variant?: keyof typeof variants;
    collapsible?: boolean;
    collapsed?: boolean;
    remember?: string;
    menu?: { label: string; items: ReactNode };
    sortId?: string;
    flush?: boolean;
    hover?: boolean;
    onClick?: () => void;
    href?: string;
    headerHref?: string;
    onHeaderClick?: () => void;
    children?: ReactNode;
};

type SectionTextProps = {
    title?: ReactNode;
    note?: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    icon?: LucideIcon;
};

function SectionText(props: SectionTextProps) {
    return (
        <div className="flex min-w-0 flex-1 items-center gap-md text-left">
            {props.icon && <IconBadge icon={props.icon} size="sm" />}
            <Heading
                title={
                    props.title && (
                        <>
                            {props.title}
                            {props.note !== undefined && (
                                <>
                                    {' '}
                                    <span className="font-normal text-foreground-muted">
                                        ({props.note})
                                    </span>
                                </>
                            )}
                        </>
                    )
                }
                description={props.description}
                meta={props.meta}
            />
        </div>
    );
}

type CoverProps = {
    onClick?: () => void;
    href?: string;
};

function Cover(props: CoverProps) {
    const { link: Link } = useUi();
    const className =
        'rounded-[inherit] absolute inset-0 cursor-pointer focus-visible:outline-2';

    return props.href ? (
        <Link href={props.href} className={className} />
    ) : (
        <button type="button" onClick={props.onClick} className={className} />
    );
}

function storedOpen(key: string | undefined, fallback: boolean): boolean {
    try {
        const stored = key && window.localStorage.getItem(`section:${key}`);

        return stored ? stored === 'open' : fallback;
    } catch {
        return fallback;
    }
}

function storeOpen(key: string | undefined, open: boolean): void {
    try {
        if (key) {
            window.localStorage.setItem(
                `section:${key}`,
                open ? 'open' : 'closed',
            );
        }
    } catch {
        return;
    }
}

function useOpen(props: SectionProps): [boolean, (next: boolean) => void] {
    const [open, setOpenState] = useState(() =>
        storedOpen(props.remember, !props.collapsed),
    );

    return [
        open,
        (next) => {
            setOpenState(next);
            storeOpen(props.remember, next);
        },
    ];
}

type BandHeaderProps = {
    title?: ReactNode;
    description?: ReactNode;
    note?: ReactNode;
    open: boolean;
    onToggle: () => void;
    action?: ReactNode;
    menu?: SectionProps['menu'];
    sortable: boolean;
    hover: boolean;
};

function BandHeader(props: BandHeaderProps) {
    const Chevron = props.open ? ChevronDown : ChevronRight;

    return (
        <div
            className={cn(
                'group/header group/sort relative -mx-(--row-inset) flex items-center gap-sm py-sm',
                sectionPadding.x,
            )}
        >
            <button
                type="button"
                aria-expanded={props.open}
                onClick={props.onToggle}
                className="absolute inset-0 cursor-pointer"
            />
            {props.sortable && <SortHandle />}
            <Chevron className="pointer-events-none relative size-icon-sm shrink-0 text-foreground-muted" />
            {props.title ? (
                <h2 className="pointer-events-none relative min-w-0 truncate font-semibold">
                    {props.title}
                </h2>
            ) : (
                <p className="pointer-events-none relative min-w-0 truncate text-sm text-foreground-muted">
                    {props.description}
                </p>
            )}
            {props.note !== undefined && (
                <span className="pointer-events-none relative shrink-0 text-sm text-foreground-muted">
                    {props.note}
                </span>
            )}
            {(props.action || props.menu) && (
                <div
                    className={cn(
                        'relative ml-auto flex shrink-0 items-center gap-xs',
                        props.hover && hoverClass,
                    )}
                >
                    {props.action}
                    {props.menu && (
                        <DropdownMenu
                            label={props.menu.label}
                            trigger={<Ellipsis className="size-icon-md" />}
                        >
                            {props.menu.items}
                        </DropdownMenu>
                    )}
                </div>
            )}
        </div>
    );
}

export function Section(props: SectionProps) {
    const { link: Link } = useUi();
    const collapsible = props.collapsible ?? false;
    const [open, setOpen] = useOpen(props);
    const variant = props.variant ?? 'flat';
    const band =
        variant === 'flat' &&
        collapsible &&
        Boolean(props.title || props.description);
    const isOutlined = variant !== 'flat';
    const headerPadding = isOutlined && sectionPadding.all;
    const isClickable = Boolean(props.onClick || props.href);
    const hasText = Boolean(props.title || props.description || props.meta);
    const action =
        props.action ??
        (props.hint && <Hint>{props.hint}</Hint>) ??
        (isClickable && hasText && (
            <ChevronRight className="size-icon-md text-foreground-muted" />
        ));
    const hasHeader = hasText || Boolean(action);
    const showContent = Boolean(props.children) && (!collapsible || open);
    const headerLink =
        !collapsible && Boolean(props.headerHref || props.onHeaderClick);
    const headerLinkClass = cn(
        'absolute cursor-pointer transition-colors hover:bg-surface-hover focus-visible:outline-2 active:bg-surface-hover',
        isOutlined
            ? 'inset-0 rounded-t-[inherit]'
            : '-inset-y-(--gap-sm) max-xl:-inset-x-(--gutter) xl:-inset-x-(--gap-sm)',
    );

    const header = band ? (
        <BandHeader
            title={props.title}
            description={props.description}
            note={props.note}
            open={open}
            onToggle={() => setOpen(!open)}
            action={props.action}
            menu={props.menu}
            sortable={props.sortId !== undefined}
            hover={props.hover ?? false}
        />
    ) : (
        hasHeader && (
            <div
                className={cn(
                    'group/header flex items-center gap-md',
                    headerPadding,
                    (headerLink || collapsible) && 'relative',
                )}
            >
                {headerLink &&
                    (props.headerHref ? (
                        <Link
                            href={props.headerHref}
                            className={headerLinkClass}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={props.onHeaderClick}
                            className={headerLinkClass}
                        />
                    ))}
                {collapsible ? (
                    <>
                        <button
                            type="button"
                            aria-expanded={open}
                            onClick={() => setOpen(!open)}
                            className="absolute inset-0 cursor-pointer rounded-t-[inherit]"
                        />
                        <div className="pointer-events-none relative flex min-w-0 flex-1 items-center gap-md [&_a]:pointer-events-auto">
                            <SectionText
                                title={props.title}
                                note={props.note}
                                description={props.description}
                                meta={props.meta}
                                icon={props.icon}
                            />
                        </div>
                    </>
                ) : (
                    <div
                        className={cn(
                            'flex min-w-0 flex-1',
                            headerLink && 'pointer-events-none relative',
                        )}
                    >
                        <SectionText
                            title={props.title}
                            note={props.note}
                            description={props.description}
                            meta={props.meta}
                            icon={props.icon}
                        />
                    </div>
                )}
                {action && (!collapsible || open) && (
                    <div
                        className={cn(
                            'shrink-0 [&_svg]:size-icon-md!',
                            props.hover && hoverClass,
                            (headerLink || collapsible) && 'relative',
                            !props.action && props.hint && 'self-start',
                        )}
                    >
                        {action}
                    </div>
                )}
                {collapsible &&
                    (open ? (
                        <ChevronUp className="pointer-events-none relative size-icon-md shrink-0 text-foreground-muted" />
                    ) : (
                        <ChevronDown className="pointer-events-none relative size-icon-md shrink-0 text-foreground-muted" />
                    ))}
                {headerLink && (
                    <ChevronRight className="pointer-events-none relative size-icon-md shrink-0 text-foreground-muted" />
                )}
            </div>
        )
    );

    return (
        <section
            data-sort-id={props.sortId}
            className={cn(
                band ? bandClass : variants[variant],
                props.sortId !== undefined && [
                    sortItemClass,
                    'data-[dragging]:-mx-[var(--bleed,var(--padding-md))] data-[dragging]:bg-background data-[dragging]:px-[var(--bleed,var(--padding-md))]',
                ],
                isOutlined && props.flush && 'overflow-clip',
                isClickable &&
                    'relative transition-colors hover:bg-surface-hover active:bg-surface-hover',
            )}
        >
            {header && props.menu ? (
                <HeldMenu label={props.menu.label} row={header} bare={band}>
                    {props.menu.items}
                </HeldMenu>
            ) : (
                header
            )}

            {showContent && (
                <div
                    className={cn(
                        'flex flex-1 flex-col gap-md',
                        isOutlined &&
                            !props.flush && [
                                sectionPadding.all,
                                '[--bleed:var(--padding-md)]',
                            ],
                        isOutlined && hasHeader && 'border-t border-border',
                    )}
                >
                    {props.children}
                </div>
            )}

            {isClickable && (
                <Cover onClick={props.onClick} href={props.href} />
            )}
        </section>
    );
}
