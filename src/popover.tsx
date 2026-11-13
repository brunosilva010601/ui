import * as PopoverPrimitive from '@radix-ui/react-popover';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { useCloseOnBack } from './modal-history';
import { useUi } from './provider';

export const Popover = PopoverPrimitive.Root;

export function useClosesOnLeave(open: boolean, close: () => void): void {
    const { onLeave } = useUi();
    const latest = useRef(close);

    useEffect(() => {
        latest.current = close;
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        const leave = () => latest.current();
        const stop = onLeave(leave);
        window.addEventListener('scroll', leave, { passive: true });

        return () => {
            stop();
            window.removeEventListener('scroll', leave);
        };
    }, [open, onLeave]);
}

export function useBlockingPopover(): [boolean, (open: boolean) => void] {
    const [open, setOpen] = useState(false);

    useClosesOnLeave(open, () => setOpen(false));
    useCloseOnBack(() => setOpen(false), open);

    return [open, setOpen];
}

export function keepOpenOnOutsidePress(event: Event) {
    event.preventDefault();
}

export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverClose = PopoverPrimitive.Close;

export const floatingClass =
    'border border-border rounded bg-surface text-foreground shadow-overlay data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in z-50 outline-none';

type Props = {
    align?: 'start' | 'center' | 'end';
    className?: string;
    onPointerDownOutside?: (event: Event) => void;
    children: ReactNode;
};

const EDGE_GAP = 12;

export function PopoverContent(props: Props) {
    const { className, align = 'center', ...rest } = props;

    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                collisionPadding={EDGE_GAP}
                className={cn(
                    floatingClass,
                    'origin-(--radix-popover-content-transform-origin) data-[side=bottom]:mt-2 data-[side=left]:me-2 data-[side=right]:ms-2 data-[side=top]:mb-2',
                    className,
                )}
                {...rest}
            />
        </PopoverPrimitive.Portal>
    );
}
