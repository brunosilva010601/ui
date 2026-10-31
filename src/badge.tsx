import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { tones } from './tones';
import type { Tone } from './tones';

const sizes = {
    sm: 'gap-2px px-8px py-2px text-12px [&_svg]:size-12px',
    md: 'gap-4px px-8px py-4px text-14px [&_svg]:size-icon-14px',
};

type Props = {
    tone?: Tone;
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
                'inline-flex w-fit shrink-0 items-center rounded-full border border-transparent font-semibold whitespace-nowrap [&_svg]:shrink-0',
                tones[props.tone ?? 'neutral'].soft,
                sizes[props.size ?? 'sm'],
                props.count && 'tabular-nums',
                props.className,
            )}
        >
            {props.children}
        </span>
    );
}
