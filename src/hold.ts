import { useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

const HOLD_MS = 500;

const HOLD_TOLERANCE = 8;

export type HoldPointer = 'mouse' | 'touch' | 'pen';

export type HoldHandlers = {
    onPointerDown: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
    onPointerLeave: () => void;
    onContextMenu: (event: MouseEvent) => void;
    onClickCapture: (event: MouseEvent) => void;
};

export function useHold(onHold: (pointer: HoldPointer) => void): HoldHandlers {
    const timer = useRef(0);
    const origin = useRef<{ x: number; y: number } | null>(null);
    const held = useRef(false);
    const pointer = useRef<HoldPointer>('mouse');
    const latest = useRef(onHold);
    latest.current = onHold;

    const cancel = () => {
        window.clearTimeout(timer.current);
        origin.current = null;
    };

    return {
        onPointerDown: (event) => {
            pointer.current = event.pointerType as HoldPointer;
            held.current = false;
            origin.current = { x: event.clientX, y: event.clientY };
            timer.current = window.setTimeout(() => {
                held.current = true;
                origin.current = null;
                latest.current(pointer.current);
            }, HOLD_MS);
        },
        onPointerMove: (event) => {
            if (
                origin.current &&
                Math.hypot(
                    event.clientX - origin.current.x,
                    event.clientY - origin.current.y,
                ) > HOLD_TOLERANCE
            ) {
                cancel();
            }
        },
        onPointerUp: cancel,
        onPointerCancel: cancel,
        onPointerLeave: cancel,
        onContextMenu: (event) => {
            event.preventDefault();

            if (held.current) {
                return;
            }

            cancel();
            latest.current(pointer.current);
        },
        onClickCapture: (event) => {
            if (held.current) {
                held.current = false;
                event.preventDefault();
                event.stopPropagation();
            }
        },
    };
}
