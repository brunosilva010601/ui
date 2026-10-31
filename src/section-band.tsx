import { ChevronDown, ChevronRight, Ellipsis } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button, touchClass } from './button';
import { Cover } from './cover';
import { DropdownMenu } from './dropdown-menu';
import { cn } from './lib/utils';
import { SortHandle } from './sortable';

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
    hover: boolean;
};

export function SectionBand(props: Props) {
    const Chevron = props.open ? ChevronDown : ChevronRight;

    return (
        <div className="group/header group/sort relative -mx-(--row-inset) flex items-center gap-8px px-12px py-8px">
            <Cover aria-expanded={props.open} onClick={props.onToggle} />
            {props.sortable && <SortHandle />}
            <Chevron className="pointer-events-none relative size-icon-16px shrink-0 text-foreground-muted" />
            {props.title ? (
                <h2 className="pointer-events-none relative min-w-0 truncate font-semibold">
                    {props.title}
                </h2>
            ) : (
                <p className="ui-note pointer-events-none relative min-w-0 truncate">
                    {props.description}
                </p>
            )}
            {props.note !== undefined && (
                <span className="ui-note pointer-events-none relative shrink-0">
                    {props.note}
                </span>
            )}
            {(props.action || props.menu) && (
                <div
                    className={cn(
                        'relative ml-auto flex shrink-0 items-center gap-4px',
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
                                    className={`p-4px ${touchClass}`}
                                >
                                    <Ellipsis />
                                </Button>
                            }
                        >
                            {props.menu.items}
                        </DropdownMenu>
                    )}
                </div>
            )}
        </div>
    );
}
