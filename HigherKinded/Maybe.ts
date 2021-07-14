import { inspect, curry } from "../Utils/index.ts";

export class Maybe {
  _value: any;
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this._value === null || this._value === undefined;
  }

  constructor(x) {
    this._value = x;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this._value));
  }

  inspect() {
    return this.isNothing ? "Nothing" : `Just(${inspect(this._value)})`;
  }
}

export const maybe = curry((value, fn, m) => {
  return m.isNothing ? value : fn(m._value);
});
