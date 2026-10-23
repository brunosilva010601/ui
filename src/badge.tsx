import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const tones = {
    neutral: 'bg-foreground/5 text-foreground-soft',
    primary: 'bg-primary/10 text-primary-text',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/10 text-danger',
};

const sizes = {
    sm: 'gap-2xs px-sm py-2xs text-xs [&_svg]:size-icon-xs',
    md: 'gap-xs px-sm py-xs text-sm [&_svg]:size-icon-sm',
};

type Props = {
    tone?: keyof typeof tones;
    size?: keyof typeof sizes;
    count?: boolean;
    title?: string;
    className?: string;
    children: ReactNode;
};

export function Badge(props: Props) {
    return (
        <span
            title={props.title}
            className={cn(
                'inline-flex w-fit shrink-0 items-center rounded-full font-semibold whitespace-nowrap [&_svg]:shrink-0',
                tones[props.tone ?? 'neutral'],
                sizes[props.size ?? 'sm'],
                props.count && 'tabular-nums',
                props.className,
            )}
        >
            {props.children}
        </span>
    );
}
