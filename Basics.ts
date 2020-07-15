export function pipe(...fns) {
  return function (...args) {
    return fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0];
  };
}

export function tap(fn) {
  return function (value) {
    fn(value);
    return value;
  };
}

export function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    } else {
      return fn.call(null, ...args);
    }
  };
}
