import { Slot } from '@radix-ui/react-slot';
import { Check, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { Backdrop } from './backdrop';
import { IconBadge } from './icon-badge';
import { useTouch } from './lib/device';
import { cn } from './lib/utils';
import { Modal, ModalClose } from './modal';
import { useCloseOnBack } from './modal-history';
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

export const itemClass =
    "ui-menu-item flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground transition-colors select-none hover:bg-foreground/5 focus-visible:-outline-offset-2 active:bg-foreground/5 data-[state=on]:bg-foreground/5 pointer-coarse:gap-3 pointer-coarse:py-3 pointer-coarse:text-base [&_svg]:shrink-0 [&_svg]:text-foreground-muted [&_svg:not([class*='size-'])]:size-4 pointer-coarse:[&_svg:not([class*='size-'])]:size-5";

export const menuPanelClass =
    'flex flex-col overflow-y-auto border-0 py-2 [&>:not(.ui-menu-item)]:mx-2';

export type MenuPlace = {
    point?: { x: number; y: number };
    veil?: boolean;
};

type DropdownMenuProps = MenuPlace & {
    trigger?: ReactElement;
    anchor?: ReactElement;
    label: string;
    wide?: boolean;
    align?: 'start' | 'center' | 'end';
    choice?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
};

const MenuClose = createContext<typeof PopoverClose>(PopoverClose);

export function DropdownMenu(props: DropdownMenuProps) {
    const touch = useTouch();

    return props.choice && touch ? (
        <ChoiceModal {...props} />
    ) : (
        <PopoverMenu {...props} />
    );
}

function ChoiceModal(props: DropdownMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Slot aria-haspopup="dialog" onClick={() => setOpen(true)}>
                {props.trigger}
            </Slot>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                mobile="dialog"
                title={props.label}
            >
                <MenuClose value={ModalClose}>
                    <div className="flex flex-col gap-1">{props.children}</div>
                </MenuClose>
            </Modal>
        </>
    );
}

function PopoverMenu(props: DropdownMenuProps) {
    const [ownOpen, setOwnOpen] = useBlockingPopover();
    const open = props.open ?? ownOpen;
    const setOpen = props.onOpenChange ?? setOwnOpen;
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const point = props.point;
    const place = useMemo(
        () => ({
            current: point
                ? {
                      getBoundingClientRect: () =>
                          new DOMRect(point.x, point.y),
                  }
                : anchor,
        }),
        [anchor, point],
    );

    useClosesOnLeave(props.open === true, () => setOpen(false));
    useCloseOnBack(() => setOpen(false), props.open === true);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Backdrop
                open={open}
                onClose={() => setOpen(false)}
                veil={props.veil}
                hole={anchor}
            />
            {props.anchor ? (
                <>
                    <Slot ref={setAnchor} data-state={open ? 'open' : 'closed'}>
                        {props.anchor}
                    </Slot>
                    <PopoverAnchor virtualRef={place} />
                </>
            ) : (
                <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
            )}
            <PopoverContent
                align={point ? 'start' : (props.align ?? 'end')}
                onPointerDownOutside={keepOpenOnOutsidePress}
                className={cn(
                    menuPanelClass,
                    'max-h-(--radix-popover-content-available-height)',
                    props.wide
                        ? 'w-(--radix-popover-trigger-width)'
                        : 'w-[208px]',
                    point && 'data-[side=bottom]:mt-1 data-[side=top]:mb-1',
                )}
            >
                {props.children}
            </PopoverContent>
        </Popover>
    );
}

type RowTriggerProps = Omit<ComponentProps<'button'>, 'value'> & {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    set?: boolean;
};

export function RowTrigger(props: RowTriggerProps) {
    const { icon, label, value, set, className, ...rest } = props;

    return (
        <button
            type="button"
            className={cn(
                'flex w-full cursor-pointer items-center gap-3 px-(--row-inset) py-3 text-left text-sm transition-colors hover:bg-surface-hover focus-visible:-outline-offset-2 active:bg-surface-hover data-[state=open]:bg-surface-hover',
                className,
            )}
            {...rest}
        >
            <IconBadge icon={icon} size="sm" />
            <span className="shrink-0 font-semibold">{label}</span>
            <span
                className={cn(
                    'min-w-0 flex-1 truncate text-end',
                    set ? 'text-primary-text' : 'text-foreground-muted',
                )}
            >
                {value}
            </span>
            <ChevronRight className="size-4 shrink-0 text-foreground-muted" />
        </button>
    );
}

type DropdownItemProps = {
    selected?: boolean;
    'data-test'?: string;
    children: ReactNode;
} & (
    | { href: string; onClick?: () => void; onSelect?: never; asChild?: never }
    | { onSelect: () => void; href?: never; asChild?: never }
    | { asChild: true; href?: never; onSelect?: never }
);

export function DropdownItem(props: DropdownItemProps) {
    const Close = useContext(MenuClose);
    const { link: Link } = useUi();
    const state = {
        'data-test': props['data-test'],
        'data-state': props.selected ? 'on' : undefined,
    };

    if (props.href !== undefined) {
        return (
            <Link
                href={props.href}
                onClick={props.onClick}
                aria-current={props.selected ? 'page' : undefined}
                className={itemClass}
                {...state}
            >
                {props.children}
            </Link>
        );
    }

    return (
        <Close asChild>
            {props.asChild ? (
                <Slot className={itemClass} {...state}>
                    {props.children}
                </Slot>
            ) : (
                <button
                    type="button"
                    aria-pressed={props.selected}
                    onClick={props.onSelect}
                    className={itemClass}
                    {...state}
                >
                    {props.children}
                </button>
            )}
        </Close>
    );
}

type DropdownCheckboxItemProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    children: ReactNode;
};

export function DropdownCheckboxItem(props: DropdownCheckboxItemProps) {
    return (
        <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={props.checked}
            data-state={props.checked ? 'on' : undefined}
            onClick={() => props.onCheckedChange(!props.checked)}
            className={itemClass}
        >
            <Check className={cn(!props.checked && 'invisible')} />
            {props.children}
        </button>
    );
}
