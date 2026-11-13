const VEIL = '[data-veil]:not([data-state="closed"])';

let started = false;
let painting = '';

function resolved(variable: string): string {
    const probe = document.createElement('div');

    probe.style.cssText = `position:absolute;visibility:hidden;background-color:var(${variable})`;
    document.documentElement.append(probe);

    const color = getComputedStyle(probe).backgroundColor;

    probe.remove();

    return color;
}

function painted(layers: string[]): string {
    const canvas = document.createElement('canvas');

    canvas.width = 1;
    canvas.height = 1;

    const context = canvas.getContext('2d');

    if (!context) {
        return layers[0];
    }

    layers.forEach((layer) => {
        context.fillStyle = layer;
        context.fillRect(0, 0, 1, 1);
    });

    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;

    return `#${[red, green, blue].map((part) => part.toString(16).padStart(2, '0')).join('')}`;
}

function meta(): HTMLMetaElement {
    const existing = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
    );

    if (existing) {
        return existing;
    }

    const created = document.createElement('meta');

    created.name = 'theme-color';
    document.head.append(created);

    return created;
}

function paint(): void {
    const root = document.documentElement;
    const veiled = document.querySelector(VEIL) !== null;
    const key = `${root.className}|${root.style.colorScheme}|${veiled}`;

    if (key === painting) {
        return;
    }

    painting = key;

    const layers = [resolved('--color-background')];

    if (veiled) {
        layers.push(resolved('--color-overlay'));
    }

    const color = painted(layers);
    const tag = meta();

    if (tag.content !== color) {
        tag.content = color;
    }
}

export function followThemeColor(): void {
    if (started || typeof window === 'undefined') {
        return;
    }

    started = true;

    let frame = 0;
    const schedule = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(paint);
    };

    new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-appearance'],
    });
    new MutationObserver(schedule).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-state'],
    });
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', schedule);
    paint();
}
