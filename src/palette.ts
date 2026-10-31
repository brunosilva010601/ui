export const palette = {
    red: {
        text: 'text-red-500',
        stroke: 'stroke-red-500',
        border: 'border-red-500',
        fill: 'bg-red-500 text-white',
    },
    orange: {
        text: 'text-orange-500',
        stroke: 'stroke-orange-500',
        border: 'border-orange-500',
        fill: 'bg-orange-500 text-white',
    },
    amber: {
        text: 'text-amber-500',
        stroke: 'stroke-amber-500',
        border: 'border-amber-500',
        fill: 'bg-amber-500 text-white',
    },
    yellow: {
        text: 'text-yellow-500',
        stroke: 'stroke-yellow-500',
        border: 'border-yellow-500',
        fill: 'bg-yellow-500 text-white',
    },
    lime: {
        text: 'text-lime-500',
        stroke: 'stroke-lime-500',
        border: 'border-lime-500',
        fill: 'bg-lime-500 text-white',
    },
    green: {
        text: 'text-green-500',
        stroke: 'stroke-green-500',
        border: 'border-green-500',
        fill: 'bg-green-500 text-white',
    },
    emerald: {
        text: 'text-emerald-500',
        stroke: 'stroke-emerald-500',
        border: 'border-emerald-500',
        fill: 'bg-emerald-500 text-white',
    },
    teal: {
        text: 'text-teal-500',
        stroke: 'stroke-teal-500',
        border: 'border-teal-500',
        fill: 'bg-teal-500 text-white',
    },
    cyan: {
        text: 'text-cyan-500',
        stroke: 'stroke-cyan-500',
        border: 'border-cyan-500',
        fill: 'bg-cyan-500 text-white',
    },
    sky: {
        text: 'text-sky-500',
        stroke: 'stroke-sky-500',
        border: 'border-sky-500',
        fill: 'bg-sky-500 text-white',
    },
    blue: {
        text: 'text-blue-500',
        stroke: 'stroke-blue-500',
        border: 'border-blue-500',
        fill: 'bg-blue-500 text-white',
    },
    indigo: {
        text: 'text-indigo-500',
        stroke: 'stroke-indigo-500',
        border: 'border-indigo-500',
        fill: 'bg-indigo-500 text-white',
    },
    violet: {
        text: 'text-violet-500',
        stroke: 'stroke-violet-500',
        border: 'border-violet-500',
        fill: 'bg-violet-500 text-white',
    },
    purple: {
        text: 'text-purple-500',
        stroke: 'stroke-purple-500',
        border: 'border-purple-500',
        fill: 'bg-purple-500 text-white',
    },
    fuchsia: {
        text: 'text-fuchsia-500',
        stroke: 'stroke-fuchsia-500',
        border: 'border-fuchsia-500',
        fill: 'bg-fuchsia-500 text-white',
    },
    pink: {
        text: 'text-pink-500',
        stroke: 'stroke-pink-500',
        border: 'border-pink-500',
        fill: 'bg-pink-500 text-white',
    },
    rose: {
        text: 'text-rose-500',
        stroke: 'stroke-rose-500',
        border: 'border-rose-500',
        fill: 'bg-rose-500 text-white',
    },
};

export type PaletteColor = keyof typeof palette;

export const paletteColors = Object.keys(palette) as PaletteColor[];

export function paletteText(color: PaletteColor | null | undefined): string {
    return color ? palette[color].text : 'text-primary-text';
}

export function paletteStroke(color: PaletteColor | null | undefined): string {
    return color ? palette[color].stroke : 'stroke-primary-text';
}

export function paletteBorder(color: PaletteColor | null | undefined): string {
    return color ? palette[color].border : 'border-primary';
}

export function paletteFill(color: PaletteColor | null | undefined): string {
    return color ? palette[color].fill : 'bg-primary text-primary-foreground';
}
