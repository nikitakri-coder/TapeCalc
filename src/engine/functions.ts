

const cleanTrig = (n: number) => (Math.abs(n) < 1e-12 ? 0 : n);


export const FUNCTIONS = new Map<string, (x: number) => number>([
    ["sqrt", Math.sqrt],
    ["abs", Math.abs],
    ["sin", (x) => cleanTrig(Math.sin(x))],
    ["cos", (x) => cleanTrig(Math.cos(x))],
    ["tan", (x) => cleanTrig(Math.tan(x))],
    ["ln", Math.log],
    ["log", Math.log10],
]);


export const CONSTANTS = new Map<string, number>([
    ["pi", Math.PI],
    ["e", Math.E],
]);