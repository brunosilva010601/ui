import { Ellipsis } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from './button';
import { DropdownMenu } from './dropdown-menu';
import { useHold } from './hold';
import { cn } from './lib/utils';
import { useUi } from './provider';

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

const layerClass =
    'absolute inset-0 cursor-pointer focus-visible:-outline-offset-2';

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
    const { link: Link } = useUi();

    if (props.href && props.external) {
        return (
            <a
                data-layer
                href={props.href}
                target="_blank"
                rel="noopener"
                className={layerClass}
            />
        );
    }

    if (props.href) {
        return <Link data-layer href={props.href} className={layerClass} />;
    }

    if (props.onClick) {
        return (
            <button
                type="button"
                data-layer
                onClick={props.onClick}
                className={layerClass}
            />
        );
    }

    return null;
}

type ListItemProps = ItemLayerProps & {
    selected?: boolean;
    active?: boolean;
    menu?: ListItemMenu;
    className?: string;
    children: ReactNode;
};

export function ListItem(props: ListItemProps) {
    const variant = useContext(VariantContext);
    const [open, setOpen] = useState(false);
    const menu = props.menu;
    const hold = useHold((pointer) => {
        if (pointer !== 'mouse' && menu?.onHold) {
            menu.onHold();
        } else {
            setOpen(true);
        }
    });
    const layered = Boolean(props.onClick || props.href);
    const more = menu && (
        <Button
            variant={menu.hover ? 'outline' : 'ghost'}
            size="sm"
            square
            title={menu.label}
            className={
                menu.hover
                    ? 'absolute top-1/2 right-(--row-inset) hidden -translate-y-1/2 [@media(hover:hover)]:group-hover:inline-flex'
                    : 'mr-(--row-inset) hidden shrink-0 [@media(hover:hover)]:inline-flex'
            }
            onClick={() => setOpen(true)}
        >
            <Ellipsis />
        </Button>
    );
    const body = (
        <div
            className={cn(
                'group relative flex items-center transition-colors',
                itemVariants[variant],
                props.selected
                    ? 'bg-primary/20'
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
        <li>
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
    children: ReactNode;
};

export function List(props: ListProps) {
    const variant = props.variant ?? 'divided';

    return (
        <VariantContext value={variant}>
            <ul
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
        </VariantContext>
    );
}
