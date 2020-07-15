export function List(head, tail) {
  return function (destructureNode, _) {
    return destructureNode(head, tail);
  };
}

export function Nil(_, destructureNil) {
  return destructureNil();
}

export function head(list) {
  return list(function (h, _) {
    return h;
  }, function () {
    throw new Error("Empty List has no head");
  });
}

export function tail(list) {
  return list(function (_, t) {
    return t;
  }, function () {
    throw new Error("Empty List has no tail");
  });
}

export function toArray(list) {
  return list(function (head, tail) {
    return [head].concat(toArray(tail));
  }, function () {
    return [];
  });
}

export function fromArray(array: any[]) {
  return array.reduce((list, val) => append(val, list), Nil);
}

export function concat(first, second) {
  return first(function (head, tail) {
    return List(head, concat(tail, second));
  }, function () {
    return second;
  });
}

export function append(val, list) {
  return list(function (head, tail) {
    return List(head, append(val, tail));
  }, function () {
    return List(val, Nil);
  });
}

function reverse(list) {
  return list(function (head, tail) {
    return append(head, reverse(tail));
  }, function () {
    return Nil;
  });
}

export function get(n, list) {
  return list(function (head, tail) {
    if (n === 0) {
      return head;
    } else {
      return get((n - 1), tail);
    }
  }, function () {
    throw new Error("Index requested is outside the bounds of this List");
  });
}

export function update(list, i, val) {
  return list(function (head, tail) {
    if (i === 0) {
      return List(val, tail);
    } else {
      return List(head, update(tail, (i - 1), val));
    }
  }, function () {
    throw new Error("Index requests is outside the bounds of this List");
  });
}
