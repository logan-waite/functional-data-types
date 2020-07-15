export function Just(value) {
  return function (destructureJust, _) {
    return destructureJust(value);
  };
}

export function Nothing(_, destructureNothing) {
  return destructureNothing();
}

// map : (a -> b) -> Maybe a -> Maybe b
export function map(fn, maybe) {
  return maybe(
    (value, _) => Just(fn(value)),
    () => maybe,
  );
}

export function withDefault(defaultVal, maybe) {
  return maybe(
    (val) => val,
    () => defaultVal,
  );
}
