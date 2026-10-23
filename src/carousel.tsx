import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Button } from './button';
import { useEdgeFade } from './lib/edge-fade';
import { cn } from './lib/utils';

const SLIDE_MS = 320;

function slide(element: HTMLElement, left: number, frame: RefObject<number>) {
    cancelAnimationFrame(frame.current);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.scrollLeft = left;

        return;
    }

    const start = element.scrollLeft;
    const began = performance.now();
    element.style.scrollSnapType = 'none';

    const move = (now: number) => {
        const progress = Math.min((now - began) / SLIDE_MS, 1);
        element.scrollLeft = start + (left - start) * (1 - (1 - progress) ** 4);

        if (progress < 1) {
            frame.current = requestAnimationFrame(move);
        } else {
            element.style.scrollSnapType = '';
        }
    };

    frame.current = requestAnimationFrame(move);
}

type CarouselControl = {
    track: (node: HTMLDivElement | null) => void;
    element: HTMLDivElement | null;
    page: (by: number) => void;
};

type CarouselTrackProps = {
    control: CarouselControl;
    className?: string;
    children: ReactNode;
};

export function CarouselTrack(props: CarouselTrackProps) {
    const fade = useEdgeFade(props.control.element);

    return (
        <div
            ref={props.control.track}
            className={cn(
                'relative flex snap-x [scrollbar-width:none] overflow-x-auto *:shrink-0 *:snap-start',
                fade,
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}

export function useCarousel(): CarouselControl {
    const node = useRef<HTMLDivElement>(null);
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const frame = useRef(0);

    const track = useCallback((value: HTMLDivElement | null) => {
        node.current = value;
        setElement(value);
    }, []);

    const page = (by: number) => {
        const element = node.current;

        if (!element) {
            return;
        }

        const end = element.scrollWidth - element.clientWidth;
        const padding =
            parseFloat(getComputedStyle(element).scrollPaddingLeft) || 0;
        const items = [...element.children] as HTMLElement[];

        if (by > 0) {
            const edge = element.scrollLeft + element.clientWidth;
            const next = items.find(
                (item) => item.offsetLeft + item.offsetWidth > edge + 1,
            );
            const target = next ? next.offsetLeft - padding : end;

            slide(
                element,
                element.scrollLeft >= end - 1 ? 0 : Math.min(target, end),
                frame,
            );

            return;
        }

        const start = element.scrollLeft - element.clientWidth;
        const previous = items.find(
            (item) => item.offsetLeft - padding >= start - 1,
        );
        const target = previous ? previous.offsetLeft - padding : 0;

        slide(
            element,
            element.scrollLeft <= 1 ? end : Math.max(target, 0),
            frame,
        );
    };

    return { track, element, page };
}

export function useOverflowing(control: CarouselControl): boolean {
    const [overflowing, setOverflowing] = useState(false);
    const element = control.element;

    useEffect(() => {
        if (!element) {
            return;
        }

        const measure = () =>
            setOverflowing(element.scrollWidth - element.clientWidth > 1);
        const observer = new ResizeObserver(measure);

        measure();
        observer.observe(element);

        return () => {
            observer.disconnect();
            setOverflowing(false);
        };
    }, [element]);

    return overflowing;
}

const arrowClass =
    'absolute top-1/2 z-10 hidden -translate-y-1/2 opacity-0 shadow-lg transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 pointer-fine:inline-flex';

type CarouselFrameProps = {
    control: CarouselControl;
    arrows: boolean;
    children: ReactNode;
};

export function CarouselFrame(props: CarouselFrameProps) {
    const go = (by: number) => props.control.page(by);

    return (
        <div className="group/carousel relative">
            {props.children}
            {props.arrows && (
                <>
                    <Button
                        variant="outline"
                        square
                        className={`${arrowClass} start-2`}
                        onClick={() => go(-1)}
                    >
                        <ArrowLeft />
                    </Button>
                    <Button
                        variant="outline"
                        square
                        className={`${arrowClass} end-2`}
                        onClick={() => go(1)}
                    >
                        <ArrowRight />
                    </Button>
                </>
            )}
        </div>
    );
}
