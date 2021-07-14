import * as Result from "./Lambda/Result/index.ts";
import { pipe } from "./Utils/index.ts";

console.log("\nROUND 1: Naive implementations\n");
// UNION TYPE RESULT
type Result<T> = Error | T;

function add1(a: number, b: number): Result<number> {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return new Error("Ops");
  } else {
    return a + b;
  }
}

let errorVal = add1(5, NaN);
let goodVal = add1(5, 7);

if (errorVal instanceof Error) {
  console.log({ message: errorVal.message, stack: errorVal.stack });
} else {
  console.log({ errorVal });
}

if (goodVal instanceof Error) {
  console.log({ message: goodVal.message, stack: goodVal.stack });
} else {
  console.log({ goodVal });
}

// Thoughts:
// Type is cleaner and easier to write
// Requires an if statement to extract values
//    (unless written as a function, which might not be worth it anyway)

// -------------------------------
// FUNCTIONAL RESULT
function add2(a: number, b: number): Result.Result<Error, number> {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Result.Err(new Error("Ops"));
  } else {
    return Result.Ok(a + b);
  }
}

const errVal = add2(5, NaN);
const okVal = add2(5, 7);

errVal(
  (err) => console.log({ err: err.message }),
  (ok) => console.log({ ok }),
);

okVal(
  (err) => console.log({ err }),
  (ok) => console.log({ ok }),
);

// Thoughts:
// Don't have default Error object
//    At the same time though, we aren't limited to it.
//    Though we could probably do a similar thing with the union type
// Don't have to parse an if statement, can just see what happens with
//    an Err vs an Ok value
// Makes error handling explicit: in order to extract the value, you must handle the error
//    can't forget to and find it where you aren't expecting it later.

// Round 1 thoughts:
// Having to return an `Error` seems restrictive, though possibly doesn't need to be.
// Functional result is slightly more concise, and more declarative, but the Union Type
//    would be more familiar, and so easier to understand? (at least until one gets
//    familiar with the other)

// =========================================
console.log("\nROUND 2: Unique Errors\n");

// UNION TYPE RESULT
type Result2<E, A> = E | A;

class AddErrorClass {
  constructor(public args?, public message?) {}
}

function add3(a: number, b: number): Result2<AddErrorClass, number> {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return new AddErrorClass(
      { a, b },
      "at least one of these arguments was NaN",
    );
  } else {
    return a + b;
  }
}

let errorVal2 = add3(5, NaN);
let goodVal2 = add3(5, 7);

if (errorVal2 instanceof AddErrorClass) {
  console.log({ errorVal2 });
} else {
  console.log({ errorVal2 });
}

if (goodVal2 instanceof Error) {
  console.log({ goodVal2 });
} else {
  console.log({ goodVal2 });
}

// Thoughts:
// Can't just use a type for the error, must create a new class.
// Otherwise basically identical to previous

// -------------------------------
// FUNCTIONAL RESULT
type AddErrorType = { args: { a: number; b: number }; message: string };

function add4(a: number, b: number): Result.Result<AddErrorType, number> {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Result.Err(
      { args: { a, b }, message: "at least one of these arguments was NaN" },
    );
  } else {
    return Result.Ok(a + b);
  }
}

const errVal2 = add4(5, NaN);
const okVal2 = add4(5, 7);

errVal2(
  (err) => console.log({ err }),
  (ok) => console.log({ ok }),
);

okVal2(
  (err) => console.log({ err }),
  (ok) => console.log({ ok }),
);

// Thoughts
// Can just use a type, and type checking still works.

// Round 2 thoughts:
// Both can return different error types with varying amounts of work
// So far, seem pretty similar.

// =========================================
console.log("\nROUND 3: Chaining\n");

// UNION TYPE RESULT
// * setup *
class ParseIntErrorClass {
  constructor(public arg?, public message?) {}
}
const add = (a: number) => (b: number): number => a + b;
function safeAdd1(a: number, b: number): Result2<AddErrorClass, number> {
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return new AddErrorClass(
      { a, b },
      "at least one of these arguments was NaN",
    );
  } else {
    return a + b;
  }
}
function safeParseInt1(str: string): Result2<ParseIntErrorClass, number> {
  const val = parseInt(str);
  return Number.isNaN(val)
    ? new ParseIntErrorClass(str, `${str} is unparseable`)
    : val;
}
// * use *
// parse int ==> safe add ==> normal add ==> result
// happy path 1
let value3: number = 0;
const value1 = safeParseInt1("0");
if (value1 instanceof ParseIntErrorClass) {
  console.log(value1.message);
} else {
  const value2 = safeAdd1(1, value1);
  if (value2 instanceof AddErrorClass) {
    console.log(value2.message);
  } else {
    value3 = add(1)(value2);
  }
}
console.log("is value3 2?: ", { value3 });

// happy path 2
function extractUnion<E, A>(
  errorClass: new () => E,
  fn: (e: E) => A,
  result: Result2<E, A>,
): A {
  if (result instanceof errorClass) {
    return fn(result);
  } else {
    return result as A;
  }
}

const value4 = safeParseInt1("1");

const extractedValue1 = extractUnion(ParseIntErrorClass, (e) => {
  console.log(e.message);
  return 0;
}, value4);

const value5 = safeAdd1(1, extractedValue1);

const extractedValue2 = extractUnion(AddErrorClass, (e) => {
  console.log(e.message);
  return 0;
}, value5);

const value6 = add(1)(extractedValue2);

console.log("is value6 3?: ", { value6 });

// error in safeParseInt (following happy path 1)
let value9: number = 0;
const value7 = safeParseInt1("A");
if (value7 instanceof ParseIntErrorClass) {
  console.log(value7.message);
} else {
  const value8 = safeAdd1(1, value7);
  if (value8 instanceof AddErrorClass) {
    console.log(value8.message);
  } else {
    value9 = add(1)(value8);
  }
}

console.log("what is value9?: ", { value9 });

// error in safeAdd (following happy path 2)
const value10 = safeParseInt1("1");

const extractedValue3 = extractUnion(ParseIntErrorClass, (e) => {
  console.log(e.message);
  return 0;
}, value10);

const value11 = safeAdd1(NaN, extractedValue3);

const extractedValue4 = extractUnion(AddErrorClass, (e) => {
  console.log(e.message);
  return 0;
}, value11);

const value12 = add(1)(extractedValue4);

console.log("what is value12: ", { value12 });

// error in both (happy path 2)
const value13 = safeParseInt1("A");

const extractedValue5 = extractUnion(ParseIntErrorClass, (e) => {
  console.log(e.message);
  return 0;
}, value13);

const value14 = safeAdd1(NaN, extractedValue5);

const extractedValue6 = extractUnion(AddErrorClass, (e) => {
  console.log(e.message);
  return 0;
}, value14);

const value15 = add(1)(extractedValue6);

console.log("what is value15: ", { value15 });
// Thoughts:
// In order to use the result value in another function,
//    you have to extract and make sure it's something useable.
//    So the only options seem to be to have a massive if statement
//    that dies part way through and leaves you with an initial value
//    (which you could check again), or somehow have default values
//    all the way through? I could just be missing something here as well.

// -------------------------------
// FUNCTIONAL RESULT
console.log();
// * setup *
type ParseIntErrorType = { arg: string; message: string };

function safeAdd2(a: number) {
  return function (b: number): Result.Result<AddErrorType, number> {
    if (Number.isNaN(a) || Number.isNaN(b)) {
      return Result.Err(
        { args: { a, b }, message: "at least one of these arguments was NaN" },
      );
    } else {
      return Result.Ok(a + b);
    }
  };
}
function safeParseInt2(str: string): Result.Result<ParseIntErrorType, number> {
  const val = parseInt(str);
  return Number.isNaN(val)
    ? Result.Err({ arg: str, message: `${str} is unparsable` })
    : Result.Ok(val);
}
// Result.chain is a combination of Result.join and Result.map
//    as explained here: https://mostly-adequate.gitbooks.io/mostly-adequate-guide/content/ch09.html#mixing-metaphors

// * use *
// parse int ==> safe add ==> normal add ==> result
// happy path
const val1 = safeParseInt2("0");
const val2 = Result.chain(safeAdd2(1))(val1);
const val3 = Result.map(add(1))(val2);
val3(
  (err) => console.log("did we error?:", err),
  (ok) => console.log("is val3 2?:", ok),
);

// happy path (with pipe)
const val = pipe(
  Result.chain(safeAdd2(1)),
  Result.map(add(1)),
)(safeParseInt2("1"));
val(
  (err) => console.log("did we error?:", err),
  (ok) => console.log("is val 3?:", ok),
);

// error in safeParseInt (following happy path 1)
const val4 = safeParseInt2("A");
const val5 = Result.chain(safeAdd2(1))(val4);
const val6 = Result.map(add(1))(val5);
val6(
  (err) => console.log("where did we error?:", err),
  (ok) => console.log("is val6 2?:", ok),
);

// error in safeAdd (following pipe path)
const errorVal3 = pipe(
  Result.chain(safeAdd2(NaN)),
  Result.map(add(1)),
)(safeParseInt2("1"));
errorVal3(
  (err) => console.log("did we error?:", err),
  (ok) => console.log("is errorVal3 3?:", ok),
);

// error in both (following pipe)
const errorVal4 = pipe(
  Result.chain(safeAdd2(NaN)),
  Result.map(add(1)),
)(safeParseInt2("A"));
errorVal4(
  (err) => console.log("did we error?:", err),
  (ok) => console.log("is errorVal4 3?:", ok),
);

// using extract (we need some kind of usable value at the end)
// This particular case could also use something like Result.withDefault,
// but it is useful for when other stuff needs to happen that isn't just
// returning a new value
const val7 = safeParseInt2("A");
const val8 = Result.chain(safeAdd2(1))(val7);
const val9 = Result.map(add(1))(val8);
const val10 = Result.extract((e) => 0, val9);
console.log("what is this value we absolutely needed?", val10);

// Thoughts
// Much more concise, even given that most of the utility functions are
//    declared outside of this file.
// The way I've implemented Result here means I haven't figured out how to type
//    all the helper functions, so I lose all the useful param guides,
//    but I would imagine it would be easier if this were implemented with the
//    method explained here:
//    https://mostly-adequate.gitbooks.io/mostly-adequate-guide/content/ch08.html#pure-error-handling

// Round 3 thoughts:
// Things are definitely more verbose with the result union type. The need to
//    extract the value every time you use it gets annoying and would probably
//    lead to a lack of use. It's also a lot to parse, even with this relatively
//    simple chain.
// On the flip side, using helper functions whenever you want to play with
//    the value inside of Result.Result could probably get annoying too. I personally
//    don't mind it, and I actually find it nice to know exactly what's going on
//    at each step. I can see how somebody who isn't super familiar with this style
//    might find it verbose in its own way.
// The nice thing about the function result is that a chain will short-circuit when presented
//    with an error. There are times when we want to respond to each individual error, but we
//    can; easily do something like use extract inside the chain to respond, and then return
//    something so the chain doesn't break. Using the result union type does give us more
//    freedom in "breaking" our application in a controlled way (returning from a function, for
//    example). This could be a double edged sword though, as it could lead to patterns that
//    are harder to reason about.
// There totally might be a better way to use the result union type than what I've done here.
//    I feel like Typescript's true power is in helping the developer in front of the compiler,
//    which does make things like typing really easy. However, data structures like Result.Result
//    are actual structures that, while benefitting from typing, are able to do things Typescript
//    cannot, because they exist on the other side of the compiler.
