import type { ReactNode } from 'react';
import { buttonTextClass } from './button';
import type { ButtonSize } from './button';
import { cn } from './lib/utils';

type Props = {
    size?: ButtonSize;
    marked?: boolean;
    className?: string;
    children: ReactNode;
};

export function Pill(props: Props) {
    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full border bg-control whitespace-nowrap text-foreground select-none',
                props.marked ? 'border-foreground' : 'border-border',
                buttonTextClass(props.size),
                props.className,
            )}
        >
            {props.children}
        </span>
    );
}
