import * as Maybe from "./Maybe.ts";

const just5 = Maybe.Just(5);
const nothing = Maybe.Nothing;

const num = Maybe.withDefault(0, just5);
const defaulted = Maybe.withDefault(0, nothing);

console.log({ num, defaulted });
