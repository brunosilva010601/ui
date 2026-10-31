import { cn } from './lib/utils';
import { useUi } from './provider';

const sizes = {
    md: { value: 'text-18px', label: 'text-12px' },
    lg: { value: 'text-24px', label: 'text-14px' },
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
    const className = 'flex flex-col items-center p-12px text-center';
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
