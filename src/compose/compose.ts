import { First, Last, UnaryFunction, UnaryFunctionParameter } from '../types';

type LastFunctionParamType<Fn extends Array<UnaryFunction>> =
    UnaryFunctionParameter<Last<Fn>>;

type FirstFunctionReturnType<Fn extends Array<UnaryFunction>> =
    ReturnType<First<Fn>>;

type Compose<
    StepFunctions extends [...Array<UnaryFunction>, UnaryFunction],
    Length extends number = StepFunctions['length']
> =
    Length extends 1
    ? StepFunctions
    : StepFunctions extends [...infer Rest, infer Outer, infer Inner]
    ? [
        ...Compose<
            Inner extends UnaryFunction
            ? Outer extends UnaryFunction
            ? Rest extends Array<UnaryFunction>
            ? [...Rest, (arg: ReturnType<Inner>) => ReturnType<Outer>]
            : never
            : never
            : never
        >,
        Inner
    ]
    : StepFunctions
    ;

const compose =
    <ComposeFunctions extends [...Array<UnaryFunction>, UnaryFunction]>
        (...functions: Compose<ComposeFunctions>) =>
        (input: LastFunctionParamType<ComposeFunctions>): FirstFunctionReturnType<ComposeFunctions> => {
            let len = functions.length - 1;
            let result = functions[len--](input);

            for (let i = len; i >= 0; i -= 1) {
                result = functions[i](result);
            }

            return result;
        };

export default compose;