import { moment } from "https://deno.land/x/moment/moment.ts";
import { inspect, curry, pipe, map } from "../Basics.ts";
import { add, toString, append, concat } from "../Util.ts";
import { Result, error } from "./Result2.ts";

const getAge = curry((now, user) => {
  console.log({ user });
  const birthDate = moment(user.birthDate, "YYYY-MM-DD");

  return birthDate.isValid()
    ? Result.of(now.diff(birthDate, "years"))
    : error("Birth date could not be parsed");
});

console.log(inspect(getAge(moment(), {
  birthDate: "2005-12-12",
})));

console.log(inspect(getAge(moment(), { birthDate: "July 4, 2001" })));

const fortune = pipe(
  add(1),
  toString,
  concat("If you survive, you will be "),
);
const zoltar = pipe(getAge(moment()), map(fortune), map(console.log));

console.log(inspect(zoltar({ birthDate: "2005-12-12" })));
console.log(inspect(zoltar({ birthDate: "balloons!" })));
