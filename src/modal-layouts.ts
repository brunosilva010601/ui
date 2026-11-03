export type ModalMobile =
    'dialog' | 'top' | 'left' | 'right' | 'sheet' | 'full';

export type ModalDesktop = 'dialog' | 'top' | 'left' | 'right';

type Layout = {
    overlay: string;
    panel: string;
};

export const desktopFor: Record<ModalMobile, ModalDesktop> = {
    dialog: 'dialog',
    top: 'top',
    left: 'left',
    right: 'right',
    sheet: 'dialog',
    full: 'right',
};

export const mobileLayouts: Record<ModalMobile, Layout> = {
    dialog: {
        overlay:
            'max-sm:items-center max-sm:justify-center max-sm:p-3 max-sm:pt-[max(var(--spacing-3),var(--spacing-safe-top))] max-sm:pb-[max(var(--spacing-3),var(--spacing-safe-bottom))] max-sm:data-[state=closed]:animate-fade-out max-sm:data-[state=open]:animate-fade-in',
        panel: 'max-sm:max-h-full max-sm:w-full max-sm:data-[state=closed]:animate-pop-out max-sm:data-[state=open]:animate-pop-in',
    },
    top: {
        overlay:
            'max-sm:items-start max-sm:justify-center max-sm:p-3 max-sm:pt-[max(var(--spacing-3),var(--spacing-safe-top))] max-sm:pb-[max(var(--spacing-3),var(--spacing-safe-bottom))] max-sm:data-[state=closed]:animate-fade-out max-sm:data-[state=open]:animate-fade-in',
        panel: 'max-sm:max-h-full max-sm:w-full max-sm:data-[state=closed]:animate-pop-out max-sm:data-[state=open]:animate-pop-in',
    },
    left: {
        overlay:
            'max-sm:justify-start max-sm:p-(--drawer-gap) max-sm:pt-[max(var(--drawer-gap),var(--spacing-safe-top))] max-sm:pb-[max(var(--drawer-gap),var(--spacing-safe-bottom))] max-sm:data-[state=closed]:animate-drawer-overlay-out max-sm:data-[state=open]:animate-drawer-overlay-in',
        panel: 'max-sm:h-full max-sm:w-full max-sm:max-w-xs max-sm:data-[state=closed]:animate-slide-out-left max-sm:data-[state=open]:animate-slide-in-left',
    },
    right: {
        overlay:
            'max-sm:justify-end max-sm:p-(--drawer-gap) max-sm:pt-[max(var(--drawer-gap),var(--spacing-safe-top))] max-sm:pb-[max(var(--drawer-gap),var(--spacing-safe-bottom))] max-sm:data-[state=closed]:animate-drawer-overlay-out max-sm:data-[state=open]:animate-drawer-overlay-in',
        panel: 'max-sm:h-full max-sm:w-full max-sm:max-w-xs max-sm:data-[state=closed]:animate-slide-out-right max-sm:data-[state=open]:animate-slide-in-right',
    },
    sheet: {
        overlay:
            'max-sm:flex-col max-sm:justify-end max-sm:pt-[max(var(--sheet-top),var(--spacing-safe-top))] max-sm:data-[state=closed]:animate-drawer-overlay-out max-sm:data-[state=open]:animate-drawer-overlay-in',
        panel: 'max-sm:max-h-full max-sm:min-h-1/3 max-sm:w-full max-sm:rounded-b-none max-sm:border-b-0 max-sm:data-[state=closed]:animate-slide-out-bottom max-sm:data-[state=open]:animate-slide-in-bottom',
    },
    full: {
        overlay:
            'max-sm:flex-col max-sm:justify-end max-sm:pt-[max(var(--sheet-top),var(--spacing-safe-top))] max-sm:data-[state=closed]:animate-drawer-overlay-out max-sm:data-[state=open]:animate-drawer-overlay-in',
        panel: 'max-sm:h-full max-sm:w-full max-sm:rounded-b-none max-sm:border-b-0 max-sm:data-[state=closed]:animate-slide-out-bottom max-sm:data-[state=open]:animate-slide-in-bottom',
    },
};

export const desktopLayouts: Record<ModalDesktop, Layout> = {
    dialog: {
        overlay:
            'sm:items-center sm:justify-center sm:p-3 sm:pt-[max(var(--spacing-3),var(--spacing-safe-top))] sm:pb-[max(var(--spacing-3),var(--spacing-safe-bottom))] sm:data-[state=closed]:animate-fade-out sm:data-[state=open]:animate-fade-in',
        panel: 'sm:max-h-full sm:w-full sm:data-[state=closed]:animate-pop-out sm:data-[state=open]:animate-pop-in',
    },
    top: {
        overlay:
            'sm:items-start sm:justify-center sm:p-3 sm:pt-[12vh] sm:data-[state=closed]:animate-fade-out sm:data-[state=open]:animate-fade-in',
        panel: 'sm:max-h-full sm:w-full sm:data-[state=closed]:animate-pop-out sm:data-[state=open]:animate-pop-in',
    },
    left: {
        overlay:
            'sm:justify-start sm:p-(--drawer-gap) sm:pt-[max(var(--drawer-gap),var(--spacing-safe-top))] sm:pb-[max(var(--drawer-gap),var(--spacing-safe-bottom))] sm:data-[state=closed]:animate-drawer-overlay-out sm:data-[state=open]:animate-drawer-overlay-in',
        panel: 'sm:h-full sm:w-full sm:max-w-md sm:data-[state=closed]:animate-slide-out-left sm:data-[state=open]:animate-slide-in-left',
    },
    right: {
        overlay:
            'sm:justify-end sm:p-(--drawer-gap) sm:pt-[max(var(--drawer-gap),var(--spacing-safe-top))] sm:pb-[max(var(--drawer-gap),var(--spacing-safe-bottom))] sm:data-[state=closed]:animate-drawer-overlay-out sm:data-[state=open]:animate-drawer-overlay-in',
        panel: 'sm:h-full sm:w-full sm:max-w-md sm:data-[state=closed]:animate-slide-out-right sm:data-[state=open]:animate-slide-in-right',
    },
};

export const centered: ModalDesktop[] = ['dialog', 'top'];
