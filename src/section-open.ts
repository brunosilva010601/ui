import { useState } from 'react';

function storedOpen(key: string | undefined, fallback: boolean): boolean {
    try {
        const stored = key && window.localStorage.getItem(`section:${key}`);

        return stored ? stored === 'open' : fallback;
    } catch {
        return fallback;
    }
}

function storeOpen(key: string | undefined, open: boolean): void {
    try {
        if (key) {
            window.localStorage.setItem(
                `section:${key}`,
                open ? 'open' : 'closed',
            );
        }
    } catch {
        return;
    }
}

type Options = {
    remember?: string;
    collapsed?: boolean;
};

export function useOpen(options: Options): [boolean, (next: boolean) => void] {
    const [open, setOpenState] = useState(() =>
        storedOpen(options.remember, !options.collapsed),
    );

    return [
        open,
        (next) => {
            setOpenState(next);
            storeOpen(options.remember, next);
        },
    ];
}
