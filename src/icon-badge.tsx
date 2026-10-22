import type { LucideIcon } from 'lucide-react';
import { cn } from './lib/utils';
import { paletteText } from './palette';
import type { PaletteColor } from './palette';

export const tintClass =
    'border-current/30 bg-current/10 text-primary-text hover:bg-current/10 hover:text-primary-text active:bg-current/10 active:text-primary-text';

const sizes = {
    sm: { badge: 'size-8', icon: 'size-icon-sm' },
    md: { badge: 'size-10', icon: 'size-icon-md' },
    lg: { badge: 'size-12', icon: 'size-icon-lg' },
};

type Props = {
    icon: LucideIcon;
    size?: keyof typeof sizes;
    color?: PaletteColor | null;
};

export function IconBadge(props: Props) {
    const size = sizes[props.size ?? 'md'];

    return (
        <span
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full border border-current/30 bg-current/10',
                paletteText(props.color),
                size.badge,
            )}
        >
            <props.icon className={size.icon} />
        </span>
    );
}
