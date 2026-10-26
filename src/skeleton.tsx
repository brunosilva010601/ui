import { cn } from './lib/utils';

const shapes = {
    fill: '',
    line: 'h-3 rounded-full',
    title: 'h-4 rounded-full',
    avatar: 'size-10 shrink-0 rounded-full',
};

type Props = {
    shape?: keyof typeof shapes;
    className?: string;
};

export function Skeleton(props: Props) {
    return (
        <div
            className={cn(
                'animate-pulse bg-surface-raised',
                shapes[props.shape ?? 'fill'],
                props.className,
            )}
        />
    );
}

export function SectionSkeleton() {
    return (
        <div
            role="status"
            className={cn(
                'flex items-center gap-md rounded border border-border bg-surface px-(--row-inset) py-md',
            )}
        >
            <Skeleton shape="avatar" />
            <Skeleton shape="title" className="w-1/3" />
        </div>
    );
}
