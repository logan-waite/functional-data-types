import { pipe, tap, curry } from "../Basics.ts";
import * as Result from "./Result2.ts";

const add = (a) => (b) => a + b;
const multiply = (a) => (b) => a * b;
const subtract = (a) => (b) => b - a;
const divideBy = (a) => (b) => b / a;

// identity = map(id) === id
const identity1 = Result.of(5).map((val) => val);
const identity2 = Result.of(5);

console.log(identity1.inspect());
console.log(identity2.inspect());
