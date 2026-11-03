import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { useUi } from './provider';

const sizes = {
    sm: { link: 'gap-2 text-lg', logo: 'h-5 w-auto' },
    md: { link: 'gap-2 px-3 pt-1 text-lg', logo: 'h-6 w-auto' },
    lg: { link: 'flex-col gap-3 text-5xl', logo: 'h-[64px] w-auto' },
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
