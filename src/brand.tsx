import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { useUi } from './provider';

const sizes = {
    sm: { link: 'gap-sm text-lg', logo: 'h-5 w-auto' },
    md: { link: 'gap-sm px-md pt-xs text-xl', logo: 'h-6 w-auto' },
    lg: { link: 'flex-col gap-md text-5xl', logo: 'h-16 w-auto' },
};

type Props = {
    name: string;
    logo: (className: string) => ReactNode;
    href: string;
    size: keyof typeof sizes;
    className?: string;
};

export function Brand(props: Props) {
    const { link: Link } = useUi();
    const size = sizes[props.size];

    return (
        <Link
            href={props.href}
            className={cn(
                'flex items-center font-bold text-primary-text',
                size.link,
                props.className,
            )}
        >
            {props.logo(size.logo)}
            {props.name}
        </Link>
    );
}
