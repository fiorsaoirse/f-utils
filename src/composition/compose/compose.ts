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
            const lastIndex = functions.length - 1;
            const last = functions.at(lastIndex)!;
            const initial = last.apply(null, input);

            functions.length = lastIndex;

            return functions.reduceRight((current, fn) => fn(current), initial);
        };

export default compose;