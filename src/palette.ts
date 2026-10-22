export const palette = {
    red: { text: 'text-red-500', stroke: 'stroke-red-500' },
    orange: { text: 'text-orange-500', stroke: 'stroke-orange-500' },
    amber: { text: 'text-amber-500', stroke: 'stroke-amber-500' },
    yellow: { text: 'text-yellow-500', stroke: 'stroke-yellow-500' },
    lime: { text: 'text-lime-500', stroke: 'stroke-lime-500' },
    green: { text: 'text-green-500', stroke: 'stroke-green-500' },
    emerald: { text: 'text-emerald-500', stroke: 'stroke-emerald-500' },
    teal: { text: 'text-teal-500', stroke: 'stroke-teal-500' },
    cyan: { text: 'text-cyan-500', stroke: 'stroke-cyan-500' },
    sky: { text: 'text-sky-500', stroke: 'stroke-sky-500' },
    blue: { text: 'text-blue-500', stroke: 'stroke-blue-500' },
    indigo: { text: 'text-indigo-500', stroke: 'stroke-indigo-500' },
    violet: { text: 'text-violet-500', stroke: 'stroke-violet-500' },
    purple: { text: 'text-purple-500', stroke: 'stroke-purple-500' },
    fuchsia: { text: 'text-fuchsia-500', stroke: 'stroke-fuchsia-500' },
    pink: { text: 'text-pink-500', stroke: 'stroke-pink-500' },
    rose: { text: 'text-rose-500', stroke: 'stroke-rose-500' },
};

export type PaletteColor = keyof typeof palette;

export const paletteColors = Object.keys(palette) as PaletteColor[];

export function paletteText(color: PaletteColor | null | undefined): string {
    return color ? palette[color].text : 'text-primary-text';
}

export function paletteStroke(color: PaletteColor | null | undefined): string {
    return color ? palette[color].stroke : 'stroke-primary-text';
}
