import { pipe, curry, tap } from "../../Utils/index.ts";

export type Result<E, A> = (
  errFunc: (e: E) => any,
  okFunc: (a: A) => any,
) => any;

export function Ok<E, A>(val: A): Result<E, A> {
  return function (_, destructureOk) {
    return destructureOk(val);
  };
}

export function Err<E, A>(error: E): Result<E, A> {
  return function (destructureError, _) {
    return destructureError(error);
  };
}

// extract : (e -> a) -> Result e a -> a
export function extract<E, A>(
  convertErr: (e: E) => A,
  result: Result<E, A>,
): A {
  return result(
    (error) => convertErr(error),
    (ok) => ok,
  );
}

const extractTest = Ok();

// map : (a -> b) -> Result x a -> Result x b
// export const map = curry(
//   <A, B, X>(fn: (a: A) => B, result: Result<X, A>): Result<X, B> => {
//     return result(
//       (_) => result,
//       (ok) => {
//         return Ok(fn(ok));
//       },
//     );
//   },
// );

export function map<A, B, X>(fn: (a: A) => B) {
  return function (result: Result<X, A>): Result<X, B> {
    return result(
      (_) => result,
      (ok) => {
        return Ok(fn(ok));
      },
    );
  };
}

// join : Result x (Result x a) -> Result x a
export const join = (result) => {
  return result(
    (_) => result,
    (ok) => ok,
  );
};

// chain : (a -> b) -> Result e a -> Result e a
export const chain = (fn) => {
  return pipe(
    map(fn),
    join,
  );
};

// apply : Result e a -> Result e (a -> b) -> Result e b
export const apply = curry((rVal, rFn) => {
  return rFn(
    (_) => rFn,
    (ok) => map(ok)(rVal),
  );
});
