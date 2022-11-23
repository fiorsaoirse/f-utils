export type UnaryFunction = (a: any) => any;
export type VariadicFunction = (...a: any[]) => any;

export type UnaryFunctionParameter<F extends UnaryFunction> = Parameters<F>[0];


