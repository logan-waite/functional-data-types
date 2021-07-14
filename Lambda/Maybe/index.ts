import { curry } from "https://deno.land/x/ramda/curry.js";

type Maybe<T> = (
  getJust: Just<T>,
  getNothing: Nothing,
) => any;

type Just<T> = (just: T) => unknown;
type Nothing = () => any;

export function Just<T>(value: T): Maybe<T> {
  return function (getJust: Just<T>, _): any {
    return getJust(value);
  };
}

export function Nothing(_: any, getNothing: Nothing): any {
  return getNothing();
}

// map : (a -> b) -> Maybe a -> Maybe b
export const map = curry((fn, maybe) => {
  return maybe(
    (value) => Just(fn(value)),
    () => maybe,
  );
});

const just5 = Just(5);
const just6 = map((n) => n + 1, just5);

// withDefault : a -> Maybe a -> a
export const withDefault = curry(<A>(defaultVal: A, maybe: Maybe<A>): A => {
  return maybe(
    (val) => val,
    () => defaultVal,
  );
});
