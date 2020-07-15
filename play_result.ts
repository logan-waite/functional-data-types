import { Ok, extract, map, Err, extractString } from "./Result.ts";

const okNum = Ok(10);

const mappedError = extract(
  (err) => err,
  map((a) => a + 1, Err("this is a string")),
);
const mappedOk = extract((err) => err, map((a) => a + 1, okNum));

function isReasonableAge(input) {
  const age = parseInt(input);
  if (Number.isNaN(age)) {
    return Err("That is not a number!");
  } else {
    if (age < 0) {
      return Err("Please try again after you are born.");
    } else if (age > 135) {
      return Err("Are you some kind of turtle?");
    } else {
      return Ok(age);
    }
  }
}

const age1 = isReasonableAge("abc");
const age2 = extractString(isReasonableAge("-13"));
const age3 = isReasonableAge("24");
const age4 = extractString(isReasonableAge("150"));

console.log({
  age1: age1(
    (ok) => ok,
    (err) => err,
  ),
  age3: age3(
    (ok) => ok,
    (err) => err,
  ),
});

console.log({ mappedError, mappedOk });
console.log({ age1, age2, age3, age4 });
