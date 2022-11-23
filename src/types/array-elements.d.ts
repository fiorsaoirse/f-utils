export type First<T extends Array<any>> =
    T extends [infer TT, ...any[]]
    ? TT
    : any;

export type Last<T extends Array<any>> =
    T extends [...any[], infer TT]
    ? TT
    : any;