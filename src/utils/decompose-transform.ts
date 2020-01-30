const degrees = 180 / Math.PI;

const identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

const default_matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } as DOMMatrix;

function decompose(a: number, b: number, c: number, d: number, e: number, f: number) {
  let scaleX = Math.sqrt(a * a + b * b)
  a /= scaleX;
  b /= scaleX;

  let skewX = a * c + b * d;
  c -= a * skewX
  d -= b * skewX;

  let scaleY = Math.sqrt(c * c + d * d);
  c /= scaleY;
  d /= scaleY;
  skewX /= scaleY;

  if (a * d < b * c) {
    a = -a;
    b = -b;
    skewX = -skewX;
    scaleX = -scaleX;
  }

  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

export function decomposeTransform(value: string) {
  if (value == null) return identity;
  let matrix = getMatrix(value);
  let { a, b, c, d, e, f } = matrix;
  return decompose(a, b, c, d, e, f);
}

export function getMatrix(value: string): DOMMatrix {
  if (value === null) return default_matrix;
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function 
  // returns.
  let svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Set the transform attribute to the provided string value.
  svgNode.setAttribute("transform", value);

  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix. 
  let tf = svgNode.transform.baseVal.consolidate();
  if (tf && tf.matrix) return tf.matrix;
  return default_matrix;
}