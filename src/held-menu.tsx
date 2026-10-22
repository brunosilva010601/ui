import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from './button';
import { DropdownMenu } from './dropdown-menu';
import { useHold } from './hold';
import { cn } from './lib/utils';

type Props = {
    label: string;
    row: ReactElement;
    onHold?: () => void;
    bare?: boolean;
    hover?: boolean;
    children: ReactNode;
};

export function HeldMenu(props: Props) {
    const [open, setOpen] = useState(false);
    const hold = useHold((pointer) => {
        if (pointer !== 'mouse' && props.onHold) {
            props.onHold();
        } else {
            setOpen(true);
        }
    });

    return (
        <div
            className={cn(
                'group relative',
                !props.hover &&
                    !props.bare &&
                    'grid grid-cols-[minmax(0,1fr)_auto] items-center',
            )}
            {...hold}
        >
            <DropdownMenu
                label={props.label}
                anchor={props.row}
                open={open}
                onOpenChange={setOpen}
            >
                {props.children}
            </DropdownMenu>
            {!props.bare && (
                <Button
                    variant={props.hover ? 'outline' : 'ghost'}
                    size="sm"
                    square
                    aria-label={props.label}
                    className={
                        props.hover
                            ? 'absolute top-1/2 right-3 hidden -translate-y-1/2 [@media(hover:hover)]:group-hover:inline-flex'
                            : 'mr-(--row-inset) hidden [@media(hover:hover)]:inline-flex'
                    }
                    onClick={() => setOpen(true)}
                >
                    <Ellipsis />
                </Button>
            )}
        </div>
    );
}
