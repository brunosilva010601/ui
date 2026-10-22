import { cn } from './lib/utils';

type Props = {
    value: number;
    max: number;
};

export function ProgressBar(props: Props) {
    const percent = props.max
        ? Math.min(100, Math.round((props.value / props.max) * 100))
        : 0;

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={props.max}
            aria-valuenow={props.value}
            className="h-1.5 overflow-hidden rounded-full bg-surface-raised"
        >
            <div
                className={cn(
                    'h-full rounded-full transition-all duration-500',
                    percent >= 100 ? 'bg-success' : 'bg-primary',
                )}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}
