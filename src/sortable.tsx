import { GripVertical } from 'lucide-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const SHIFT_MS = 150;

const Organizing = createContext(false);

export const sortItemClass =
    'data-[dragging]:relative data-[dragging]:z-10 data-[dragging]:shadow-lg';

type Measure = {
    top: number;
    height: number;
};

function sortables(container: HTMLElement): HTMLElement[] {
    return [...container.children].filter(
        (element): element is HTMLElement =>
            element instanceof HTMLElement &&
            element.dataset.sortId !== undefined,
    );
}

function targetIndex(measures: Measure[], from: number, center: number) {
    return measures.filter(
        (measure, index) =>
            index !== from && measure.top + measure.height / 2 < center,
    ).length;
}

function shiftOf(index: number, from: number, to: number, size: number) {
    if (from < to && index > from && index <= to) {
        return -size;
    }

    if (from > to && index < from && index >= to) {
        return size;
    }

    return 0;
}

export function useSortable(
    onReorder: (ids: string[]) => void,
): (element: HTMLElement | null) => void {
    const latest = useRef(onReorder);
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        latest.current = onReorder;
    });

    useEffect(() => {
        if (!container) {
            return;
        }

        const onDown = (event: PointerEvent) => {
            const handle =
                event.target instanceof Element
                    ? event.target.closest('[data-sort-handle]')
                    : null;
            const items = sortables(container);
            const dragged = items.find((item) => handle && item.contains(handle));

            if (!handle || !dragged) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const measures = items.map((item) => {
                const box = item.getBoundingClientRect();

                return { top: box.top, height: box.height };
            });
            const from = items.indexOf(dragged);
            const next = measures[from + 1] ?? measures[from - 1];
            const gap = next
                ? Math.abs(next.top - measures[from].top) -
                  (next.top > measures[from].top
                      ? measures[from].height
                      : next.height)
                : 0;
            const size = measures[from].height + gap;
            let to = from;

            dragged.dataset.dragging = '';
            items.forEach((item) => {
                item.style.transition =
                    item === dragged ? 'none' : `transform ${SHIFT_MS}ms`;
            });

            const onMove = (move: PointerEvent) => {
                const distance = move.clientY - event.clientY;
                const center =
                    measures[from].top + measures[from].height / 2 + distance;

                to = targetIndex(measures, from, center);
                dragged.style.transform = `translateY(${distance}px)`;
                items.forEach((item, index) => {
                    if (item !== dragged) {
                        const shift = shiftOf(index, from, to, size);
                        item.style.transform = shift
                            ? `translateY(${shift}px)`
                            : '';
                    }
                });
            };

            const onEnd = () => {
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onEnd);
                window.removeEventListener('pointercancel', onEnd);
                delete dragged.dataset.dragging;
                items.forEach((item) => {
                    item.style.transition = '';
                    item.style.transform = '';
                });

                if (to === from) {
                    return;
                }

                const ids = items.map((item) => item.dataset.sortId ?? '');
                const [moved] = ids.splice(from, 1);
                ids.splice(to, 0, moved);
                latest.current(ids);
            };

            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onEnd);
            window.addEventListener('pointercancel', onEnd);
        };

        container.addEventListener('pointerdown', onDown);

        return () => container.removeEventListener('pointerdown', onDown);
    }, [container]);

    return setContainer;
}

type SortableProps = {
    organizing?: boolean;
    onReorder: (ids: string[]) => void;
    children: ReactNode;
};

export function Sortable(props: SortableProps) {
    const ref = useSortable(props.onReorder);

    return (
        <Organizing value={props.organizing ?? false}>
            <div ref={ref} className="contents">
                {props.children}
            </div>
        </Organizing>
    );
}

export function SortProvider(props: {
    organizing: boolean;
    children: ReactNode;
}) {
    return <Organizing value={props.organizing}>{props.children}</Organizing>;
}

export function SortHandle() {
    const organizing = useContext(Organizing);

    return (
        <span
            data-sort-handle
            aria-hidden
            className={cn(
                'absolute inset-y-0 left-0 z-10 w-(--row-inset) cursor-grab touch-none items-center justify-center text-foreground-faint active:cursor-grabbing',
                organizing
                    ? 'flex'
                    : 'hidden [@media(hover:hover)]:group-hover/sort:flex',
            )}
        >
            <GripVertical className="size-icon-xs" />
        </span>
    );
}
