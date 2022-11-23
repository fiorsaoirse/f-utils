import { compose } from '../src';

describe('Checking function composition', () => {
    it('Simple compose with the same type fns', () => {
        const fn1 = (value: string): string => `fn1(${value})`;
        const fn2 = (value: string): string => `fn2(${value})`;
        const fn3 = (value: string): string => `fn3(${value})`;

        const value = 'input';
        const result = fn1(fn2(fn3(value)));

        const composition = compose(fn1, fn2, fn3);
        expect(composition(value)).toBe(result);
    });

    it('Compose with multiple-types fns', () => {
        const fn1 = (value: string): number => value.length;
        const fn2 = (value: number): string => {
            return [...new Array(value)].map(() => 'foo').join('-');
        };
        const fn3 = (value: string): string => `fn3(${value})`;

        const value = 'hey';
        const result = fn3(fn2(fn1(value)));

        const composition = compose(fn3, fn2, fn1);
        expect(composition(value)).toBe(result);
    });

    it('Compose with multiple-types fns with multiple params', () => {
        const fn1 = (value: string, count: number): string => value.repeat(count);
        const fn2 = (value: string): Array<string> => value.split('');
        const fn3 = (value: Array<string>): [number, Array<string>] => [value.length, value.reverse()];
        const fn4 = (value: [number, Array<string>]): Array<string> => {
            const [num, arr] = value;
            for (let i = 0; i < num; i += 1) {
                arr[i] = arr[i] + num;
            }

            return arr;
        };
        const fn5 = (value: Array<string>): string => value.join(':');

        const input = 'hello';
        const count = 3;

        const composition = compose(fn5, fn4, fn3, fn2, fn1);
        const result = fn5(fn4(fn3(fn2(fn1(input, count)))));

        expect(composition(input, count)).toBe(result);
    });

    it('Compose some string transform functions', () => {

        const trace = <Input>(msg: string) => (value: Input): Input => {
            console.log(msg, value);
            return value;
        };

        const map = <Input, Output>(transform: (s: Input) => Output) =>
            (values: Array<Input>) => values.map(transform);

        const filter = <Input>(predicate: (s: Input) => boolean) =>
            (values: Array<Input>) => values.filter(predicate);

        const toLowerCase = (str: string): string => str.toLowerCase();
        const onlyLongTitle = (str: string[]): boolean => str.length > 3;
        const split = (separator: string) => (value: string) => value.split(separator);
        const join = (separator: string) => (values: Array<string>) => values.join(separator);

        const composed = compose(
            trace('after all'),
            map(join('-')),
            filter(onlyLongTitle),
            map(split(' ')),
            map(toLowerCase)
        );

        const bookTitles = [
            "JavaScript The Good Parts",
            "You Don't Know JS",
            "Eloquent JavaScript"
        ];

        const processedBookTitles = [
            "javascript-the-good-parts",
            "you-don't-know-js"
        ];

        expect(composed(bookTitles)).toEqual(processedBookTitles);
    });
});