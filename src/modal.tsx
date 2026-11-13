import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { backdropClass } from './backdrop';
import { buttonClass } from './button';
import { HeadingDescription, HeadingTitle, headingClass } from './heading';
import { cn } from './lib/utils';
import { useDrawerDrag, usePullToClose } from './modal-gestures';
import { focusOpener, keepUnlessOnTop, useCloseOnBack } from './modal-history';
import {
    centered,
    desktopFor,
    desktopLayouts,
    mobileLayouts,
} from './modal-layouts';
import type { ModalDesktop, ModalMobile } from './modal-layouts';
import { useUiLabels } from './provider';

export type { ModalDesktop, ModalMobile };

export const ModalClose = DialogPrimitive.Close;

function isSheet(props: ModalProps): boolean {
    return props.mobile === 'sheet' || props.mobile === 'full';
}

type ModalProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactNode;
    mobile: ModalMobile;
    desktop?: ModalDesktop;
    className?: string;
    bare?: boolean;
    actions?: ReactNode;
    hideClose?: boolean;
    dismissible?: boolean;
    title?: ReactNode;
    description?: ReactNode;
    onClose?: () => void;
    onClosed?: () => void;
    children?: ReactNode;
};

export function Modal(props: ModalProps) {
    const change = (open: boolean) => {
        props.onOpenChange?.(open);

        if (!open) {
            props.onClose?.();
        }
    };

    return (
        <DialogPrimitive.Root open={props.open} onOpenChange={change}>
            {props.trigger && (
                <DialogPrimitive.Trigger asChild>
                    {props.trigger}
                </DialogPrimitive.Trigger>
            )}
            <ModalPanel {...props} />
        </DialogPrimitive.Root>
    );
}

function ModalPanel(props: ModalProps) {
    const mobile = props.mobile in mobileLayouts ? props.mobile : 'dialog';
    const desktop = props.desktop ?? desktopFor[mobile];
    const small = mobileLayouts[mobile];
    const wide = desktopLayouts[desktop];
    const locked = props.dismissible === false;
    const sheet = isSheet(props) && !locked;
    const closeButton = useRef<HTMLButtonElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const [panel, setPanel] = useState<HTMLDivElement | null>(null);
    const panelRef = useCallback((node: HTMLDivElement | null) => {
        content.current = node;
        setPanel(node);
    }, []);
    const close = () => {
        if (!locked) {
            closeButton.current?.click();
        }
    };
    const drag = useDrawerDrag(close);
    const onTop = useCloseOnBack(close, panel !== null && props.open !== false);
    usePullToClose(panel, sheet && props.open !== false, close);

    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                data-veil={
                    mobile === 'left' || mobile === 'right' ? 'side' : ''
                }
                className={cn(
                    'fixed inset-0 z-50 flex',
                    backdropClass,
                    small.overlay,
                    wide.overlay,
                    props.bare && 'backdrop-blur-md lg:p-8',
                )}
            >
                <DialogPrimitive.Content
                    {...(sheet ? drag : {})}
                    ref={panelRef}
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();

                        if (
                            !content.current?.contains(document.activeElement)
                        ) {
                            content.current?.focus({ preventScroll: true });
                        }
                    }}
                    onCloseAutoFocus={(event) => {
                        event.preventDefault();
                        focusOpener(content.current);
                        props.onClosed?.();
                    }}
                    onEscapeKeyDown={(event) =>
                        locked && event.preventDefault()
                    }
                    onInteractOutside={
                        locked
                            ? (event) => event.preventDefault()
                            : keepUnlessOnTop(onTop)
                    }
                    className={cn(
                        'relative flex flex-col outline-none [--modal-padding:var(--gutter)]',
                        props.bare
                            ? 'pointer-events-none! h-full data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in'
                            : [
                                  'overflow-hidden rounded border border-border bg-background shadow-overlay transition-transform duration-200 ease-drawer',
                                  small.panel,
                                  wide.panel,
                                  (centered.includes(desktop) ||
                                      mobile === 'dialog' ||
                                      mobile === 'top') &&
                                      'max-w-lg',
                              ],
                        props.className,
                    )}
                >
                    <DialogPrimitive.Close
                        ref={closeButton}
                        tabIndex={-1}
                        aria-hidden
                        className="hidden"
                    />
                    {props.bare ? (
                        <BareBody {...props} />
                    ) : (
                        <FramedBody {...props} />
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Overlay>
        </DialogPrimitive.Portal>
    );
}

function BareBody(props: ModalProps) {
    const labels = useUiLabels();

    return (
        <>
            <DialogPrimitive.Title className="sr-only">
                {props.title}
            </DialogPrimitive.Title>
            <div className="flex size-full items-center justify-center *:pointer-events-auto">
                {props.children}
            </div>
            {props.dismissible !== false && (
                <DialogPrimitive.Close
                    aria-label={labels.close}
                    className={cn(
                        buttonClass({ variant: 'outline', square: true }),
                        'pointer-events-auto absolute top-0 right-0',
                    )}
                >
                    <X />
                </DialogPrimitive.Close>
            )}
        </>
    );
}

type ModalCloseButtonProps = {
    className?: string;
};

export function ModalCloseButton(props: ModalCloseButtonProps) {
    const labels = useUiLabels();

    return (
        <DialogPrimitive.Close
            aria-label={labels.close}
            className={cn(
                buttonClass({ variant: 'ghost', square: true, bleed: true }),
                props.className,
            )}
        >
            <X />
        </DialogPrimitive.Close>
    );
}

function FramedBody(props: ModalProps) {
    const isDrawer = isSheet(props);
    const [footer, setFooter] = useState<HTMLDivElement | null>(null);
    const close = !props.hideClose && props.dismissible !== false && (
        <ModalCloseButton className={cn(isDrawer && 'max-sm:hidden')} />
    );

    return (
        <>
            {isDrawer && props.dismissible !== false && (
                <div
                    data-drawer-drag
                    data-drawer-handle
                    className="flex shrink-0 cursor-pointer touch-none justify-center py-3 sm:hidden"
                >
                    <span className="h-1.5 w-10 rounded-full bg-border" />
                </div>
            )}
            {props.title && (
                <header
                    data-drawer-drag={isDrawer || undefined}
                    className={cn(
                        headingClass,
                        'shrink-0 px-(--modal-padding) py-3',
                        isDrawer && 'touch-none max-sm:pt-0',
                    )}
                >
                    <div className="flex items-start justify-between gap-3">
                        <HeadingTitle as={DialogPrimitive.Title}>
                            {props.title}
                        </HeadingTitle>
                        <div className="flex h-lh shrink-0 items-center gap-3">
                            {props.actions}
                            {close}
                        </div>
                    </div>
                    {props.description && (
                        <HeadingDescription as={DialogPrimitive.Description}>
                            {props.description}
                        </HeadingDescription>
                    )}
                </header>
            )}
            <div
                data-drawer-body={isDrawer || undefined}
                className={cn(
                    'relative flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain p-(--modal-padding) [&:not(:has(>:not(:empty)))]:hidden',
                    isDrawer && [
                        'pb-[max(var(--modal-padding),var(--spacing-safe-bottom))]',
                        '[&:has(+*:not(:empty))]:pb-(--modal-padding)',
                    ],
                    props.title
                        ? 'border-t border-border'
                        : isDrawer && 'max-sm:pt-2',
                )}
            >
                <FooterSlot.Provider value={footer}>
                    {props.children}
                </FooterSlot.Provider>
                {!props.title && close && (
                    <div className="absolute top-(--modal-padding) right-(--modal-padding) flex">
                        {close}
                    </div>
                )}
            </div>
            <div
                ref={setFooter}
                className={cn(
                    'flex shrink-0 gap-2 border-t border-border px-(--modal-padding) py-3 empty:hidden',
                    isDrawer &&
                        'pb-[max(var(--spacing-3),var(--spacing-safe-bottom))]',
                )}
            />
        </>
    );
}

const FooterSlot = createContext<HTMLDivElement | null>(null);

type ModalFooterProps = {
    aside?: ReactNode;
    children: ReactNode;
};

export function ModalFooter(props: ModalFooterProps) {
    const slot = useContext(FooterSlot);

    if (!slot) {
        return null;
    }

    return createPortal(
        <>
            {props.aside}
            <div className="flex flex-1 justify-end gap-2">
                {props.children}
            </div>
        </>,
        slot,
    );
}

export const ModalTitle = DialogPrimitive.Title;

type Kept<T> = {
    value: T;
    key: number;
    open: boolean;
};

export function useModalValue<T>(value: T | null | undefined | false) {
    const [kept, setKept] = useState<Kept<T> | null>(null);

    if (value && !kept?.open) {
        setKept({ value, key: (kept?.key ?? 0) + 1, open: true });
    } else if (value && value !== kept?.value) {
        setKept({ ...kept, value, open: true, key: kept?.key ?? 0 });
    } else if (!value && kept?.open) {
        setKept({ ...kept, open: false });
    }

    return {
        value: value || kept?.value || null,
        key: kept?.key ?? 0,
        open: Boolean(value),
    };
}

type ModalTextProps = {
    children: ReactNode;
};

export function ModalHiddenDescription(props: ModalTextProps) {
    return (
        <DialogPrimitive.Description className="sr-only">
            {props.children}
        </DialogPrimitive.Description>
    );
}
