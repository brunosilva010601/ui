import { cn } from './lib/utils';
import { useUi } from './provider';

const sizes = {
    md: { value: 'text-lg', label: 'text-xs' },
    lg: { value: 'text-2xl', label: 'text-sm' },
};

type Props = {
    value: number;
    label: string;
    size?: keyof typeof sizes;
    href?: string;
};

export function Stat(props: Props) {
    const { link: Link } = useUi();
    const size = sizes[props.size ?? 'md'];
    const className = 'flex flex-col items-center p-md text-center';
    const content = (
        <>
            <span className={cn('font-bold tabular-nums', size.value)}>
                {props.value}
            </span>
            <span className={cn('text-foreground-muted', size.label)}>
                {props.label}
            </span>
        </>
    );

    return props.href ? (
        <Link
            href={props.href}
            className={cn(
                className,
                'transition-colors hover:bg-surface-hover active:bg-surface-hover',
            )}
        >
            {content}
        </Link>
    ) : (
        <div className={className}>{content}</div>
    );
}
