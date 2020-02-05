export function number2angle(x: number) {
  return 180 * x / Math.PI;
}

export function angle2number(angle: number) {
  return (angle * Math.PI) / 180;
}

export function getScopeAngle(angle: number) {
  if (angle > 0) {
    while (angle > 180) {
      angle -= 180;
    }
  } else {
    while (angle < -180) {
      angle += 180;
    }
  }
  return angle;
}

export function number2angleInScope(x: number) {
  return getScopeAngle(number2angle(x));
}

export function angle2numberInScope(angle: number) {
  return angle2number(getScopeAngle(angle));
}

// export function pythagorean(a: number, b: number) {
//   return Math.sqrt(a * a + b * b);
// }