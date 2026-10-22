import { useEffect, useState } from 'react';
import { cn } from './utils';

type HiddenEdges = 'none' | 'start' | 'end' | 'both';

const fade =
    '[mask-image:linear-gradient(to_right,rgb(0_0_0/var(--fade-start))_0,rgb(0_0_0/var(--fade-start))_0.5rem,black_2rem,black_calc(100%-2rem),rgb(0_0_0/var(--fade-end))_calc(100%-0.5rem),rgb(0_0_0/var(--fade-end))_100%)] transition-[--fade-start,--fade-end] duration-200';

const faded: Record<HiddenEdges, string> = {
    none: '',
    start: '[--fade-start:0]',
    end: '[--fade-end:0]',
    both: '[--fade-start:0] [--fade-end:0]',
};

function hiddenEdges(element: HTMLElement): HiddenEdges {
    const start = element.scrollLeft > 1;
    const end =
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1;

    return start && end ? 'both' : start ? 'start' : end ? 'end' : 'none';
}

export function useEdgeFade(element: HTMLElement | null): string {
    const [edges, setEdges] = useState<HiddenEdges>('none');

    useEffect(() => {
        if (!element) {
            return;
        }

        const update = () => setEdges(hiddenEdges(element));
        const observer = new ResizeObserver(update);

        observer.observe(element);
        element.addEventListener('scroll', update, { passive: true });

        return () => {
            observer.disconnect();
            element.removeEventListener('scroll', update);
        };
    }, [element]);

    return cn(fade, faded[edges]);
}
