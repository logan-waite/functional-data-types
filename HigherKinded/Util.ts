import { curry } from "../Utils/index.ts";

export const map = curry((fn, functor) => functor.map(fn));
