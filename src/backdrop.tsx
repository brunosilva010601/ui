import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './lib/utils';

export const backdropClass = 'bg-overlay backdrop-blur-xs';

type Props = {
    open: boolean;
    onClose: () => void;
    veil?: boolean;
    hole?: HTMLElement | null;
};

function holePath(box: DOMRect, radius: number): string {
    const { left: x, top: y, width: w, height: h } = box;
    const r = Math.min(radius, w / 2, h / 2);
    const arc = `A${r} ${r} 0 0 1`;

    return `path(evenodd, "M0 0H${window.innerWidth}V${window.innerHeight}H0Z M${x + r} ${y}H${x + w - r}${arc} ${x + w} ${y + r}V${y + h - r}${arc} ${x + w - r} ${y + h}H${x + r}${arc} ${x} ${y + h - r}V${y + r}${arc} ${x + r} ${y}Z")`;
}

function useHole(target: HTMLElement | null): string | undefined {
    const [clip, setClip] = useState<string>();

    useLayoutEffect(() => {
        if (!target) {
            setClip(undefined);

            return;
        }

        const update = () =>
            setClip(
                holePath(
                    target.getBoundingClientRect(),
                    parseFloat(getComputedStyle(target).borderTopLeftRadius) ||
                        0,
                ),
            );
        const resize = new ResizeObserver(update);
        update();
        resize.observe(target);
        window.addEventListener('resize', update);

        return () => {
            resize.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [target]);

    return clip;
}

export function Backdrop(props: Props) {
    const [present, setPresent] = useState(props.open);
    const clip = useHole(props.veil && present ? (props.hole ?? null) : null);

    if (props.open && !present) {
        setPresent(true);
    }

    return (
        <>
            {props.open &&
                createPortal(
                    <div
                        className="pointer-events-auto fixed inset-0 z-50"
                        onClick={props.onClose}
                    />,
                    document.body,
                )}
            {props.veil &&
                present &&
                createPortal(
                    <div
                        aria-hidden
                        className={cn(
                            'pointer-events-none fixed inset-0 z-50',
                            backdropClass,
                            props.open ? 'animate-fade-in' : 'animate-fade-out',
                        )}
                        style={clip ? { clipPath: clip } : undefined}
                        onAnimationEnd={() => !props.open && setPresent(false)}
                    />,
                    document.body,
                )}
        </>
    );
}
