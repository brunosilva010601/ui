import { cn } from './lib/utils';
import { tones } from './tones';
import type { Tone } from './tones';

type Props = {
    value: number;
    max: number;
    tone?: Tone;
    linear?: boolean;
    className?: string;
};

export function ProgressBar(props: Props) {
    const percent = props.max
        ? Math.max(0, Math.min(100, (props.value / props.max) * 100))
        : 0;
    const tone = props.tone ?? (percent >= 100 ? 'success' : 'primary');

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={props.max}
            aria-valuenow={props.value}
            className={cn(
                'h-1.5 overflow-hidden rounded-full bg-surface-raised',
                props.className,
            )}
        >
            <div
                className={cn(
                    'h-full rounded-full transition-[width,background-color]',
                    props.linear ? 'duration-300 ease-linear' : 'duration-500',
                    tones[tone].solid,
                )}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}
