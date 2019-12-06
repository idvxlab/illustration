enum Tween {
  EaseIn,
  Linear,
  EaseOut
  // ...
}

interface Keyframe {
  target: SVGElement,
  from: Status,
  to: Status,
  tween: Tween
}

interface Status {
  transform?: string,
  fill?: string,
  stroke?: string,
  fillOpacity?: number,
  strokeOpacity?: number,
  x?: number,
  y?: number,
  width?: number,
  height?: number
}

interface Operation {

}