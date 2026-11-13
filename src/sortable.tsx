import { GripVertical } from 'lucide-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { HOLD_MS, HOLD_TOLERANCE } from './hold';
import { cn } from './lib/utils';

const SHIFT_MS = 150;
const EDGE_SPEED = 0.25;
const CARRIED_VARIABLES = ['--row-inset', '--row-surface', '--bleed'];

const Organizing = createContext(false);

export const sortItemClass = 'data-[lifted]:invisible';

export const foldClass = 'in-data-[folding]:hidden';

export const sectionDropClass = 'group/drop';

export const bandDropClass =
    'rounded transition-colors group-data-[drop-over]/drop:bg-primary/10';

const dropZoneClass =
    'rounded transition-colors data-[drop-over]:bg-primary/10';

const liftedClass =
    'pointer-events-none fixed z-50 overflow-clip rounded bg-[var(--row-surface,var(--color-surface))] shadow-floating';

const slotClass =
    'pointer-events-none absolute z-40 rounded border-2 border-dashed border-primary/40';

export type SortMove = {
    id: string;
    from: string;
    to: string;
    ids: string[];
};

type Place = {
    zone: HTMLElement;
    key: string;
    list: HTMLElement | null;
};

type Box = {
    top: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
};

type Carry = {
    event: PointerEvent;
    dragged: HTMLElement;
    fold?: boolean;
    placeAt: (element: Element | null) => Place | null;
    drop: (place: Place, ids: string[]) => void;
};

function sortables(container: HTMLElement): HTMLElement[] {
    return [...container.children].filter(
        (element): element is HTMLElement =>
            element instanceof HTMLElement &&
            element.dataset.sortId !== undefined,
    );
}

function idOf(item: HTMLElement): string {
    return item.dataset.sortId ?? '';
}

function natural(element: HTMLElement): Box {
    const box = element.getBoundingClientRect();
    const transform = getComputedStyle(element).transform;
    const shift =
        transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
    const top = box.top - shift;

    return {
        top,
        bottom: top + box.height,
        left: box.left,
        width: box.width,
        height: box.height,
    };
}

function indexAt(items: HTMLElement[], y: number): number {
    return items.filter((item) => {
        const box = natural(item);

        return box.top + box.height / 2 < y;
    }).length;
}

function gapOf(list: HTMLElement, items: HTMLElement[]): number {
    if (items.length > 1) {
        return Math.max(0, natural(items[1]).top - natural(items[0]).bottom);
    }

    const box =
        getComputedStyle(list).display === 'contents'
            ? list.parentElement
            : list;

    return box ? parseFloat(getComputedStyle(box).rowGap) || 0 : 0;
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

function whenHeld(event: PointerEvent, begin: () => void) {
    event.stopPropagation();

    if (event.pointerType !== 'touch') {
        event.preventDefault();
        begin();

        return;
    }

    let timer = 0;

    const stop = () => {
        window.clearTimeout(timer);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', stop);
        window.removeEventListener('pointercancel', stop);
    };

    const onMove = (move: PointerEvent) => {
        if (
            Math.hypot(
                move.clientX - event.clientX,
                move.clientY - event.clientY,
            ) > HOLD_TOLERANCE
        ) {
            stop();
        }
    };

    timer = window.setTimeout(() => {
        stop();
        begin();
    }, HOLD_MS);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
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

function lift(dragged: HTMLElement, top: number, fold: boolean): HTMLElement {
    const box = dragged.getBoundingClientRect();
    const face =
        dragged
            .querySelector<HTMLElement>('[data-sort-face]')
            ?.getBoundingClientRect() ?? box;
    const style = getComputedStyle(dragged);
    const lifted = document.createElement('div');
    const copy = dragged.cloneNode(true) as HTMLElement;

    copy.removeAttribute('data-sort-id');
    copy.removeAttribute('data-sort-list');
    copy.style.margin = `0 0 0 ${box.left - face.left}px`;
    copy.style.width = `${box.width}px`;
    copy.style.listStyle = 'none';
    lifted.setAttribute('aria-hidden', 'true');
    lifted.className = liftedClass;
    lifted.style.left = `${face.left}px`;
    lifted.style.top = `${top}px`;
    lifted.style.width = `${face.width}px`;
    CARRIED_VARIABLES.forEach((name) =>
        lifted.style.setProperty(name, style.getPropertyValue(name)),
    );

    if (fold) {
        lifted.dataset.folding = '';
    }

    lifted.append(copy);
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

function carry(setup: Carry) {
    const { event, dragged } = setup;
    const home = dragged.parentElement as HTMLElement;
    const homePlace: Place = {
        zone: home,
        key: home.dataset.sortList ?? '',
        list: home,
    };
    const slot = document.createElement('div');
    let lifted: HTMLElement | null = null;
    let items: HTMLElement[] = [];
    let from = 0;
    let top = 0;
    let height = 0;
    let size = 0;
    let pointer = { x: event.clientX, y: event.clientY };
    let place = homePlace;
    let index = 0;
    let moved = new Set<HTMLElement>();
    const spaced = new Map<HTMLElement, { inline: string; base: number }>();
    let lit: HTMLElement[] = [];
    let frame = 0;

    slot.className = slotClass;
    slot.hidden = true;

    const elementAt = (x: number, y: number) =>
        document
            .elementsFromPoint(x, y)
            .find((element) => !lifted?.contains(element)) ?? null;

    const light = (zones: HTMLElement[]) => {
        lit.forEach((zone) => delete zone.dataset.dropOver);
        zones.forEach((zone) => (zone.dataset.dropOver = ''));
        lit = zones;
    };

    const shift = (others: HTMLElement[]) => {
        const shifts = new Map<HTMLElement, number>();

        if (place.list === home) {
            items.forEach((item, position) => {
                shifts.set(item, shiftOf(position, from, index, size));
            });
        } else {
            items.slice(from + 1).forEach((item) => shifts.set(item, -size));

            if (place.list) {
                const room = height + gapOf(place.list, others);

                others.slice(index).forEach((item) => shifts.set(item, room));
            }
        }

        new Set([...moved, ...shifts.keys()]).forEach((item) => {
            const amount = shifts.get(item) ?? 0;

            item.style.transition = `transform ${SHIFT_MS}ms`;
            item.style.transform = amount ? `translateY(${amount}px)` : '';
        });
        moved = new Set([...moved, ...shifts.keys()]);
    };

    const space = (others: HTMLElement[]) => {
        const room = new Map<HTMLElement, number>();

        if (place.list !== home) {
            room.set(home, -size);

            if (place.list) {
                room.set(place.list, height + gapOf(place.list, others));
            }
        }

        spaced.forEach((margin, list) => {
            list.style.marginBottom = `${margin.base + (room.get(list) ?? 0)}px`;
        });

        room.forEach((amount, list) => {
            if (spaced.has(list)) {
                return;
            }

            spaced.set(list, {
                inline: list.style.marginBottom,
                base: parseFloat(getComputedStyle(list).marginBottom) || 0,
            });
            list.style.transition = `margin-bottom ${SHIFT_MS}ms`;
            list.style.marginBottom = `${(spaced.get(list)?.base ?? 0) + amount}px`;
        });
    };

    const slotBox = (others: HTMLElement[]): Box | null => {
        if (!place.list) {
            return null;
        }

        if (place.list === home) {
            const own = natural(dragged);
            const slotTop =
                index > from
                    ? natural(items[index]).bottom - height
                    : index < from
                      ? natural(items[index]).top
                      : own.top;

            return { ...own, top: slotTop, bottom: slotTop + height, height };
        }

        const next = others[index];
        const last = others[others.length - 1];
        const reference = natural(next ?? last);
        const slotTop = next
            ? reference.top
            : reference.bottom + gapOf(place.list, others);

        return { ...reference, top: slotTop, bottom: slotTop + height, height };
    };

    const placeSlot = (others: HTMLElement[]) => {
        const box = slotBox(others);

        if (!box) {
            slot.hidden = true;

            return;
        }

        slot.style.transition = slot.hidden
            ? 'none'
            : `top ${SHIFT_MS}ms, left ${SHIFT_MS}ms, width ${SHIFT_MS}ms`;
        slot.hidden = false;
        slot.style.top = `${box.top + window.scrollY}px`;
        slot.style.left = `${box.left + window.scrollX}px`;
        slot.style.width = `${box.width}px`;
        slot.style.height = `${box.height}px`;
    };

    const update = () => {
        if (!lifted) {
            return;
        }

        const dx = pointer.x - event.clientX;
        const dy = pointer.y - event.clientY;
        const found = setup.placeAt(elementAt(pointer.x, pointer.y));

        place = found ?? (place.list ? place : homePlace);

        const others = place.list
            ? sortables(place.list).filter((item) => item !== dragged)
            : [];

        index = place.list ? indexAt(others, top + dy + height / 2) : 0;
        shift(others);
        space(others);
        placeSlot(others);
        light(place.list === home ? [] : zonesOf(place.zone, place.key));
        lifted.style.transform = place.list
            ? `translate(${dx}px, ${dy}px)`
            : `translate(${dx}px, ${place.zone.getBoundingClientRect().bottom - top}px)`;
    };

    const scroll = () => {
        const step = edgeStep(pointer.y, height);

        if (step !== 0) {
            window.scrollBy(0, step);
        }

        frame = requestAnimationFrame(scroll);
    };

    const pickUp = () => {
        if (lifted) {
            return;
        }

        top = dragged.getBoundingClientRect().top;

        if (setup.fold) {
            home.dataset.folding = '';
        }

        items = sortables(home);
        from = items.indexOf(dragged);
        index = from;
        height = dragged.getBoundingClientRect().height;
        size = height + gapOf(home, items);
        lifted = lift(dragged, top, setup.fold ?? false);
        dragged.dataset.lifted = '';
        document.body.append(slot);
        frame = requestAnimationFrame(scroll);
    };

    const onPointerMove = (move: PointerEvent) => {
        pointer = { x: move.clientX, y: move.clientY };
        pickUp();
        update();
    };

    const finish = (dropped: boolean) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onCancel);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('scroll', update, true);
        cancelAnimationFrame(frame);
        light([]);
        slot.remove();
        lifted?.remove();
        moved.forEach((item) => {
            item.style.transition = '';
            item.style.transform = '';
        });
        spaced.forEach((margin, list) => {
            list.style.transition = '';
            list.style.marginBottom = margin.inline;
        });
        delete dragged.dataset.lifted;
        delete home.dataset.folding;

        if (!dropped || !lifted || (place.list === home && index === from)) {
            return;
        }

        const ids = place.list
            ? sortables(place.list)
                  .filter((item) => item !== dragged)
                  .map(idOf)
                  .toSpliced(index, 0, idOf(dragged))
            : [idOf(dragged)];

        setup.drop(place, ids);
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

    if (event.pointerType === 'touch') {
        pickUp();
        update();
    }
}

type SortableOptions = {
    onReorder: (ids: string[]) => void;
    onDrop?: (id: string, to: string) => void;
    fold?: boolean;
};

function zoneAt(element: Element | null): Place | null {
    const zone = element?.closest<HTMLElement>('[data-drop-zone]');

    return zone ? { zone, key: zone.dataset.sortList ?? '', list: null } : null;
}

export function useSortable(
    options: SortableOptions,
): (element: HTMLElement | null) => void {
    const latest = useRef(options);
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        latest.current = options;
    });

    useEffect(() => {
        if (!container) {
            return;
        }

        const onDown = (event: PointerEvent) => {
            const dragged = handledItem(event);

            if (!dragged || dragged.parentElement !== container) {
                return;
            }

            whenHeld(event, () =>
                carry({
                    event,
                    dragged,
                    fold: latest.current.fold,
                    placeAt: (element) =>
                        latest.current.onDrop ? zoneAt(element) : null,
                    drop: (place, ids) =>
                        place.list
                            ? latest.current.onReorder(ids)
                            : latest.current.onDrop?.(idOf(dragged), place.key),
                }),
            );
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

function listAt(element: Element | null): Place | null {
    const zone = element?.closest<HTMLElement>('[data-sort-list]');

    if (!zone) {
        return null;
    }

    const key = zone.dataset.sortList ?? '';
    const list = sortables(zone).length > 0 ? zone : innerList(zone, key);

    return { zone, key, list: sortables(list).length > 0 ? list : null };
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

            const from = origin.dataset.sortList ?? '';

            whenHeld(event, () =>
                carry({
                    event,
                    dragged,
                    placeAt: listAt,
                    drop: (place, ids) =>
                        latest.current({
                            id: idOf(dragged),
                            from,
                            to: place.key,
                            ids,
                        }),
                }),
            );
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
    onDrop?: (id: string, to: string) => void;
    children: ReactNode;
};

export function Sortable(props: SortableProps) {
    const ref = useSortable({
        onReorder: props.onReorder,
        onDrop: props.onDrop,
        fold: true,
    });

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
            data-drop-zone
            className={cn(dropZoneClass, props.className)}
        >
            {props.children}
        </div>
    );
}

function holdScroll(handle: HTMLElement | null) {
    if (!handle) {
        return;
    }

    const onTouchMove = (event: TouchEvent) => {
        if (handle.closest('[data-sort-id]')?.matches('[data-lifted]')) {
            event.preventDefault();
        }
    };

    handle.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => handle.removeEventListener('touchmove', onTouchMove);
}

function keepMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
}

export function SortHandle() {
    const organizing = useContext(Organizing);

    return (
        <span
            ref={holdScroll}
            data-sort-handle
            aria-hidden
            onContextMenu={keepMenu}
            className={cn(
                'absolute inset-y-0 left-0 z-10 cursor-grab items-center text-foreground-faint select-none [-webkit-touch-callout:none] active:cursor-grabbing',
                organizing
                    ? 'right-0 flex'
                    : 'hidden w-(--row-inset) touch-none [@media(hover:hover)]:group-hover/sort:flex',
            )}
        >
            {!organizing && (
                <span className="flex w-(--row-inset) justify-center">
                    <GripVertical className="size-3.5" />
                </span>
            )}
        </span>
    );
}

export function useOrganizing(): boolean {
    return useContext(Organizing);
}

export function SortGrip(props: { className?: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                'flex size-10 shrink-0 items-center justify-center text-foreground-muted',
                props.className,
            )}
        >
            <GripVertical className="size-5" />
        </span>
    );
}
