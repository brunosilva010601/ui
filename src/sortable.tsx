import { GripVertical } from 'lucide-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from './lib/utils';

const SHIFT_MS = 150;
const EDGE_SPEED = 0.25;
const CARRIED_VARIABLES = ['--row-inset', '--row-surface', '--bleed'];

const Organizing = createContext(false);

export const sortItemClass =
    'data-[dragging]:relative data-[dragging]:z-10 data-[dragging]:shadow-floating data-[lifted]:opacity-40';

export const sectionDropClass = 'group/drop';

export const bandDropClass =
    'rounded transition-colors group-data-[drop-over]/drop:bg-primary/10';

const dropZoneClass =
    'rounded transition-colors data-[drop-over]:bg-primary/10';

const liftedClass =
    'pointer-events-none fixed z-50 m-0 list-none overflow-clip rounded shadow-floating';

const lineClass =
    'pointer-events-none fixed z-50 h-0.5 rounded-full bg-primary';

export type SortMove = {
    id: string;
    from: string;
    to: string;
    ids: string[];
};

type Measure = {
    top: number;
    height: number;
};

type Target = {
    zone: HTMLElement;
    key: string;
    list: HTMLElement;
    index: number | null;
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

function handledItem(event: PointerEvent): HTMLElement | null {
    const handle =
        event.target instanceof Element
            ? event.target.closest('[data-sort-handle]')
            : null;

    return handle?.closest<HTMLElement>('[data-sort-id]') ?? null;
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
            const items = sortables(container);
            const dragged = handledItem(event);

            if (!dragged || !items.includes(dragged)) {
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

function ownList(item: HTMLElement): HTMLElement | null {
    const parent = item.parentElement;

    return parent?.dataset.sortList !== undefined ? parent : null;
}

function innerList(zone: HTMLElement, key: string): HTMLElement {
    return (
        [...zone.querySelectorAll<HTMLElement>('[data-sort-list]')].find(
            (element) => element.dataset.sortList === key,
        ) ?? zone
    );
}

function others(list: HTMLElement, dragged: HTMLElement): HTMLElement[] {
    return sortables(list).filter((item) => item !== dragged);
}

function insertionIndex(items: HTMLElement[], y: number): number {
    return items.filter((item) => {
        const box = item.getBoundingClientRect();

        return box.top + box.height / 2 < y;
    }).length;
}

function targetAt(x: number, y: number, dragged: HTMLElement): Target | null {
    const zone = document
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>('[data-sort-list]');

    if (!zone) {
        return null;
    }

    const key = zone.dataset.sortList ?? '';
    const list = sortables(zone).length > 0 ? zone : innerList(zone, key);
    const items = others(list, dragged);

    if (sortables(list).length === 0) {
        return { zone, key, list, index: null };
    }

    if (list === zone) {
        return { zone, key, list, index: insertionIndex(items, y) };
    }

    const above = y < list.getBoundingClientRect().top;

    return { zone, key, list, index: above ? 0 : items.length };
}

function boundary(items: HTMLElement[], index: number): number {
    const previous = items[index - 1]?.getBoundingClientRect();
    const next = items[index]?.getBoundingClientRect();

    if (previous && next) {
        return (previous.bottom + next.top) / 2;
    }

    return next?.top ?? previous?.bottom ?? 0;
}

function zonesOf(zone: HTMLElement, key: string): HTMLElement[] {
    const zones: HTMLElement[] = [];
    let current: HTMLElement | null = zone;

    while (current) {
        if (current.dataset.sortList === key) {
            zones.push(current);
        }

        current =
            current.parentElement?.closest<HTMLElement>('[data-sort-list]') ??
            null;
    }

    return zones;
}

function lift(dragged: HTMLElement): HTMLElement {
    const box = dragged.getBoundingClientRect();
    const style = getComputedStyle(dragged);
    const lifted = dragged.cloneNode(true) as HTMLElement;

    lifted.removeAttribute('data-sort-id');
    lifted.setAttribute('aria-hidden', 'true');
    lifted.className = liftedClass;
    lifted.style.left = `${box.left}px`;
    lifted.style.top = `${box.top}px`;
    lifted.style.width = `${box.width}px`;
    CARRIED_VARIABLES.forEach((name) =>
        lifted.style.setProperty(name, style.getPropertyValue(name)),
    );
    document.body.append(lifted);

    return lifted;
}

function edgeStep(y: number, edge: number): number {
    const bottom = window.innerHeight - y;

    if (y < edge) {
        return -(edge - y) * EDGE_SPEED;
    }

    return bottom < edge ? (edge - bottom) * EDGE_SPEED : 0;
}

export function useSortScope(
    onMove: (move: SortMove) => void,
): (element: HTMLElement | null) => void {
    const latest = useRef(onMove);
    const [scope, setScope] = useState<HTMLElement | null>(null);

    useEffect(() => {
        latest.current = onMove;
    });

    useEffect(() => {
        if (!scope) {
            return;
        }

        const onDown = (event: PointerEvent) => {
            const dragged = handledItem(event);
            const origin = dragged && ownList(dragged);

            if (!dragged || !origin || !scope.contains(origin)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const id = dragged.dataset.sortId ?? '';
            const from = origin.dataset.sortList ?? '';
            const fromIndex = sortables(origin).indexOf(dragged);
            const start = dragged.getBoundingClientRect();
            const line = document.createElement('div');
            let lifted: HTMLElement | null = null;
            let pointer = { x: event.clientX, y: event.clientY };
            let target: Target | null = null;
            let lit: HTMLElement[] = [];
            let frame = 0;

            line.className = lineClass;
            line.hidden = true;

            const moves = (candidate: Target | null): candidate is Target =>
                candidate !== null &&
                !(candidate.key === from && candidate.index === fromIndex);

            const light = (zones: HTMLElement[]) => {
                lit.forEach((zone) => delete zone.dataset.dropOver);
                zones.forEach((zone) => (zone.dataset.dropOver = ''));
                lit = zones;
            };

            const update = () => {
                if (!lifted) {
                    return;
                }

                target = targetAt(pointer.x, pointer.y, dragged);

                const dx = pointer.x - event.clientX;
                const dy = pointer.y - event.clientY;

                if (!moves(target)) {
                    lifted.style.transform = `translate(${dx}px, ${dy}px)`;
                    light([]);
                    line.hidden = true;

                    return;
                }

                light(zonesOf(target.zone, target.key));
                line.hidden = target.index === null;

                if (target.index === null) {
                    const below =
                        target.zone.getBoundingClientRect().bottom - start.top;
                    lifted.style.transform = `translate(${dx}px, ${below}px)`;

                    return;
                }

                const box = target.list.getBoundingClientRect();
                const y = boundary(others(target.list, dragged), target.index);

                line.style.left = `${box.left}px`;
                line.style.width = `${box.width}px`;
                line.style.top = `${y - line.offsetHeight / 2}px`;
                lifted.style.transform = `translate(${dx}px, ${y + line.offsetHeight / 2 - start.top}px)`;
            };

            const scroll = () => {
                const step = edgeStep(pointer.y, start.height);

                if (step !== 0) {
                    window.scrollBy(0, step);
                }

                frame = requestAnimationFrame(scroll);
            };

            const onPointerMove = (move: PointerEvent) => {
                pointer = { x: move.clientX, y: move.clientY };

                if (!lifted) {
                    lifted = lift(dragged);
                    document.body.append(line);
                    dragged.dataset.lifted = '';
                    frame = requestAnimationFrame(scroll);
                }

                update();
            };

            const finish = (drop: boolean) => {
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onCancel);
                window.removeEventListener('keydown', onKey);
                window.removeEventListener('scroll', update, true);
                cancelAnimationFrame(frame);
                light([]);
                line.remove();
                lifted?.remove();
                delete dragged.dataset.lifted;

                if (!drop || !lifted || !moves(target)) {
                    return;
                }

                const ids =
                    target.index === null
                        ? [id]
                        : others(target.list, dragged)
                              .map((item) => item.dataset.sortId ?? '')
                              .toSpliced(target.index, 0, id);

                latest.current({ id, from, to: target.key, ids });
            };

            const onUp = () => finish(true);
            const onCancel = () => finish(false);
            const onKey = (key: KeyboardEvent) => {
                if (key.key === 'Escape') {
                    finish(false);
                }
            };

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onCancel);
            window.addEventListener('keydown', onKey);
            window.addEventListener('scroll', update, true);
        };

        scope.addEventListener('pointerdown', onDown);

        return () => scope.removeEventListener('pointerdown', onDown);
    }, [scope]);

    return setScope;
}

export function SortProvider(props: {
    organizing?: boolean;
    children: ReactNode;
}) {
    const inherited = useContext(Organizing);

    return (
        <Organizing value={props.organizing ?? inherited}>
            {props.children}
        </Organizing>
    );
}

type SortableProps = {
    organizing?: boolean;
    onReorder: (ids: string[]) => void;
    children: ReactNode;
};

export function Sortable(props: SortableProps) {
    const ref = useSortable(props.onReorder);

    return (
        <SortProvider organizing={props.organizing}>
            <div ref={ref} className="contents">
                {props.children}
            </div>
        </SortProvider>
    );
}

type SortScopeProps = {
    organizing?: boolean;
    onMove: (move: SortMove) => void;
    children: ReactNode;
};

export function SortScope(props: SortScopeProps) {
    const ref = useSortScope(props.onMove);

    return (
        <SortProvider organizing={props.organizing}>
            <div ref={ref} className="contents">
                {props.children}
            </div>
        </SortProvider>
    );
}

type DropZoneProps = {
    id: string;
    className?: string;
    children: ReactNode;
};

export function DropZone(props: DropZoneProps) {
    return (
        <div
            data-sort-list={props.id}
            className={cn(dropZoneClass, props.className)}
        >
            {props.children}
        </div>
    );
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
            <GripVertical className="size-3.5" />
        </span>
    );
}
