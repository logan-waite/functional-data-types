interface Functor {
  static of: (x) => Functor;
}

export class Result implements Functor {
  protected _value;

  static of(x) {
    return new Ok(x);
  }

  protected constructor(x) {
    this._value = x;
  }

  public inspect() {
    return this._value;
  }
}

export class Ok extends Result {
  map(fn) {
    return Result.of(fn(this._value));
  }
}

export class Err extends Result {
  map(fn) {
    return this;
  }
}
