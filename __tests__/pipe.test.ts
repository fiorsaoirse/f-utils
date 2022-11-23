import { pipe } from '../src';

describe('Pipe function', () => {
    it('Simple pipe with the same type fns', () => {
        const fn1 = (value: string): string => `fn1(${value})`;
        const fn2 = (value: string): string => `fn2(${value})`;
        const fn3 = (value: string): string => `fn3(${value})`;

        const pipeline = pipe(fn1, fn2, fn3);

        const value = 'input';
        expect(pipeline(value)).toBe('fn3(fn2(fn1(input)))');
    });

    it('Pipe with multiple-types fns', () => {
        const fn1 = (value: string): number => value.length;
        const fn2 = (value: number): string => {
            return [...new Array(value)].map(() => 'foo').join('-');
        };
        const fn3 = (value: string): string => `fn3(${value})`;

        const pipeline = pipe(fn1, fn2, fn3);

        const value = 'hey';
        expect(pipeline(value)).toBe('fn3(foo-foo-foo)');
    });

    it('Pipe some string transform functions', () => {
        const map = <Input, Output>(transform: (s: Input) => Output) =>
            (values: Array<Input>) => values.map(transform);

        const filter = <Input>(predicate: (s: Input) => boolean) =>
            (values: Array<Input>) => values.filter(predicate);

        const toLowerCase = (str: string): string => str.toLowerCase();
        const onlyLongTitle = (str: string[]): boolean => str.length > 3;
        const split = (separator: string) => (value: string) => value.split(separator);
        const join = (separator: string) => (values: Array<string>) => values.join(separator);

        const pipeline = pipe(
            map(toLowerCase),
            map(split(' ')),
            filter(onlyLongTitle),
            map(join('-')),
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

        expect(pipeline(bookTitles)).toEqual(processedBookTitles);
    });
});