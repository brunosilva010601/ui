import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            spacing: ['safe-top', 'safe-bottom'],
            shadow: ['control', 'floating', 'overlay'],
        },
        classGroups: {
            size: [{ size: ['dot', 'touch'] }],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
