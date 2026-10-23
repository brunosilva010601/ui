import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import type { PointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { backdropClass } from './backdrop';
import { buttonClass } from './button';
import { HeadingDescription, HeadingTitle, headingClass } from './heading';
import { cn } from './lib/utils';

export const ModalClose = DialogPrimitive.Close;

const CLOSE_DISTANCE = 0.25;

const CLOSE_VELOCITY = 0.5;

const TAP_DISTANCE = 6;
const FOCUS_HISTORY = 10;

const FOCUSABLE = 'button, a, input, textarea, select, [tabindex]';

const openModals: (() => void)[] = [];

const recentFocus: Element[] = [];

function rememberFocus(event: Event) {
    const element =
        event.target instanceof Element
            ? event.target.closest(FOCUSABLE)
            : null;

    if (!element) {
        return;
    }

    const index = recentFocus.indexOf(element);

    if (index >= 0) {
        recentFocus.splice(index, 1);
    }

    recentFocus.push(element);

    if (recentFocus.length > FOCUS_HISTORY) {
        recentFocus.shift();
    }
}

function focusOpener(content: Element | null) {
    const opener = recentFocus.findLast(
        (element) => element.isConnected && !content?.contains(element),
    );

    if (opener instanceof HTMLElement) {
        opener.focus({ preventScroll: true });
    }
}

const backHistory: {
    depth: number;
    skipNext: boolean;
    url: string;
    latest: unknown;
} = { depth: 0, skipNext: false, url: '', latest: null };

function closeOnBack(event: PopStateEvent) {
    if (backHistory.skipNext) {
        backHistory.skipNext = false;
        event.stopImmediatePropagation();
        window.history.replaceState(backHistory.latest, '');

        return;
    }

    if (!backHistory.depth || !openModals.length) {
        return;
    }

    event.stopImmediatePropagation();
    backHistory.depth--;
    const top = openModals[openModals.length - 1];
    top();
    window.setTimeout(() => {
        if (openModals.includes(top)) {
            window.history.pushState(window.history.state, '');
            backHistory.depth++;
        }
    });
}

export function visitReplacesModalEntry(visit: {
    url: string;
    method: string;
}): boolean {
    if (!backHistory.depth) {
        return false;
    }

    if (visit.method.toLowerCase() !== 'get') {
        return true;
    }

    if (visit.url !== backHistory.url) {
        backHistory.depth = 0;

        return true;
    }

    return false;
}

window.addEventListener('popstate', closeOnBack, { capture: true });
document.addEventListener('focusin', rememberFocus);
document.addEventListener('pointerdown', rememberFocus, { capture: true });

export function useCloseOnBack(
    close: () => void,
    active: boolean,
): () => boolean {
    const latest = useRef(close);
    const own = useRef<(() => void) | null>(null);

    useEffect(() => {
        latest.current = close;
    });

    useEffect(() => {
        if (!active) {
            return;
        }

        const run = () => latest.current();

        openModals.push(run);
        own.current = run;

        if (!backHistory.depth) {
            backHistory.url = window.location.href;
        }

        window.history.pushState(window.history.state, '');
        backHistory.depth++;

        return () => {
            own.current = null;
            openModals.splice(openModals.indexOf(run), 1);
            window.setTimeout(() => {
                const unused = backHistory.depth - openModals.length;

                if (unused <= 0) {
                    return;
                }

                backHistory.depth -= unused;

                if (window.location.href === backHistory.url) {
                    backHistory.latest = window.history.state;
                    backHistory.skipNext = true;
                    window.history.go(-unused);
                }
            });
        };
    }, [active]);

    return () => own.current !== null && openModals.at(-1) === own.current;
}

export function keepUnlessOnTop(onTop: () => boolean) {
    return (event: Event) => {
        if (!onTop()) {
            event.preventDefault();
        }
    };
}

type Motion = {
    start: number;
    last: number;
    time: number;
    speed: number;
};

type Drag = Motion & {
    pointer: number;
    onHandle: boolean;
};

function isWide(): boolean {
    return window.matchMedia('(min-width: 40rem)').matches;
}

function follow(motion: Motion, position: number, time: number) {
    motion.speed = (position - motion.last) / Math.max(time - motion.time, 1);
    motion.last = position;
    motion.time = time;
}

function closes(motion: Motion, height: number): boolean {
    return (
        motion.last - motion.start > height * CLOSE_DISTANCE ||
        motion.speed > CLOSE_VELOCITY
    );
}

function settleIfKept(element: HTMLElement) {
    window.setTimeout(() => {
        if (element.dataset.state === 'open') {
            element.style.transition = '';
            element.style.transform = '';
        }
    });
}

function useDrawerDrag(close: () => void) {
    const drag = useRef<Drag | null>(null);

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        const target = event.target as Element;

        if (
            isWide() ||
            !event.currentTarget.contains(target) ||
            !target.closest('[data-drawer-drag]') ||
            target.closest('button, a, input, [role=button]')
        ) {
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.transition = 'none';
        drag.current = {
            pointer: event.pointerId,
            start: event.clientY,
            last: event.clientY,
            time: event.timeStamp,
            speed: 0,
            onHandle: Boolean(target.closest('[data-drawer-handle]')),
        };
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const current = drag.current;

        if (!current || current.pointer !== event.pointerId) {
            return;
        }

        follow(current, event.clientY, event.timeStamp);
        event.currentTarget.style.transform = `translateY(${Math.max(event.clientY - current.start, 0)}px)`;
    };

    const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const current = drag.current;

        if (!current || current.pointer !== event.pointerId) {
            return;
        }

        drag.current = null;
        current.last = event.clientY;
        const element = event.currentTarget;
        const tapped =
            current.onHandle &&
            Math.abs(current.last - current.start) < TAP_DISTANCE;

        if (closes(current, element.offsetHeight) || tapped) {
            close();
            settleIfKept(element);

            return;
        }

        element.style.transition = '';
        element.style.transform = '';
    };

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
    };
}

type Pull = Motion & {
    startX: number;
    pulling: boolean;
};

function scrolledAbove(target: EventTarget | null, panel: Element): boolean {
    for (
        let element = target instanceof Element ? target : null;
        element && element !== panel;
        element = element.parentElement
    ) {
        if (element.scrollTop > 0) {
            return true;
        }
    }

    return false;
}

function usePullToClose(
    element: HTMLDivElement | null,
    active: boolean,
    close: () => void,
) {
    const latest = useRef(close);

    useEffect(() => {
        latest.current = close;
    });

    useEffect(() => {
        if (!active || !element) {
            return;
        }

        let pull: Pull | null = null;

        const reset = () => {
            element.style.transition = '';
            element.style.transform = '';
        };

        const onStart = (event: TouchEvent) => {
            const target = event.target as Element;

            pull =
                event.touches.length === 1 &&
                !isWide() &&
                target.closest('[data-drawer-body]') &&
                !scrolledAbove(target, element)
                    ? {
                          start: event.touches[0].clientY,
                          startX: event.touches[0].clientX,
                          last: event.touches[0].clientY,
                          time: event.timeStamp,
                          speed: 0,
                          pulling: false,
                      }
                    : null;
        };

        const onMove = (event: TouchEvent) => {
            if (!pull) {
                return;
            }

            const touch = event.touches[0];
            const distance = touch.clientY - pull.start;

            if (!pull.pulling) {
                if (
                    distance <= 0 ||
                    Math.abs(touch.clientX - pull.startX) > distance
                ) {
                    pull = null;

                    return;
                }

                pull.pulling = true;
                element.style.transition = 'none';
            }

            event.preventDefault();
            follow(pull, touch.clientY, event.timeStamp);
            element.style.transform = `translateY(${Math.max(distance, 0)}px)`;
        };

        const onEnd = () => {
            const current = pull;
            pull = null;

            if (!current?.pulling) {
                return;
            }

            if (closes(current, element.offsetHeight)) {
                latest.current();
                settleIfKept(element);
            } else {
                reset();
            }
        };

        element.addEventListener('touchstart', onStart, { passive: true });
        element.addEventListener('touchmove', onMove, { passive: false });
        element.addEventListener('touchend', onEnd);
        element.addEventListener('touchcancel', onEnd);

        return () => {
            element.removeEventListener('touchstart', onStart);
            element.removeEventListener('touchmove', onMove);
            element.removeEventListener('touchend', onEnd);
            element.removeEventListener('touchcancel', onEnd);
        };
    }, [element, active]);
}

const formats = {
    dialog: {
        overlay:
            'data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in items-center justify-center p-md pt-[max(var(--padding-md),env(safe-area-inset-top))] pb-[max(var(--padding-md),env(safe-area-inset-bottom))]',
        panel: 'max-h-full w-full',
        motion: 'data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in',
    },
};

type Format = 'dialog' | 'drawer';

const drawerOverlay =
    'data-[state=closed]:animate-drawer-overlay-out data-[state=open]:animate-drawer-overlay-in';

const drawers = {
    sheet: {
        right: {
            overlay: `${drawerOverlay} flex-col justify-end pt-[max(--spacing(14),env(safe-area-inset-top))] sm:flex-row sm:p-(--drawer-gap) sm:pt-[max(var(--drawer-gap),env(safe-area-inset-top))] sm:pb-[max(var(--drawer-gap),env(safe-area-inset-bottom))]`,
            panel: 'h-full w-full rounded-b-none border-b-0 sm:max-w-md sm:rounded-b sm:border-b',
            motion: 'data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom sm:data-[state=closed]:animate-slide-out-right sm:data-[state=open]:animate-slide-in-right',
        },
        left: {
            overlay: `${drawerOverlay} flex-col justify-end pt-[max(--spacing(14),env(safe-area-inset-top))] sm:flex-row sm:justify-start sm:p-(--drawer-gap) sm:pt-[max(var(--drawer-gap),env(safe-area-inset-top))] sm:pb-[max(var(--drawer-gap),env(safe-area-inset-bottom))]`,
            panel: 'h-full w-full rounded-b-none border-b-0 sm:max-w-md sm:rounded-b sm:border-b',
            motion: 'data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom sm:data-[state=closed]:animate-slide-out-left sm:data-[state=open]:animate-slide-in-left',
        },
    },
    panel: {
        right: {
            overlay: `${drawerOverlay} flex-row justify-end p-(--drawer-gap) pt-[max(var(--drawer-gap),env(safe-area-inset-top))] pb-[max(var(--drawer-gap),env(safe-area-inset-bottom))]`,
            panel: 'h-full w-full max-w-xs sm:max-w-md',
            motion: 'data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right',
        },
        left: {
            overlay: `${drawerOverlay} flex-row justify-start p-(--drawer-gap) pt-[max(var(--drawer-gap),env(safe-area-inset-top))] pb-[max(var(--drawer-gap),env(safe-area-inset-bottom))]`,
            panel: 'h-full w-full max-w-xs sm:max-w-md',
            motion: 'data-[state=closed]:animate-slide-out-left data-[state=open]:animate-slide-in-left',
        },
    },
};

const topDrawer = {
    overlay: `${drawerOverlay} flex-col justify-end pt-[max(--spacing(14),env(safe-area-inset-top))] sm:items-center sm:justify-start sm:p-md sm:pt-[12vh]`,
    panel: 'h-full w-full rounded-b-none border-b-0 sm:h-auto sm:max-w-lg sm:rounded-b sm:border-b',
    motion: 'data-[state=closed]:animate-slide-out-bottom data-[state=open]:animate-slide-in-bottom sm:data-[state=closed]:animate-pop-out sm:data-[state=open]:animate-pop-in',
};

function isSheet(props: ModalProps): boolean {
    return (
        props.format === 'drawer' &&
        (props.side === 'top' || props.mobile !== 'panel')
    );
}

function formatOf(props: ModalProps) {
    if (props.format !== 'drawer') {
        return formats.dialog;
    }

    return props.side === 'top'
        ? topDrawer
        : drawers[props.mobile ?? 'sheet'][props.side ?? 'right'];
}

const widths = {
    md: 'max-w-lg',
    lg: 'max-w-4xl',
};

type ModalProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactNode;
    format?: Format;
    side?: 'left' | 'right' | 'top';
    mobile?: 'sheet' | 'panel';
    width?: keyof typeof widths;
    bare?: boolean;
    fit?: boolean;
    top?: boolean;
    actions?: ReactNode;
    hideClose?: boolean;
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
    const formatName = props.format ?? 'dialog';
    const format = formatOf(props);
    const sheet = isSheet(props);
    const closeButton = useRef<HTMLButtonElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const [panel, setPanel] = useState<HTMLDivElement | null>(null);
    const panelRef = useCallback((node: HTMLDivElement | null) => {
        content.current = node;
        setPanel(node);
    }, []);
    const close = () => closeButton.current?.click();
    const drag = useDrawerDrag(close);
    const onTop = useCloseOnBack(close, panel !== null && props.open !== false);
    usePullToClose(panel, sheet && props.open !== false, close);

    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                className={cn(
                    'fixed inset-0 z-50 flex',
                    backdropClass,
                    format.overlay,
                    props.bare && 'backdrop-blur-md lg:p-xl',
                    props.top && 'items-start sm:pt-[12vh]',
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
                    onInteractOutside={keepUnlessOnTop(onTop)}
                    className={cn(
                        'relative flex flex-col outline-none [--modal-padding:var(--padding-lg)]',
                        props.bare
                            ? 'pointer-events-none! h-full data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in'
                            : [
                                  'overflow-hidden rounded border border-border bg-background shadow-xl transition-transform duration-200 ease-drawer',
                                  sheet &&
                                      props.fit &&
                                      'max-sm:h-auto max-sm:max-h-full max-sm:min-h-1/3',
                                  format.motion,
                                  formatName === 'dialog' &&
                                      widths[props.width ?? 'md'],
                              ],
                        format.panel,
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
                        <FramedBody {...props} format={formatName} />
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Overlay>
        </DialogPrimitive.Portal>
    );
}

function BareBody(props: ModalProps) {
    return (
        <>
            <DialogPrimitive.Title className="sr-only">
                {props.title}
            </DialogPrimitive.Title>
            <div className="flex size-full items-center justify-center *:pointer-events-auto">
                {props.children}
            </div>
            <DialogPrimitive.Close
                className={cn(
                    buttonClass({ variant: 'outline', square: true }),
                    'pointer-events-auto absolute top-0 right-0',
                )}
            >
                <X className="size-icon-md" />
            </DialogPrimitive.Close>
        </>
    );
}

type FramedBodyProps = ModalProps & {
    format: Format;
};

type ModalCloseButtonProps = {
    className?: string;
};

export function ModalCloseButton(props: ModalCloseButtonProps) {
    return (
        <DialogPrimitive.Close
            className={cn(
                buttonClass({ variant: 'ghost', square: true, bleed: true }),
                props.className,
            )}
        >
            <X className="size-icon-md" />
        </DialogPrimitive.Close>
    );
}

function FramedBody(props: FramedBodyProps) {
    const isDrawer = isSheet(props);
    const [footer, setFooter] = useState<HTMLDivElement | null>(null);
    const close = !props.hideClose && (
        <ModalCloseButton className={cn(isDrawer && 'max-sm:hidden')} />
    );

    return (
        <>
            {isDrawer && (
                <div
                    data-drawer-drag
                    data-drawer-handle
                    className="flex shrink-0 cursor-pointer touch-none justify-center py-md sm:hidden"
                >
                    <span className="h-1.5 w-10 rounded-full bg-border" />
                </div>
            )}
            {props.title && (
                <header
                    data-drawer-drag={isDrawer || undefined}
                    className={cn(
                        headingClass,
                        'shrink-0 px-(--modal-padding) py-md',
                        isDrawer && 'touch-none max-sm:pt-0',
                    )}
                >
                    <div className="flex items-start justify-between gap-md">
                        <HeadingTitle as={DialogPrimitive.Title}>
                            {props.title}
                        </HeadingTitle>
                        <div className="flex h-lh shrink-0 items-center gap-md">
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
                    'relative flex min-h-0 flex-1 flex-col gap-md overflow-x-hidden overflow-y-auto overscroll-contain p-(--modal-padding) [&:not(:has(>:not(:empty)))]:hidden',
                    isDrawer && [
                        'pb-[max(var(--modal-padding),env(safe-area-inset-bottom))]',
                        '[&:has(+*:not(:empty))]:pb-(--modal-padding)',
                    ],
                    props.title
                        ? 'border-t border-border'
                        : isDrawer && 'max-sm:pt-sm',
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
                    'flex shrink-0 gap-sm border-t border-border px-(--modal-padding) py-md empty:hidden',
                    isDrawer &&
                        'pb-[max(var(--padding-md),env(safe-area-inset-bottom))]',
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
            <div className="flex flex-1 justify-end gap-sm">
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
