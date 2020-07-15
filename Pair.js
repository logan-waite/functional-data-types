function Pair (left, right) {
  return function (destructurePair) {
    return destructurePair(left, right);
  }
}

function first (pair) {
  return pair(function (first, _) {
    return first
  })
}

function second (pair) {
  return pair(function (_, second) {
    return second
  })
}

const pair = Pair(5, 10);
console.log(first(pair));
