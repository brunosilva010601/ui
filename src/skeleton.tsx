import { cn } from './lib/utils';

const shapes = {
    fill: '',
    line: 'h-12px rounded-full',
    title: 'h-16px rounded-full',
    avatar: 'size-40px shrink-0 rounded-full',
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
            className="flex items-center gap-12px rounded border border-border bg-surface px-(--row-inset) py-12px"
        >
            <Skeleton shape="avatar" />
            <Skeleton shape="title" className="w-1/3" />
        </div>
    );
}
