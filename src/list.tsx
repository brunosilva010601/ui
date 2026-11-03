import { createContext, useContext, useId } from 'react';
import type { ReactNode } from 'react';
import { Cover } from './cover';
import { DropdownMenu } from './dropdown-menu';
import { useHeldMenu } from './held-menu';
import { cn } from './lib/utils';
import {
    SortHandle,
    SortProvider,
    sortItemClass,
    useSortable,
} from './sortable';
import { Spinner } from './spinner';

const variants = {
    divided: 'divide-y divide-border',
    cards: 'flex flex-col gap-2',
    bare: 'flex flex-col',
};

type ListVariant = keyof typeof variants;

const itemVariants: Record<ListVariant, string> = {
    divided: '',
    cards: 'overflow-clip rounded border border-border',
    bare: '',
};

const VariantContext = createContext<ListVariant>('divided');

export type ListItemMenu = {
    label: string;
    items: ReactNode;
    hover?: boolean;
    onHold?: () => void;
};

type ItemLayerProps = {
    onClick?: () => void;
    href?: string;
    external?: boolean;
};

function ItemLayer(props: ItemLayerProps & { labelledBy: string }) {
    return (
        (props.href || props.onClick) && (
            <Cover
                data-layer
                aria-labelledby={props.labelledBy}
                href={props.href}
                external={props.external}
                onClick={props.onClick}
                className="inset-0 focus-visible:-outline-offset-2"
            />
        )
    );
}

type ListItemProps = ItemLayerProps & {
    sortId?: string;
    selected?: boolean;
    active?: boolean;
    disabled?: boolean;
    busy?: boolean;
    menu?: ListItemMenu;
    align?: 'center' | 'start';
    className?: string;
    children: ReactNode;
};

export function ListItem(props: ListItemProps) {
    const contentId = useId();
    const variant = useContext(VariantContext);
    const blocked = props.disabled || props.busy;
    const menu = blocked ? undefined : props.menu;
    const held = useHeldMenu({
        label: menu?.label ?? '',
        hover: menu?.hover,
        onHold: menu?.onHold,
    });
    const { open, setOpen, hold } = held;
    const layered = !blocked && Boolean(props.onClick || props.href);
    const more = menu && held.more;
    const body = (
        <div
            aria-busy={props.busy || undefined}
            aria-disabled={props.disabled || undefined}
            className={cn(
                'group group/sort relative flex items-center transition-colors',
                itemVariants[variant],
                props.selected
                    ? 'bg-foreground/10'
                    : props.active
                      ? 'bg-surface-hover'
                      : 'bg-[var(--row-surface,var(--color-surface))]',
                (layered || menu) &&
                    'has-[[data-layer]:active]:bg-surface-hover [@media(hover:hover)]:hover:bg-surface-hover',
                blocked && 'opacity-50',
                props.className,
            )}
            {...(menu ? hold : {})}
        >
            {layered && (
                <ItemLayer
                    labelledBy={contentId}
                    onClick={props.onClick}
                    href={props.href}
                    external={props.external}
                />
            )}
            {props.sortId !== undefined && <SortHandle />}
            <div
                id={contentId}
                className={cn(
                    'relative flex min-w-0 flex-1 gap-3',
                    props.align === 'start' ? 'items-start' : 'items-center',
                    variant !== 'bare' && 'px-(--row-inset) py-3 lg:py-2',
                    layered &&
                        'pointer-events-none [&_a,&_button,&_input,&_label,&_select,&_textarea]:pointer-events-auto',
                )}
            >
                {props.children}
                {props.busy && <Spinner />}
            </div>
            {more}
        </div>
    );

    return (
        <li
            data-sort-id={props.sortId}
            className={props.sortId !== undefined ? sortItemClass : undefined}
        >
            {menu ? (
                <DropdownMenu
                    label={menu.label}
                    anchor={body}
                    open={open}
                    onOpenChange={setOpen}
                >
                    {menu.items}
                </DropdownMenu>
            ) : (
                body
            )}
        </li>
    );
}

type ListProps = {
    variant?: ListVariant;
    bleed?: boolean;
    columns?: boolean;
    horizontal?: boolean;
    organizing?: boolean;
    onReorder?: (ids: string[]) => void;
    children: ReactNode;
};

function keepOrder() {}

export function List(props: ListProps) {
    const variant = props.variant ?? 'divided';
    const sortable = useSortable(props.onReorder ?? keepOrder);

    return (
        <VariantContext value={variant}>
            <SortProvider organizing={props.organizing ?? false}>
                <ul
                    ref={props.onReorder ? sortable : undefined}
                    className={cn(
                        props.bleed &&
                            '-mx-(--row-inset) [--row-inset:var(--bleed,var(--spacing-3))]',
                        props.columns
                            ? 'grid grid-cols-1 gap-px bg-border lg:grid-cols-2 lg:[&>li:last-child:nth-child(odd)]:col-span-2'
                            : props.horizontal
                              ? 'flex divide-x divide-border *:flex-1'
                              : variants[variant],
                    )}
                >
                    {props.children}
                </ul>
            </SortProvider>
        </VariantContext>
    );
}
