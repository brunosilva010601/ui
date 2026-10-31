import { useEffect, useRef } from 'react';
import type { PointerEvent } from 'react';

const CLOSE_DISTANCE = 0.25;

const CLOSE_VELOCITY = 0.5;

const TAP_DISTANCE = 6;

type Motion = {
    start: number;
    last: number;
    time: number;
    speed: number;
};

type Drag = Motion & {
    pointer: number;
    onHandle: boolean;
};

function isWide(): boolean {
    return window.matchMedia('(min-width: 40rem)').matches;
}

function follow(motion: Motion, position: number, time: number) {
    motion.speed = (position - motion.last) / Math.max(time - motion.time, 1);
    motion.last = position;
    motion.time = time;
}

function closes(motion: Motion, height: number): boolean {
    return (
        motion.last - motion.start > height * CLOSE_DISTANCE ||
        motion.speed > CLOSE_VELOCITY
    );
}

function settleIfKept(element: HTMLElement) {
    window.setTimeout(() => {
        if (element.dataset.state === 'open') {
            element.style.transition = '';
            element.style.transform = '';
        }
    });
}

export function useDrawerDrag(close: () => void) {
    const drag = useRef<Drag | null>(null);

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        const target = event.target as Element;

        if (
            isWide() ||
            !event.currentTarget.contains(target) ||
            !target.closest('[data-drawer-drag]') ||
            target.closest('button, a, input, [role=button]')
        ) {
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.transition = 'none';
        drag.current = {
            pointer: event.pointerId,
            start: event.clientY,
            last: event.clientY,
            time: event.timeStamp,
            speed: 0,
            onHandle: Boolean(target.closest('[data-drawer-handle]')),
        };
    };

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const current = drag.current;

        if (!current || current.pointer !== event.pointerId) {
            return;
        }

        follow(current, event.clientY, event.timeStamp);
        event.currentTarget.style.transform = `translateY(${Math.max(event.clientY - current.start, 0)}px)`;
    };

    const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const current = drag.current;

        if (!current || current.pointer !== event.pointerId) {
            return;
        }

        drag.current = null;
        current.last = event.clientY;
        const element = event.currentTarget;
        const tapped =
            current.onHandle &&
            Math.abs(current.last - current.start) < TAP_DISTANCE;

        if (closes(current, element.offsetHeight) || tapped) {
            close();
            settleIfKept(element);

            return;
        }

        element.style.transition = '';
        element.style.transform = '';
    };

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
    };
}

type Pull = Motion & {
    startX: number;
    pulling: boolean;
};

function scrolledAbove(target: EventTarget | null, panel: Element): boolean {
    for (
        let element = target instanceof Element ? target : null;
        element && element !== panel;
        element = element.parentElement
    ) {
        if (element.scrollTop > 0) {
            return true;
        }
    }

    return false;
}

export function usePullToClose(
    element: HTMLDivElement | null,
    active: boolean,
    close: () => void,
) {
    const latest = useRef(close);

    useEffect(() => {
        latest.current = close;
    });

    useEffect(() => {
        if (!active || !element) {
            return;
        }

        let pull: Pull | null = null;

        const reset = () => {
            element.style.transition = '';
            element.style.transform = '';
        };

        const onStart = (event: TouchEvent) => {
            const target = event.target as Element;

            pull =
                event.touches.length === 1 &&
                !isWide() &&
                target.closest('[data-drawer-body]') &&
                !scrolledAbove(target, element)
                    ? {
                          start: event.touches[0].clientY,
                          startX: event.touches[0].clientX,
                          last: event.touches[0].clientY,
                          time: event.timeStamp,
                          speed: 0,
                          pulling: false,
                      }
                    : null;
        };

        const onMove = (event: TouchEvent) => {
            if (!pull) {
                return;
            }

            const touch = event.touches[0];
            const distance = touch.clientY - pull.start;

            if (!pull.pulling) {
                if (
                    distance <= 0 ||
                    Math.abs(touch.clientX - pull.startX) > distance
                ) {
                    pull = null;

                    return;
                }

                pull.pulling = true;
                element.style.transition = 'none';
            }

            event.preventDefault();
            follow(pull, touch.clientY, event.timeStamp);
            element.style.transform = `translateY(${Math.max(distance, 0)}px)`;
        };

        const onEnd = () => {
            const current = pull;
            pull = null;

            if (!current?.pulling) {
                return;
            }

            if (closes(current, element.offsetHeight)) {
                latest.current();
                settleIfKept(element);
            } else {
                reset();
            }
        };

        element.addEventListener('touchstart', onStart, { passive: true });
        element.addEventListener('touchmove', onMove, { passive: false });
        element.addEventListener('touchend', onEnd);
        element.addEventListener('touchcancel', onEnd);

        return () => {
            element.removeEventListener('touchstart', onStart);
            element.removeEventListener('touchmove', onMove);
            element.removeEventListener('touchend', onEnd);
            element.removeEventListener('touchcancel', onEnd);
        };
    }, [element, active]);
}
