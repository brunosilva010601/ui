import { Slot } from '@radix-ui/react-slot';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createContext, useContext, useLayoutEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Backdrop } from './backdrop';
import { buttonClass, touchClass } from './button';
import { fieldClass } from './form/field';
import { IconBadge } from './icon-badge';
import { touch } from './lib/device';
import { cn } from './lib/utils';
import { Modal, ModalClose, useCloseOnBack } from './modal';
import {
    keepOpenOnOutsidePress,
    Popover,
    PopoverAnchor,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
    useBlockingPopover,
    useClosesOnLeave,
} from './popover';
import { useUi } from './provider';

const itemClass = buttonClass({ variant: 'ghost', block: true });

const triggers = {
    icon: buttonClass({
        variant: 'ghost',
        square: true,
        className: `p-xs ${touchClass}`,
    }),
    tool: buttonClass({ variant: 'ghost', square: true }),
    toolBleed: buttonClass({ variant: 'ghost', square: true, bleed: true }),
    chip: buttonClass({
        variant: 'ghost',
        className: 'min-w-0 shrink px-md text-primary-text [&_span]:truncate',
    }),
    button: buttonClass({ variant: 'outline' }),
    row: itemClass,
    listRow:
        'flex w-full cursor-pointer items-center gap-md p-md text-left text-sm transition-colors hover:bg-surface-hover focus-visible:-outline-offset-2 active:bg-surface-hover',
    field: `${fieldClass} flex cursor-pointer items-center gap-sm text-left`,
    bar: 'flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-xs px-xs py-sm text-xs font-semibold whitespace-nowrap text-foreground-muted transition-colors hover:text-foreground active:text-foreground',
};

const triggerWide: Partial<Record<keyof typeof triggers, boolean>> = {
    row: true,
    listRow: true,
    field: true,
};

const iconOnly: Partial<Record<keyof typeof triggers, boolean>> = {
    icon: true,
    tool: true,
    toolBleed: true,
    chip: true,
};

type LiftedProps = {
    target: HTMLElement | null;
    open: boolean;
};

function Lifted(props: LiftedProps) {
    useLayoutEffect(() => {
        const target = props.target;

        if (!props.open || !target) {
            return;
        }

        const holder = document.createElement('div');
        const opacity = target.style.opacity;
        const copy = () => {
            const clone = target.cloneNode(true) as HTMLElement;
            clone.removeAttribute('id');
            clone.style.opacity = opacity;
            holder.replaceChildren(clone);
        };
        holder.setAttribute('aria-hidden', 'true');
        Object.assign(holder.style, {
            position: 'fixed',
            zIndex: '50',
            pointerEvents: 'none',
        });
        copy();
        document.body.appendChild(holder);
        target.style.opacity = '0';
        const changes = new MutationObserver(copy);
        changes.observe(target, {
            childList: true,
            characterData: true,
            subtree: true,
        });

        let frame = 0;
        const follow = () => {
            const box = target.getBoundingClientRect();
            Object.assign(holder.style, {
                left: `${box.left}px`,
                top: `${box.top}px`,
                width: `${box.width}px`,
                height: `${box.height}px`,
            });
            frame = window.requestAnimationFrame(follow);
        };
        follow();

        return () => {
            changes.disconnect();
            window.cancelAnimationFrame(frame);
            holder.remove();
            target.style.opacity = opacity;
        };
    }, [props.open, props.target]);

    return null;
}

type DropdownMenuProps = {
    trigger?: ReactNode;
    anchor?: ReactElement;
    label: string;
    variant?: keyof typeof triggers;
    align?: 'start' | 'center' | 'end';
    choice?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
};

const MenuClose = createContext<typeof PopoverClose>(PopoverClose);

export function DropdownMenu(props: DropdownMenuProps) {
    return props.choice && touch ? (
        <ChoiceModal {...props} />
    ) : (
        <PopoverMenu {...props} />
    );
}

function ChoiceModal(props: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const variant = props.variant ?? 'icon';

    return (
        <>
            <button
                type="button"
                aria-haspopup="dialog"
                title={iconOnly[variant] ? props.label : undefined}
                className={triggers[variant]}
                onClick={() => setOpen(true)}
            >
                {props.trigger}
            </button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={props.label}
            >
                <MenuClose value={ModalClose}>
                    <div className="flex flex-col gap-xs">{props.children}</div>
                </MenuClose>
            </Modal>
        </>
    );
}

function PopoverMenu(props: DropdownMenuProps) {
    const [ownOpen, setOwnOpen] = useBlockingPopover();
    const open = props.open ?? ownOpen;
    const setOpen = props.onOpenChange ?? setOwnOpen;
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const variant = props.variant ?? 'icon';

    useClosesOnLeave(props.open === true, () => setOpen(false));
    useCloseOnBack(() => setOpen(false), props.open === true);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Backdrop open={open} onClose={() => setOpen(false)} />
            {props.anchor ? (
                <PopoverAnchor asChild ref={setTarget}>
                    {props.anchor}
                </PopoverAnchor>
            ) : (
                <PopoverTrigger
                    ref={setTarget}
                    title={iconOnly[variant] ? props.label : undefined}
                    className={triggers[variant]}
                >
                    {props.trigger}
                </PopoverTrigger>
            )}
            <Lifted target={target} open={open} />
            <PopoverContent
                align={props.align ?? 'end'}
                onPointerDownOutside={keepOpenOnOutsidePress}
                className={cn(
                    'flex max-h-(--radix-popover-content-available-height) flex-col gap-xs overflow-y-auto p-xs',
                    triggerWide[variant]
                        ? 'w-(--radix-popover-trigger-width)'
                        : 'w-52',
                )}
            >
                {props.children}
            </PopoverContent>
        </Popover>
    );
}

type RowTriggerProps = {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    set?: boolean;
};

export function RowTrigger(props: RowTriggerProps) {
    return (
        <>
            <IconBadge icon={props.icon} size="sm" />
            <span className="shrink-0 font-semibold">{props.label}</span>
            <span
                className={cn(
                    'min-w-0 flex-1 truncate text-end',
                    props.set ? 'text-primary-text' : 'text-foreground-muted',
                )}
            >
                {props.value}
            </span>
            <ChevronRight className="size-icon-sm shrink-0 text-foreground-muted" />
        </>
    );
}

type DropdownItemProps = { selected?: boolean } & (
    | {
          asChild?: false;
          href: string;
          onClick?: () => void;
          'data-test'?: string;
          children: ReactNode;
      }
    | {
          asChild: true;
          children: ReactNode;
      }
);

export function DropdownItem(props: DropdownItemProps) {
    const Close = useContext(MenuClose);
    const { link: Link } = useUi();
    const state = {
        'aria-current': props.selected || undefined,
        'data-state': props.selected ? 'on' : undefined,
    };

    if (props.asChild) {
        return (
            <Close asChild>
                <Slot className={itemClass} {...state}>
                    {props.children}
                </Slot>
            </Close>
        );
    }

    return (
        <Link
            href={props.href}
            onClick={props.onClick}
            data-test={props['data-test']}
            className={itemClass}
            {...state}
        >
            {props.children}
        </Link>
    );
}
