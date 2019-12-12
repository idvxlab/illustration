const degrees = 180 / Math.PI;

const identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

const default_matrix = {a:1 , b: 0, c: 0, d: 1, e: 0, f: 0};

function decompose(a, b, c, d, e, f) {
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

export default function parseSvg(value) {
  if (value == null) return identity;
  value = getMatrix(value);
  let {a, b, c, d, e, f} = value;
  return decompose(a, b, c, d, e, f);
}

export function getMatrix(value) {
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
  value = svgNode.transform.baseVal.consolidate();
  if (value && value.matrix) return value.matrix;
  return default_matrix;
}