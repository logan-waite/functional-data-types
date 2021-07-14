import { inspect } from "../Basics.ts";

export class Result {
  protected _value;

  static of(x) {
    return new Ok(x);
  }

  protected constructor(x) {
    this._value = x;
  }
}

export class Ok extends Result {
  map(fn) {
    return Result.of(fn(this._value));
  }

  inspect() {
    return `Ok(${inspect(this._value)})`;
  }
}

export class Err extends Result {
  constructor(x) {
    super(x);
  }
  map(fn) {
    return this;
  }

  inspect() {
    return `Err(${inspect(this._value)})`;
  }
}

export function error(x) {
  return new Err(x);
}
