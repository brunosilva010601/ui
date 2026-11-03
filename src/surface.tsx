import { Slot } from '@radix-ui/react-slot';
import { useId } from 'react';
import type { ReactNode } from 'react';
import { Cover } from './cover';
import { cn } from './lib/utils';

export const surfaceClass = 'rounded border border-border bg-surface';

type Props = {
    flush?: boolean;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
} & (
    | {
          onClick?: () => void;
          href?: string;
          external?: boolean;
          asChild?: false;
      }
    | {
          asChild: true;
          onClick?: never;
          href?: never;
          external?: never;
      }
);

export function Surface(props: Props) {
    const contentId = useId();
    const clickable = !props.disabled && Boolean(props.onClick || props.href);
    const shared = cn(
        surfaceClass,
        '[--row-surface:var(--color-surface)]',
        !props.flush && 'p-3 [--bleed:var(--spacing-3)]',
        props.flush && 'overflow-clip',
        props.selected && 'bg-foreground/10',
        props.disabled && 'opacity-50',
    );

    if (props.asChild) {
        return (
            <Slot
                aria-disabled={props.disabled || undefined}
                className={cn(
                    shared,
                    'cursor-pointer transition-colors hover:bg-surface-hover active:bg-surface-hover disabled:cursor-default disabled:hover:bg-surface',
                    props.disabled && 'pointer-events-none',
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
                shared,
                'relative',
                clickable &&
                    'transition-colors has-[>[data-layer]:active]:bg-surface-hover [@media(hover:hover)]:hover:bg-surface-hover',
                props.className,
            )}
        >
            {clickable && (
                <Cover
                    data-layer
                    aria-labelledby={contentId}
                    onClick={props.onClick}
                    href={props.href}
                    external={props.external}
                    className="inset-0 rounded-[inherit] focus-visible:-outline-offset-2"
                />
            )}
            <div
                id={contentId}
                className={cn(
                    'contents',
                    clickable &&
                        '*:pointer-events-none *:relative [&_a,&_button,&_input,&_label,&_select,&_textarea]:pointer-events-auto',
                )}
            >
                {props.children}
            </div>
        </div>
    );
}
