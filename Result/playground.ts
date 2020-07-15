import { pipe, tap, curry } from "../Basics.ts";
import * as Result from "./Result.ts";

const add = (a) => (b) => a + b;
const multiply = (a) => (b) => a * b;
const subtract = (a) => (b) => b - a;
const divideBy = (a) => (b) => b / a;

function extract(fn) {
  return function (result) {
    return Result.extract(fn, result);
  };
}

// identity = map(id) === id
const identity1 = Result.map((val) => val, Result.Ok(5));
const identity2 = Result.Ok(5);
identity1(
  (ok) => console.log(ok),
  (err) => console.log(err),
);

identity2(
  (ok) => console.log(ok),
  (err) => console.log(err),
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
  (ok) =>
    ok(
      (ok2) =>
        ok2(
          (ok3) => console.log(ok3),
          (err3) => err3,
        ),
      (err2) => err2,
    ),
  (err) => console.log({ err }),
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
  (ok) => console.log(ok),
  (err) => console.log(err),
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
  (ok) => console.log(ok),
  (err) => console.log(err),
);

// applicative functors
const functor = pipe(
  Result.apply(Result.Ok(5)),
  Result.apply(Result.Ok(5)),
)(Result.Ok(add));

functor(
  (ok) => console.log(ok),
  (err) => console.log(err),
);

const funcError = pipe(
  Result.apply(Result.Ok(5)),
  Result.apply(Result.Ok(5)),
)(Result.Err("This is a broken function"));

funcError(
  (ok) => console.log(ok),
  (err) => console.log(err),
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
  (ok) => console.log(ok),
  (err) => console.log(err),
);

secondArgError(
  (ok) => console.log(ok),
  (err) => console.log(err),
);

function waitOneSecond(val) {
  return async function () {
    return await setTimeout(() => val, 1000);
  };
}
console.log(waitOneSecond(6)());
