import { First, Last, UnaryFunction, UnaryFunctionParameter } from '../types';

type FirstFunctionParamType<Fn extends Array<UnaryFunction>> =
    UnaryFunctionParameter<First<Fn>>;

type LastFunctionReturnType<Fn extends Array<UnaryFunction>> =
    ReturnType<Last<Fn>>;

type Pipeline<
    StepFunctions extends [UnaryFunction, ...Array<UnaryFunction>],
    Length extends number = StepFunctions['length']
> = Length extends 1
    ? StepFunctions
    : StepFunctions extends [infer Current, infer Next, ...infer RestSteps]
    ? [
        Current,
        ...Pipeline<
            Current extends UnaryFunction
            ? Next extends UnaryFunction
            ? RestSteps extends Array<UnaryFunction>
            ? [(param: ReturnType<Current>) => ReturnType<Next>, ...RestSteps]
            : never
            : never
            : never
        >
    ]
    : StepFunctions
    ;

const pipe =
    <PipelineFunctions extends [UnaryFunction, ...Array<UnaryFunction>]>
        (...functions: Pipeline<PipelineFunctions>) =>
        (input: FirstFunctionParamType<PipelineFunctions>): LastFunctionReturnType<PipelineFunctions> => {
            const len = functions.length;
            let result = functions[0](input);

            for (let i = 1; i < len; i += 1) {
                result = functions[i](result);
            }

            return result;
        };

export default pipe;

