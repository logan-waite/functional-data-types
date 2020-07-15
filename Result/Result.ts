import { pipe, curry } from "../Basics.ts";

export function Ok(val) {
  return function (destructureOk, _) {
    return destructureOk(val);
  };
}

export function Err(error) {
  return function (_, destructureError) {
    return destructureError(error);
  };
}

// extract : (e -> a) -> Result e a -> a
export function extract(convertErr, result) {
  return result(
    (ok, _) => ok,
    (error) => convertErr(error),
  );
}

// map : (a -> b) -> Result x a -> Result x b
export const map = curry((fn, result) => {
  return result(
    (ok) => {
      return Ok(fn(ok));
    },
    (_) => result,
  );
});

// join : Result x (Result x a) -> Result x a
export const join = (result) => {
  return result(
    (ok) => ok,
    (err) => err,
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
    (ok) => map(ok, rVal),
    (_) => rFn,
  );
});
