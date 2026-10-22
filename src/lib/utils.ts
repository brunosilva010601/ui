import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const gaps = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'];

const iconSizes = ['icon-xs', 'icon-sm', 'icon-md', 'icon-lg', 'icon-xl'];

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            spacing: gaps,
        },
        classGroups: {
            gap: [{ gap: gaps }],
            'gap-x': [{ 'gap-x': gaps }],
            'gap-y': [{ 'gap-y': gaps }],
            size: [{ size: iconSizes }],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
