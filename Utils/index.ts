export const add = (a: number) => (b: number): number => a + b;

export const flip = curry((fn, a, b) => fn(b, a));

export const concat = curry((a, b) => a.concat(b));

export const append = flip(concat);

export const toString = String;

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

export const map = curry((f, functor) => functor.map(f));

// from https://mostly-adequate.gitbooks.io/mostly-adequate-guide/appendix_a.html#inspect
export const inspect = (x) => {
  if (x && typeof x.inspect === "function") {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t) {
    switch (typeof t) {
      case "string":
        return `'${t}'`;
      case "object": {
        const ts = Object.keys(t).map((k) => [k, inspect(t[k])]);
        return `{${ts.map((kv) => kv.join(": ")).join(", ")}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args) {
    return Array.isArray(args)
      ? `[${args.map(inspect).join(", ")}]`
      : inspectTerm(args);
  }

  return (typeof x === "function") ? inspectFn(x) : inspectArgs(x);
};
