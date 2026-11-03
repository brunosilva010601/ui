import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { tones } from './tones';
import type { Tone } from './tones';

const sizes = {
    sm: 'gap-0.5 px-2 py-0.5 text-xs [&_svg]:size-3',
    md: 'gap-1 px-2 py-1 text-sm [&_svg]:size-3.5',
};

type Props = {
    tone?: Tone;
    size?: keyof typeof sizes;
    solid?: boolean;
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
                tones[props.tone ?? 'neutral'][props.solid ? 'solid' : 'soft'],
                sizes[props.size ?? 'sm'],
                props.count && 'tabular-nums',
                props.className,
            )}
        >
            {props.children}
        </span>
    );
}
