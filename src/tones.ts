import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const tones = {
    neutral: {
        soft: 'bg-foreground/5 text-foreground-soft',
        solid: 'bg-foreground text-background',
        text: 'text-foreground-soft',
        icon: Info,
    },
    primary: {
        soft: 'bg-primary/10 text-primary-text',
        solid: 'bg-primary text-primary-foreground',
        text: 'text-primary-text',
        icon: Info,
    },
    success: {
        soft: 'bg-success/15 text-success',
        solid: 'bg-success text-success-foreground',
        text: 'text-success',
        icon: CircleCheck,
    },
    warning: {
        soft: 'bg-warning/15 text-warning',
        solid: 'bg-warning text-warning-foreground',
        text: 'text-warning',
        icon: TriangleAlert,
    },
    danger: {
        soft: 'bg-danger/10 text-danger',
        solid: 'bg-danger text-danger-foreground',
        text: 'text-danger',
        icon: CircleAlert,
    },
} satisfies Record<
    string,
    { soft: string; solid: string; text: string; icon: LucideIcon }
>;

export type Tone = keyof typeof tones;
