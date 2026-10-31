import { cn } from './lib/utils';

const sizes = {
    xs: 'size-24px text-12px',
    sm: 'size-32px text-14px',
    md: 'size-40px text-14px',
    lg: 'size-48px text-18px',
};

type Props = {
    name: string;
    src?: string | null;
    size?: keyof typeof sizes;
};

export function Avatar(props: Props) {
    const className = cn(
        'flex shrink-0 items-center justify-center rounded-full border border-primary bg-primary font-semibold text-primary-foreground',
        sizes[props.size ?? 'sm'],
    );

    return props.src ? (
        <img
            src={props.src}
            alt=""
            className={cn(className, 'border-border object-cover')}
        />
    ) : (
        <span aria-hidden className={className}>
            {props.name.charAt(0).toUpperCase()}
        </span>
    );
}
