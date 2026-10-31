export const touch =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
