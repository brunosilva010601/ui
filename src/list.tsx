import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { Cover } from './cover';
import { DropdownMenu } from './dropdown-menu';
import { useHeldMenu } from './held-menu';
import { cn } from './lib/utils';
import { SortHandle, SortProvider, sortItemClass, useSortable } from './sortable';

const variants = {
    divided: 'divide-y divide-border',
    cards: 'flex flex-col gap-sm',
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

function ItemLayer(props: ItemLayerProps) {
    return (
        (props.href || props.onClick) && (
            <Cover
                data-layer
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
    menu?: ListItemMenu;
    className?: string;
    children: ReactNode;
};

export function ListItem(props: ListItemProps) {
    const variant = useContext(VariantContext);
    const menu = props.menu;
    const held = useHeldMenu({
        label: menu?.label ?? '',
        hover: menu?.hover,
        onHold: menu?.onHold,
    });
    const { open, setOpen, hold } = held;
    const layered = Boolean(props.onClick || props.href);
    const more = menu && held.more;
    const body = (
        <div
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
                props.className,
            )}
            {...(menu ? hold : {})}
        >
            <ItemLayer
                onClick={props.onClick}
                href={props.href}
                external={props.external}
            />
            {props.sortId !== undefined && <SortHandle />}
            <div
                className={cn(
                    'relative flex min-w-0 flex-1 items-center gap-md',
                    variant !== 'bare' && 'px-(--row-inset) py-md lg:py-sm',
                    layered &&
                        'pointer-events-none [&_a,&_button,&_input,&_label,&_select,&_textarea]:pointer-events-auto',
                )}
            >
                {props.children}
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
                        '-mx-(--row-inset) [--row-inset:var(--bleed,var(--padding-md))]',
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
