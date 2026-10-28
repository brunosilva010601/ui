import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from './button';
import { DropdownMenu } from './dropdown-menu';
import { useHold } from './hold';
import { cn } from './lib/utils';

const besideClass = cn(
    'grid grid-cols-[minmax(0,1fr)_auto] items-center bg-[var(--row-surface,var(--color-surface))] transition-colors',
    '[@media(hover:hover)]:has-[>:last-child:hover]:bg-surface-hover',
    '[@media(hover:hover)]:has-[[data-layer]:hover]:bg-surface-hover',
    '[@media(hover:hover)]:not-has-[[data-layer]]:has-[>:first-child:hover]:bg-surface-hover',
);

type Props = {
    label: string;
    row: ReactElement;
    onHold?: () => void;
    bare?: boolean;
    hover?: boolean;
    children: ReactNode;
};

type HeldMenuOptions = {
    label: string;
    hover?: boolean;
    onHold?: () => void;
};

export function useHeldMenu(options: HeldMenuOptions) {
    const [open, setOpen] = useState(false);
    const hold = useHold((pointer) => {
        if (pointer !== 'mouse' && options.onHold) {
            options.onHold();
        } else {
            setOpen(true);
        }
    });
    const more = (
        <Button
            variant={options.hover ? 'outline' : 'ghost'}
            size="sm"
            square
            title={options.label}
            className={
                options.hover
                    ? 'absolute top-1/2 right-(--row-inset) hidden -translate-y-1/2 [@media(hover:hover)]:group-hover:inline-flex'
                    : 'mr-(--row-inset) hidden shrink-0 [@media(hover:hover)]:inline-flex'
            }
            onClick={() => setOpen(true)}
        >
            <Ellipsis />
        </Button>
    );

    return { open, setOpen, hold, more };
}

export function HeldMenu(props: Props) {
    const { open, setOpen, hold, more: button } = useHeldMenu(props);
    const beside = !props.hover && !props.bare;
    const more = !props.bare && button;

    return (
        <div className="group relative" {...hold}>
            <DropdownMenu
                label={props.label}
                anchor={
                    beside ? (
                        <div className={besideClass}>
                            {props.row}
                            {more}
                        </div>
                    ) : (
                        props.row
                    )
                }
                open={open}
                onOpenChange={setOpen}
            >
                {props.children}
            </DropdownMenu>
            {!beside && more}
        </div>
    );
}
