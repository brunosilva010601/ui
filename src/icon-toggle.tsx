import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const tones = {
    primary:
        'text-primary-text hover:text-primary-text active:text-primary-text',
};

type Props = {
    label: string;
    active: boolean;
    tone: keyof typeof tones;
    inline?: boolean;
    iconOnly?: boolean;
    onClick: () => void;
    children: ReactNode;
};

export function IconToggle(props: Props) {
    return (
        <button
            type="button"
            aria-pressed={props.active}
            onClick={props.onClick}
            className={cn(
                'flex cursor-pointer items-center rounded border border-border bg-control px-xs text-sm whitespace-nowrap text-foreground-soft transition hover:bg-control-hover hover:text-foreground active:bg-control-hover active:text-foreground disabled:pointer-events-none disabled:opacity-50',
                props.inline
                    ? 'justify-center gap-md py-sm [&_svg]:size-icon-md'
                    : 'flex-col justify-center gap-xs py-md [&_svg]:size-icon-lg',
                props.iconOnly && 'aspect-square justify-center py-0',
                props.active &&
                    'border-current bg-current/10 hover:bg-current/10 active:bg-current/10',
                props.active && tones[props.tone],
            )}
        >
            {props.children}
            {props.iconOnly ? (
                <span className="sr-only">{props.label}</span>
            ) : (
                props.label
            )}
        </button>
    );
}
