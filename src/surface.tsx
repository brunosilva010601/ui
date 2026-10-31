import { Slot } from '@radix-ui/react-slot';
import type { ReactNode } from 'react';
import { Cover } from './cover';
import { cn } from './lib/utils';

export const surfaceClass = 'rounded border border-border bg-surface';

type Props = {
    flush?: boolean;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    href?: string;
    external?: boolean;
    asChild?: boolean;
    className?: string;
    children?: ReactNode;
};

export function Surface(props: Props) {
    const clickable = !props.disabled && Boolean(props.onClick || props.href);

    if (props.asChild) {
        return (
            <Slot
                className={cn(
                    surfaceClass,
                    'cursor-pointer p-12px transition-colors hover:bg-surface-hover active:bg-surface-hover disabled:cursor-default disabled:hover:bg-surface',
                    props.className,
                )}
            >
                {props.children}
            </Slot>
        );
    }

    return (
        <div
            aria-disabled={props.disabled || undefined}
            className={cn(
                surfaceClass,
                'relative',
                !props.flush && 'p-12px [--bleed:var(--spacing-12px)]',
                props.flush && 'overflow-clip',
                props.selected && 'bg-foreground/10',
                clickable &&
                    'transition-colors has-[>[data-layer]:active]:bg-surface-hover [@media(hover:hover)]:hover:bg-surface-hover',
                props.disabled && 'opacity-50',
                props.className,
            )}
        >
            {clickable && (
                <Cover
                    data-layer
                    onClick={props.onClick}
                    href={props.href}
                    external={props.external}
                    className="inset-0 rounded-[inherit] focus-visible:-outline-offset-2"
                />
            )}
            <div
                className={cn(
                    'contents',
                    clickable &&
                        'pointer-events-none relative block [&_a,&_button,&_input,&_label,&_select,&_textarea]:pointer-events-auto',
                )}
            >
                {props.children}
            </div>
        </div>
    );
}
