import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const widths = {
    narrow: 'max-w-sm',
    bar: 'max-w-3xl',
    page: 'max-w-6xl',
    full: 'max-w-none',
};

type Props = {
    width?: keyof typeof widths;
    padded?: boolean;
    children: ReactNode;
};

export function Container(props: Props) {
    return (
        <div
            className={cn(
                'w-full min-w-0',
                widths[props.width ?? 'page'],
                props.padded && 'p-(--gutter) [--bleed:var(--gutter)]',
            )}
        >
            {props.children}
        </div>
    );
}
