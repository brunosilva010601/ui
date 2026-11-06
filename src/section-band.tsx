import { ChevronDown, ChevronRight, Ellipsis } from 'lucide-react';
import { useId } from 'react';
import type { ReactNode } from 'react';
import { Button } from './button';
import { Cover } from './cover';
import { DropdownMenu } from './dropdown-menu';
import { IconGroup } from './icon-group';
import { cn } from './lib/utils';
import { bandDropClass, SortHandle } from './sortable';

export const hoverClass =
    'focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/header:opacity-100';

export type SectionMenu = {
    label: string;
    items: ReactNode;
};

type Props = {
    title?: ReactNode;
    description?: ReactNode;
    note?: ReactNode;
    open: boolean;
    onToggle: () => void;
    action?: ReactNode;
    menu?: SectionMenu;
    sortable: boolean;
    droppable: boolean;
    hover: boolean;
};

export function SectionBand(props: Props) {
    const Chevron = props.open ? ChevronDown : ChevronRight;
    const textId = useId();

    return (
        <div
            className={cn(
                'group/header group/sort relative -mx-(--row-inset) flex items-center gap-2 px-3 py-2',
                props.droppable && bandDropClass,
            )}
        >
            <Cover
                aria-expanded={props.open}
                aria-labelledby={textId}
                onClick={props.onToggle}
            />
            {props.sortable && <SortHandle />}
            <Chevron className="pointer-events-none relative size-4 shrink-0 text-foreground-muted" />
            {props.title ? (
                <h2
                    id={textId}
                    className="pointer-events-none relative min-w-0 truncate font-semibold"
                >
                    {props.title}
                </h2>
            ) : (
                <p
                    id={textId}
                    className="ui-note pointer-events-none relative min-w-0 truncate"
                >
                    {props.description}
                </p>
            )}
            {props.note !== undefined && (
                <span className="ui-note pointer-events-none relative shrink-0">
                    {props.note}
                </span>
            )}
            {(props.action || props.menu) && (
                <IconGroup
                    className={cn(
                        'relative ml-auto -my-[calc(var(--spacing-2_5)_+_1px)]',
                        props.hover && hoverClass,
                    )}
                >
                    {props.action}
                    {props.menu && (
                        <DropdownMenu
                            label={props.menu.label}
                            trigger={
                                <Button
                                    variant="ghost"
                                    square
                                    title={props.menu.label}
                                >
                                    <Ellipsis />
                                </Button>
                            }
                        >
                            {props.menu.items}
                        </DropdownMenu>
                    )}
                </IconGroup>
            )}
        </div>
    );
}
