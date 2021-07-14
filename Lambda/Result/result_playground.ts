import { pipe, tap, curry } from "../../Utils";
import * as Result from "./Result.ts";

const add = (a: number) => (b: number) => a + b;
const multiply = (a: number) => (b: number) => a * b;
const subtract = (a: number) => (b: number) => b - a;
const divideBy = (a: number) => (b: number) => b / a;

function extract(fn) {
  return function (result) {
    return Result.extract(fn, result);
  };
}

// identity = map(id) === id
const identity1 = Result.map((val) => val)(Result.Ok(5));
const identity2 = Result.Ok(5);
identity1(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

identity2(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

// composition = compose(map(f), map(g)) === map(compose(f,g))
const comp1 = pipe(Result.map(add(1)), Result.map(add(2)));
const comp2 = Result.map(pipe(add(1), add(2)));
console.log(Result.extract((err) => err, comp1(Result.Ok(0))));
console.log(Result.extract((err) => err, comp2(Result.Ok(0))));

// Monads
const safeProp = curry((x, obj) => {
  return Result.Ok(obj[x]);
});

const safeHead = safeProp(0);

const firstAddressStreet = pipe(
  safeProp("addresses"),
  Result.map(safeHead),
  Result.map(Result.map(safeProp("street"))),
);

const result = firstAddressStreet({
  addresses: [{ street: { name: "Mulburry", number: 8402 }, postcode: "WC2N" }],
});

result(
  (err) => console.log({ err }),
  (ok) =>
    ok(
      (err2) => err2,
      (ok2) =>
        ok2(
          (err3) => err3,
          (ok3) => console.log(ok3),
        ),
    ),
);

const firstAddressStreet2 = pipe(
  safeProp("addresses"),
  Result.map(safeHead),
  Result.join,
  Result.map(safeProp("street")),
  Result.join,
);

const result2 = firstAddressStreet2({
  addresses: [{ street: { name: "Mulburry", number: 8402 }, postcode: "WC2N" }],
});

result2(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

const firstAddressStreet3 = pipe(
  safeProp("addresses"),
  Result.chain(safeHead),
  Result.chain(safeProp("street")),
);

const result3 = firstAddressStreet3({
  addresses: [{ street: { name: "Mulburry", number: 8402 }, postcode: "WC2N" }],
});

result3(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

// applicative functors
const functor = pipe(
  Result.apply(Result.Ok(5)),
  Result.apply(Result.Ok(5)),
)(Result.Ok(add));

functor(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

const funcError = pipe(
  Result.apply(Result.Ok(5)),
  Result.apply(Result.Ok(5)),
)(Result.Err("This is a broken function"));

funcError(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

const firstArgError = pipe(
  Result.apply(Result.Err("The first argument is broken")),
  Result.apply(Result.Ok(5)),
)(Result.Ok(add));

const secondArgError = pipe(
  Result.apply(Result.Ok(5)),
  Result.apply(Result.Err("The second argument is broken")),
)(Result.Ok(add));

firstArgError(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

secondArgError(
  (err) => console.log(err),
  (ok) => console.log(ok),
);

// Type test
type TestResult = Result.Result<string, number>;
const testResult: TestResult = Result.Ok(5);

const transformedTest = Result.map(
  pipe(
    add(1),
    subtract(2),
    multiply(3),
    divideBy(4),
  ),
)(testResult);

transformedTest(
  (err) => console.log({ err }),
  (ok) => console.log({ ok }),
);
