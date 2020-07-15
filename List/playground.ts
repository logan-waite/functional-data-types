import * as List from "./List.ts";

const list = List.fromArray([1, 2, 3, 4, 5]);
const updatedList = List.update(list, 2, 10);
console.log(List.toArray(updatedList), List.toArray(list));
