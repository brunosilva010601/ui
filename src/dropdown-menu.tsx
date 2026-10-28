import { Slot } from '@radix-ui/react-slot';
import { Check, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { Backdrop } from './backdrop';
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

const itemClass =
    "flex w-full cursor-pointer items-center gap-sm rounded border border-transparent px-(--row-inset) py-2.5 text-left text-sm text-foreground transition-colors select-none hover:bg-foreground/5 active:bg-foreground/5 data-[state=on]:bg-foreground/5 [&_svg]:shrink-0 [&_svg]:text-foreground-muted [&_svg:not([class*='size-'])]:size-icon-sm";

type DropdownMenuProps = {
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
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    useClosesOnLeave(props.open === true, () => setOpen(false));
    useCloseOnBack(() => setOpen(false), props.open === true);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Backdrop
                open={open}
                onClose={() => setOpen(false)}
                veil={Boolean(props.anchor)}
                hole={anchor}
            />
            {props.anchor ? (
                <PopoverAnchor asChild ref={setAnchor}>
                    {props.anchor}
                </PopoverAnchor>
            ) : (
                <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
            )}
            <PopoverContent
                align={props.align ?? 'end'}
                onPointerDownOutside={keepOpenOnOutsidePress}
                className={cn(
                    'flex max-h-(--radix-popover-content-available-height) flex-col gap-xs overflow-y-auto p-xs',
                    props.wide ? 'w-(--radix-popover-trigger-width)' : 'w-52',
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
                'flex w-full cursor-pointer items-center gap-md px-(--row-inset) py-md text-left text-sm transition-colors hover:bg-surface-hover focus-visible:-outline-offset-2 active:bg-surface-hover data-[state=open]:bg-surface-hover',
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
            <ChevronRight className="size-icon-sm shrink-0 text-foreground-muted" />
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
