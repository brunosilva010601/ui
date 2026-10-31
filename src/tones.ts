import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const tones = {
    neutral: {
        soft: 'bg-foreground/5 text-foreground-soft',
        text: 'text-foreground-soft',
        icon: Info,
    },
    primary: {
        soft: 'bg-primary/10 text-primary-text',
        text: 'text-primary-text',
        icon: Info,
    },
    success: {
        soft: 'bg-success/15 text-success',
        text: 'text-success',
        icon: CircleCheck,
    },
    warning: {
        soft: 'bg-warning/15 text-warning',
        text: 'text-warning',
        icon: TriangleAlert,
    },
    danger: {
        soft: 'bg-danger/10 text-danger',
        text: 'text-danger',
        icon: CircleAlert,
    },
} satisfies Record<string, { soft: string; text: string; icon: LucideIcon }>;

export type Tone = keyof typeof tones;
