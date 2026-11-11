import { useSyncExternalStore } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

export type Scheme = Exclude<Appearance, 'system'>;

export const appearances: Appearance[] = ['light', 'dark', 'system'];

const DARK_QUERY = '(prefers-color-scheme: dark)';

const listeners = new Set<() => void>();
let current: Appearance = 'system';

function prefersDark(): boolean {
    return (
        typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches
    );
}

export function isAppearance(value: unknown): value is Appearance {
    return appearances.includes(value as Appearance);
}

export function resolveAppearance(appearance: Appearance): Scheme {
    if (appearance === 'system') {
        return prefersDark() ? 'dark' : 'light';
    }

    return appearance;
}

function apply(): void {
    const dark = resolveAppearance(current) === 'dark';

    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
}

function emitChange(): void {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

export function initializeAppearance(initial: Appearance): void {
    if (typeof window === 'undefined') {
        return;
    }

    current = initial;
    apply();

    window.matchMedia(DARK_QUERY).addEventListener('change', () => {
        apply();
        emitChange();
    });
}

export function setAppearance(next: Appearance): void {
    current = next;
    apply();
    emitChange();
}

export function useAppearance(fallback: Appearance = 'system'): Appearance {
    return useSyncExternalStore(
        subscribe,
        () => current,
        () => fallback,
    );
}

export function useScheme(fallback: Appearance = 'system'): Scheme {
    return useSyncExternalStore(
        subscribe,
        () => resolveAppearance(current),
        () => resolveAppearance(fallback),
    );
}
