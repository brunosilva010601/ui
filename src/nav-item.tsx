import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from './lib/utils';
import { useUi } from './provider';

const navItemClass =
    "flex w-full cursor-pointer items-center gap-3 rounded border border-transparent px-(--row-inset) py-2.5 text-left text-sm text-foreground-muted transition-colors select-none hover:bg-foreground/5 hover:text-foreground active:bg-foreground/5 active:text-foreground aria-[current=page]:bg-foreground/5 aria-[current=page]:text-foreground data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5";

type Props = Omit<ComponentProps<'button'>, 'type' | 'onClick'> & {
    active?: boolean;
    href?: string;
    asChild?: boolean;
    onClick?: () => void;
    children: ReactNode;
};

export function NavItem(props: Props) {
    const { active, href, asChild, className, children, ...rest } = props;
    const { link: Link } = useUi();
    const current = active ? ('page' as const) : undefined;
    const classes = cn(navItemClass, className);

    if (asChild) {
        return (
            <Slot aria-current={current} className={classes} {...rest}>
                {children}
            </Slot>
        );
    }

    if (href !== undefined) {
        return (
            <Link
                href={href}
                aria-current={current}
                title={rest.title}
                onClick={rest.onClick}
                className={classes}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type="button"
            aria-current={current}
            className={classes}
            {...rest}
        >
            {children}
        </button>
    );
}
