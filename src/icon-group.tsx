import type { ReactNode } from 'react';
import { cn } from './lib/utils';

type Props = {
    className?: string;
    children: ReactNode;
};

export function IconGroup(props: Props) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center -me-[calc(var(--spacing-10px)_+_1px)]',
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}
