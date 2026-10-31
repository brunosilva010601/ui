import type { ReactNode } from 'react';
import { cn } from './lib/utils';
import { useUi } from './provider';

const sizes = {
    sm: { link: 'gap-8px text-18px', logo: 'h-20px w-auto' },
    md: { link: 'gap-8px px-12px pt-4px text-18px', logo: 'h-24px w-auto' },
    lg: { link: 'flex-col gap-12px text-48px', logo: 'h-[64px] w-auto' },
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
