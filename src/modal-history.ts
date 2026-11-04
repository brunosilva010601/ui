import { useEffect, useRef } from 'react';

const FOCUS_HISTORY = 10;

const FOCUSABLE = 'button, a, input, textarea, select, [tabindex]';

const openModals: (() => void)[] = [];

const recentFocus: Element[] = [];

function rememberFocus(event: Event) {
    const element =
        event.target instanceof Element
            ? event.target.closest(FOCUSABLE)
            : null;

    if (!element) {
        return;
    }

    const index = recentFocus.indexOf(element);

    if (index >= 0) {
        recentFocus.splice(index, 1);
    }

    recentFocus.push(element);

    if (recentFocus.length > FOCUS_HISTORY) {
        recentFocus.shift();
    }
}

export function focusOpener(content: Element | null) {
    const opener = recentFocus.findLast(
        (element) => element.isConnected && !content?.contains(element),
    );

    if (opener instanceof HTMLElement) {
        opener.focus({ preventScroll: true });
    }
}

const backHistory: {
    depth: number;
    skipNext: boolean;
    url: string;
    latest: unknown;
} = { depth: 0, skipNext: false, url: '', latest: null };

function closeOnBack(event: PopStateEvent) {
    if (backHistory.skipNext) {
        backHistory.skipNext = false;
        event.stopImmediatePropagation();
        window.history.replaceState(backHistory.latest, '');

        return;
    }

    if (!backHistory.depth || !openModals.length) {
        return;
    }

    event.stopImmediatePropagation();
    backHistory.depth--;
    const top = openModals[openModals.length - 1];
    top();
    window.setTimeout(() => {
        if (openModals.includes(top)) {
            pushEntry(window.history.state, '');
            backHistory.depth++;
        }
    });
}

export function visitReplacesModalEntry(visit: {
    url: string;
    method: string;
}): boolean {
    if (!backHistory.depth) {
        return false;
    }

    if (visit.method.toLowerCase() !== 'get') {
        return true;
    }

    if (visit.url !== backHistory.url) {
        backHistory.depth = 0;

        return true;
    }

    return false;
}

const pushEntry =
    typeof window !== 'undefined'
        ? window.history.pushState.bind(window.history)
        : () => {};

function replaceModalEntry(
    state: unknown,
    unused: string,
    url?: string | URL | null,
) {
    if (!backHistory.depth) {
        pushEntry(state, unused, url);

        return;
    }

    if (
        url != null &&
        new URL(url, window.location.href).href !== backHistory.url
    ) {
        backHistory.depth = 0;
    }

    window.history.replaceState(state, unused, url);
}

if (typeof window !== 'undefined') {
    window.history.pushState = replaceModalEntry;
    window.addEventListener('popstate', closeOnBack, { capture: true });
    document.addEventListener('focusin', rememberFocus);
    document.addEventListener('pointerdown', rememberFocus, { capture: true });
}

export function useCloseOnBack(
    close: () => void,
    active: boolean,
): () => boolean {
    const latest = useRef(close);
    const own = useRef<(() => void) | null>(null);

    useEffect(() => {
        latest.current = close;
    });

    useEffect(() => {
        if (!active) {
            return;
        }

        const run = () => latest.current();

        openModals.push(run);
        own.current = run;

        if (!backHistory.depth) {
            backHistory.url = window.location.href;
        }

        pushEntry(window.history.state, '');
        backHistory.depth++;

        return () => {
            own.current = null;
            openModals.splice(openModals.indexOf(run), 1);
            window.setTimeout(() => {
                const unused = backHistory.depth - openModals.length;

                if (unused <= 0) {
                    return;
                }

                backHistory.depth -= unused;

                if (window.location.href === backHistory.url) {
                    backHistory.latest = window.history.state;
                    backHistory.skipNext = true;
                    window.history.go(-unused);
                }
            });
        };
    }, [active]);

    return () => own.current !== null && openModals.at(-1) === own.current;
}

export function keepUnlessOnTop(onTop: () => boolean) {
    return (event: Event) => {
        if (!onTop()) {
            event.preventDefault();
        }
    };
}
