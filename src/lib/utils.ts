import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const spacing = [
    '2px',
    '4px',
    '6px',
    '8px',
    '10px',
    '12px',
    '16px',
    '20px',
    '24px',
    '32px',
    '40px',
    '48px',
    'safe-top',
    'safe-bottom',
];

const textSizes = [
    '12px',
    '14px',
    '16px',
    '18px',
    '24px',
    '30px',
    '48px',
    '60px',
];

const gaps = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', ...spacing];

const iconSizes = [
    'icon-xs',
    'icon-sm',
    'icon-md',
    'icon-lg',
    'icon-xl',
    'icon-14px',
    'icon-16px',
    'icon-20px',
    'icon-24px',
    'icon-32px',
    'dot',
    'touch',
];

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            spacing: gaps,
            text: textSizes,
            shadow: ['control', 'floating', 'overlay'],
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
