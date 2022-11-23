import { First, Last, VariadicFunction } from '../../types';

type FirstFunctionParamsType<Fn extends Array<VariadicFunction>> =
    Parameters<First<Fn>>;

type LastFunctionReturnType<Fn extends Array<VariadicFunction>> =
    ReturnType<Last<Fn>>;

type Pipeline<
    StepFunctions extends [VariadicFunction, ...Array<VariadicFunction>],
    Length extends number = StepFunctions['length']
> = Length extends 1
    ? StepFunctions
    : StepFunctions extends [infer Current, infer Next, ...infer RestSteps]
    ? [
        Current,
        ...Pipeline<
            Current extends VariadicFunction
            ? Next extends VariadicFunction
            ? RestSteps extends Array<VariadicFunction>
            ? [(param: ReturnType<Current>) => ReturnType<Next>, ...RestSteps]
            : never
            : never
            : never
        >
    ]
    : StepFunctions
    ;

const pipe =
    <PipelineFunctions extends [VariadicFunction, ...Array<VariadicFunction>]>
        (...functions: Pipeline<PipelineFunctions>) =>
        (...input: FirstFunctionParamsType<PipelineFunctions>): LastFunctionReturnType<PipelineFunctions> => {
            const [first, ...rest] = functions;
            const initial = first.apply(null, input);

            return rest.reduce((current, fn) => fn(current), initial);
        };

export default pipe;

