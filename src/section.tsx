import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useId } from 'react';
import type { ReactNode } from 'react';
import { Cover } from './cover';
import { Heading } from './heading';
import { HeldMenu } from './held-menu';
import { Hint } from './hint';
import { IconBadge } from './icon-badge';
import { cn } from './lib/utils';
import { hoverClass, SectionBand } from './section-band';
import type { SectionMenu } from './section-band';
import { useOpen } from './section-open';
import { sortItemClass } from './sortable';
import { surfaceClass } from './surface';

const variants = {
    flat: 'flex flex-col gap-3 [--row-surface:var(--color-background)]',
    outlined: surfaceClass,
};

const bandClass = 'flex flex-col [--row-surface:var(--color-background)]';

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
    menu?: SectionMenu;
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
    id: string;
    title?: ReactNode;
    note?: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    icon?: LucideIcon;
};

function SectionText(props: SectionTextProps) {
    return (
        <div
            id={props.id}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
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

const chevronClass =
    'pointer-events-none relative size-5 shrink-0 text-foreground-muted';

export function Section(props: SectionProps) {
    const textId = useId();
    const contentId = useId();
    const collapsible = props.collapsible ?? false;
    const [open, setOpen] = useOpen(props);
    const variant = props.variant ?? 'flat';
    const band =
        variant === 'flat' &&
        collapsible &&
        Boolean(props.title || props.description);
    const isOutlined = variant !== 'flat';
    const isClickable = Boolean(props.onClick || props.href);
    const hasText = Boolean(props.title || props.description || props.meta);
    const action =
        props.action ??
        (props.hint && <Hint>{props.hint}</Hint>) ??
        (isClickable && hasText && (
            <ChevronRight className="size-5 text-foreground-muted" />
        ));
    const hasHeader = hasText || Boolean(action);
    const showContent = Boolean(props.children) && (!collapsible || open);
    const headerLink =
        !collapsible && Boolean(props.headerHref || props.onHeaderClick);
    const headerLinkClass = cn(
        'transition-colors hover:bg-surface-hover focus-visible:outline-2 active:bg-surface-hover',
        isOutlined
            ? 'inset-0 rounded-t-[inherit]'
            : '-inset-y-2 max-xl:-inset-x-(--gutter) xl:-inset-x-2',
    );
    const text = (
        <SectionText
            id={textId}
            title={props.title}
            note={props.note}
            description={props.description}
            meta={props.meta}
            icon={props.icon}
        />
    );

    const header = band ? (
        <SectionBand
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
                    'group/header flex items-center gap-3',
                    isOutlined && 'p-3',
                    (headerLink || collapsible) && 'relative',
                )}
            >
                {headerLink && (
                    <Cover
                        aria-labelledby={textId}
                        href={props.headerHref}
                        onClick={props.onHeaderClick}
                        className={headerLinkClass}
                    />
                )}
                {collapsible ? (
                    <>
                        <Cover
                            aria-expanded={open}
                            aria-labelledby={textId}
                            onClick={() => setOpen(!open)}
                            className="inset-0 rounded-t-[inherit]"
                        />
                        <div className="pointer-events-none relative flex min-w-0 flex-1 items-center gap-3 [&_a]:pointer-events-auto">
                            {text}
                        </div>
                    </>
                ) : (
                    <div
                        className={cn(
                            'flex min-w-0 flex-1',
                            headerLink && 'pointer-events-none relative',
                        )}
                    >
                        {text}
                    </div>
                )}
                {action && (!collapsible || open) && (
                    <div
                        className={cn(
                            'shrink-0',
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
                        <ChevronUp className={chevronClass} />
                    ) : (
                        <ChevronDown className={chevronClass} />
                    ))}
                {headerLink && <ChevronRight className={chevronClass} />}
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
                    'data-[dragging]:-mx-[var(--bleed,var(--spacing-3))] data-[dragging]:bg-background data-[dragging]:px-[var(--bleed,var(--spacing-3))]',
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
                    id={contentId}
                    className={cn(
                        'flex flex-1 flex-col gap-3',
                        isOutlined &&
                            !props.flush &&
                            'p-3 [--bleed:var(--spacing-3)]',
                        isOutlined && hasHeader && 'border-t border-border',
                    )}
                >
                    {props.children}
                </div>
            )}

            {isClickable && (
                <Cover
                    aria-labelledby={hasText ? textId : contentId}
                    onClick={props.onClick}
                    href={props.href}
                    className="inset-0 rounded-[inherit] focus-visible:outline-2"
                />
            )}
        </section>
    );
}
