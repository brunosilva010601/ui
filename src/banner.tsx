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
                'flex items-center gap-3 rounded px-3 py-2',
                tone.soft,
                props.bleed &&
                    'rounded-none -mx-(--banner-inset) px-(--banner-inset) [--banner-inset:var(--bleed,var(--gutter))]',
                props.className,
            )}
        >
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <Icon
                    className={cn(
                        'size-4 shrink-0',
                        props.busy && 'animate-spin',
                    )}
                />
                <p className="text-sm text-balance">{props.children}</p>
            </div>
            {props.action}
        </div>
    );
}
