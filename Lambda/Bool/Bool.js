function True (trueValue, _) {
  return trueValue;
}

function False (_, falseValue) {
  return falseValue;
}

function toBoolean (bool) {
  return bool(true, false)
}

function not (bool) {
  return bool(False, True);
}

function and (leftBool, rightBool) {
  return leftBool(rightBool, leftBool);
}

function or (leftBool, rightBool) {
  return leftBool(leftBool, rightBool);
}