import { cn } from './lib/utils';
import { paletteText } from './palette';
import type { PaletteColor } from './palette';

type Props = {
    color: PaletteColor | null;
    muted?: boolean;
};

export function ColorDot(props: Props) {
    return (
        <span
            aria-hidden
            className={cn(
                'size-dot shrink-0 rounded-full bg-current',
                props.muted
                    ? 'text-foreground-muted'
                    : paletteText(props.color),
            )}
        />
    );
}
