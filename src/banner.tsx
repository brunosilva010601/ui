import { LoaderCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { tones } from './tones';
import type { Tone } from './tones';

type Props = {
    tone?: Tone;
    icon?: LucideIcon;
    busy?: boolean;
    bleed?: boolean;
    action?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function Banner(props: Props) {
    const tone = tones[props.tone ?? 'neutral'];
    const Icon = props.busy ? LoaderCircle : (props.icon ?? tone.icon);

    return (
        <div
            role={props.tone === 'danger' ? 'alert' : 'status'}
            className={cn(
                'flex items-center gap-12px rounded px-12px py-8px',
                tone.soft,
                props.bleed &&
                    'rounded-none -mx-(--banner-inset) px-(--banner-inset) [--banner-inset:var(--bleed,var(--gutter))]',
                props.className,
            )}
        >
            <div className="flex min-w-0 flex-1 items-center gap-8px">
                <Icon
                    className={cn(
                        'size-icon-16px shrink-0',
                        props.busy && 'animate-spin',
                    )}
                />
                <p className="text-14px text-balance">{props.children}</p>
            </div>
            {props.action}
        </div>
    );
}
