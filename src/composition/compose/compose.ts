import { First, Last, VariadicFunction } from '../../types';

type LastFunctionParamType<Fn extends Array<VariadicFunction>> =
    Parameters<Last<Fn>>;

type FirstFunctionReturnType<Fn extends Array<VariadicFunction>> =
    ReturnType<First<Fn>>;

type Compose<
    StepFunctions extends [...Array<VariadicFunction>, VariadicFunction],
    Length extends number = StepFunctions['length']
> =
    Length extends 1
    ? StepFunctions
    : StepFunctions extends [...infer Rest, infer Outer, infer Inner]
    ? [
        ...Compose<
            Inner extends VariadicFunction
            ? Outer extends VariadicFunction
            ? Rest extends Array<VariadicFunction>
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
    <ComposeFunctions extends [...Array<VariadicFunction>, VariadicFunction]>
        (...functions: Compose<ComposeFunctions>) =>
        (...input: LastFunctionParamType<ComposeFunctions>): FirstFunctionReturnType<ComposeFunctions> => {
            let len = functions.length - 1;
            let result = functions[len--](...input);

            for (let i = len; i >= 0; i -= 1) {
                result = functions[i](result);
            }

            return result;
        };

export default compose;