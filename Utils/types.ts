type Tail<T extends any[]> = ((...t: T) => any) extends
  ((_: any, ...tail: infer TT) => any) ? TT
  : [];

type Length<T extends any[]> = T["length"];

type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends
  ((...args: infer U) => any) ? U
  : T;

type Drop<N extends number, T extends any[], I extends any[] = []> = {
  0: Drop<N, Tail<T>, Prepend<any, I>>;
  1: T;
}[
  Length<I> extends N ? 1
    : 0
];

type Cast<X, Y> = X extends Y ? X : Y;

// export type Curry<P extends any[], R> = <T extends any[]>(
//   ...args: Cast<T, Partial<P>>
// ) => Drop<Length<T>, P> extends [any, ...any[]]
//   ? Curry<Cast<Drop<Length<T>, P>, any[]>, R>
//   : R;
export type Curry<F extends ((...args: any) => any)> = <T extends any[]>(
  ...args: Cast<Cast<T, Partial<Parameters<F>>>, any[]>
) => Drop<T, Parameters<F>> extends [any, ...any[]]
  ? Curry<(...args: Cast<Drop<T, Parameters<F>>, any[]>) => ReturnType<F>>
  : ReturnType<F>;

declare function curry<F extends (...args: any) => any>(f: F): Curry<F>;
