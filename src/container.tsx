import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const widths = {
    narrow: 'max-w-sm',
    column: 'max-w-lg',
    bar: 'max-w-3xl',
    page: 'max-w-6xl',
    full: 'max-w-none',
};

export type ContainerWidth = keyof typeof widths;

type Props = {
    width?: ContainerWidth;
    padded?: boolean;
    className?: string;
    children: ReactNode;
};

export function Container(props: Props) {
    return (
        <div
            className={cn(
                'w-full min-w-0',
                widths[props.width ?? 'page'],
                props.padded && 'p-(--gutter) [--bleed:var(--gutter)]',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}
