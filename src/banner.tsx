import {
    CircleAlert,
    CircleCheck,
    Info,
    LoaderCircle,
    TriangleAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const tones = {
    neutral: 'bg-foreground/5 text-foreground-soft',
    primary: 'bg-primary/10 text-primary-text',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/10 text-danger',
};

const toneIcons: Record<keyof typeof tones, LucideIcon> = {
    neutral: Info,
    primary: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: CircleAlert,
};

type Props = {
    tone?: keyof typeof tones;
    icon?: LucideIcon;
    busy?: boolean;
    bleed?: boolean;
    action?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function Banner(props: Props) {
    const tone = props.tone ?? 'neutral';
    const Icon = props.busy ? LoaderCircle : (props.icon ?? toneIcons[tone]);

    return (
        <div
            role={tone === 'danger' ? 'alert' : 'status'}
            className={cn(
                'flex items-center gap-md rounded px-md py-sm',
                tones[tone],
                props.bleed &&
                    'rounded-none -mx-(--banner-inset) px-(--banner-inset) [--banner-inset:var(--bleed,var(--gutter))]',
                props.className,
            )}
        >
            <div className="flex min-w-0 flex-1 items-center gap-sm">
                <Icon
                    className={cn(
                        'size-icon-sm shrink-0',
                        props.busy && 'animate-spin',
                    )}
                />
                <p className="text-sm text-balance">{props.children}</p>
            </div>
            {props.action}
        </div>
    );
}
