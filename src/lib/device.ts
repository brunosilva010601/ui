import { useSyncExternalStore } from 'react';

const coarsePointer = '(pointer: coarse)';

function subscribeToPointer(change: () => void) {
    const query = window.matchMedia(coarsePointer);
    query.addEventListener('change', change);

    return () => query.removeEventListener('change', change);
}

export function useTouch(): boolean {
    return useSyncExternalStore(
        subscribeToPointer,
        () => window.matchMedia(coarsePointer).matches,
        () => false,
    );
}

export function useHydrated(): boolean {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
}
