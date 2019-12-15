import * as d3 from 'd3';
import { isEmpty, ROTATE_ANCHOR, parseSvg, getMatrix, dragPath } from './';

const color = {
  box: '#999',
  rotate: d3.schemePaired[1],
  position: d3.schemePaired[4],
  scale: d3.schemeCategory10[4],
}
let reg = /^x(\d.*)y(\d.*)$/;

const transform_origin = { x: 0, y: 0 };

const position = {
  bottom_center: 'bottom-center',
  right_center: 'right-center',
  top_center: 'top-center',
  left_center: 'left-center',
  top_left: 'top-left',
  top_right: 'top-right',
  bottom_left: 'bottom-left',
  bottom_right: 'bottom-right',
}

export const getAnchor = (el, type) => {
  let rotate = el.attr(type);
  if (!rotate) return transform_origin;
  let [, x, y] = rotate.match(reg);
  if (isNaN(x) || isNaN(y)) return transform_origin;
  return { x, y };
};

export default function selected(svgDom, id) {
  let root = d3.select(svgDom).select('svg>g');

  // get handler group and remove children
  // can optimize
  let handler = root.select("#handler");
  if (!id) {
    handler.remove();
    return;
  }
  if (!isEmpty(handler)) handler.remove();
  handler = root.append('g').attr('id', 'handler').attr('data-for', id);

  // clone select element path
  let selectPath = [];
  let leaf = root.select('#' + id);
  let current = leaf.node();   // pointer
  let leafIsGroup = current.tagName === 'g';

  while (current !== root.node()) {
    selectPath.unshift(current);
    current = current.parentNode;
  }
  current = handler;
  for (let i = 0; i < selectPath.length - 1; i++) {
    let transform = d3.select(selectPath[i]).attr('transform');
    current = current.append('g').attr('transform', transform);
  }
  let wrapper = current;
  // leaf node 
  if (leafIsGroup) {
    let transform = leaf.attr('transform');
    wrapper = current.append('g').attr('transform', transform);
  }


  let { width, height, x, y } = leaf.node().getBBox();

  wrapper
    // .style('cursor', 'move')
    .call(dragMove(leaf));

  // outer line
  wrapper.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', x)
    .attr('y', y)
    .attr('stroke', color.box)
    .attr('stroke-width', 2)
    .attr('fill', 'transparent');

  // rotate anchor
  let symbol = d3.symbol().size(240);
  wrapper.append('path')
    .attr('transform', () => {
      let { x, y } = getAnchor(leaf, ROTATE_ANCHOR);
      return `translate(${x}, ${y})`
    })
    .attr("d", symbol.type(d3.symbols[1])())
    .attr('fill', color.rotate)
    .call(dragAnchor(leaf, ROTATE_ANCHOR))

  wrapper.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.bottom_center))

  wrapper.append('circle')
    .attr('cx', width)
    .attr('cy', height / 2)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.right_center))

  wrapper.append('circle')
    .attr('cx', width / 2)
    .attr('cy', 0)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.top_center))

  wrapper.append('circle')
    .attr('cx', 0)
    .attr('cy', height / 2)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.left_center))

  wrapper.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.top_left))

  wrapper.append('circle')
    .attr('cx', width)
    .attr('cy', 0)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.top_right))

  wrapper.append('circle')
    .attr('cx', 0)
    .attr('cy', height)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.bottom_left))

  wrapper.append('circle')
    .attr('cx', width)
    .attr('cy', height)
    .attr('r', 5)
    .attr('fill', color.scale)
    .call(dragScale(leaf, wrapper, position.bottom_right))
};

function dragAnchor(target, type) {
  function dragged() {
    let { x, y } = d3.event;
    d3.select(this)
      .raise()  // display current node at the top
      .attr('transform', `translate(${x}, ${y})`)
  }

  function dragEnded() {
    let { translateX: x, translateY: y } = parseSvg(d3.select(this).attr('transform'));
    target.attr(type, `x${x}y${y}`);
  }

  return d3.drag().on("drag", dragged).on("end", dragEnded);
};

function dragMove(target) {
  let diff = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  let dragLine;
  function dragStarted() {
    let transform = d3.select(this).attr('transform');
    let { e: tx, f: ty } = getMatrix(transform);
    let { x, y } = d3.event;
    diff.x = x - tx;
    diff.y = y - ty;
    start.x = tx;
    start.y = ty;
    dragLine = d3.select(this).append('line')
  }
  function dragged() {
    let transform = d3.select(this).attr('transform');
    let { a, b, c, d, e: tx, f: ty } = getMatrix(transform);
    let { x, y } = d3.event;
    let { x: ax, y: ay } = getAnchor(target, ROTATE_ANCHOR);
    d3.select(this).attr('transform', `matrix(${a} ${b} ${c} ${d} ${x - diff.x} ${y - diff.y})`);
    target.attr('transform', `matrix(${a} ${b} ${c} ${d} ${x - diff.x} ${y - diff.y})`);
    if (dragLine) {
      let x0 = a > 0 ? -(tx - start.x - ax) : (tx - start.x - ax);
      let y0 = d > 0 ? -(ty - start.y - ay) : (ty - start.y - ay);
      dragLine
        .attr('x1', x0).attr('y1', y0)
        .attr('x2', ax).attr('y2', ay)
        .attr('class', 'move-path')
    }
  }
  function dragEnded() {
    let { x: ax, y: ay } = getAnchor(target, ROTATE_ANCHOR);
    let transform = d3.select(this).attr('transform');
    let { a, d, e: tx, f: ty } = getMatrix(transform);
    if (dragLine) dragLine.remove();
    let x0 = a > 0 ? (tx - start.x - ax) : -(tx - start.x - ax);
    let y0 = d > 0 ? (ty - start.y - ay) : -(ty - start.y - ay);
    let x = ax, y = ay;
    let cpx1 = (x - x0) / 3, cpy1 = (y - y0) / 3;
    let cpx2 = (x - x0) * 2 / 3, cpy2 = (y - y0) * 2 / 3;
    let path = d3.path();
    path.moveTo(-x0, -y0);
    path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
    d3.select(this)
      .append('path')
      .attr('d', path)
      .attr('data-role', 'move-path')
      .attr('class', 'move-path');
    // let points = [[-x0, -y0], [cpx1, cpy1], [cpx2, cpy2], [x, y]];
    // let lines = [[points[0], points[1]], [points[2], points[3]]];
    // const draw = () => {
    //   const path = d3.path();
    //   path.moveTo(...points[0]);
    //   path.bezierCurveTo(...points[1], ...points[2], ...points[3]);
    //   return path;
    // };
    // dragPath(d3.select(this).node(), points, lines, draw);
  }
  return d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded)
}

function dragScale(target, handler, circle) {
  let init = { sx: 1, sy: 1, h: 1, ty: 0 };
  function dragStarted() {
    let transform = target.attr('transform');
    let { width: w, height: h } = target.node().getBBox();
    let { a: sx, d: sy, e: tx, f: ty } = getMatrix(transform);
    let { x, y } = d3.event;

    init.w = w * sx;
    init.h = h * sy;
    init.tx = tx;
    init.ty = ty;

    switch (circle) {
      case position.bottom_center:
        init.sy = sy / y;
        break;
      case position.right_center:
        init.sx = sx / x;
        break;
      case position.top_center:
        init.sy = 1 / h;
        break;
      case position.left_center:
        init.sx = 1 / w;
        break;
      case position.top_left:
        init.sx = 1 / w;
        init.sy = 1 / h;
        break;
      case position.top_right:
        init.sy = 1 / h;
        init.sx = sx / x;
        break;
      case position.bottom_left:
        init.sx = 1 / w;
        init.sy = sy / y;
        break;
      case position.bottom_right:
        init.sy = sy / y;
        init.sx = sx / x;
        break;
      default: ;
    }
  }
  function dragged() {
    let transform = target.attr('transform');
    let { a, b, c, d, e, f } = getMatrix(transform);
    let { x, y } = d3.event;
    // TODO scale y less then 0
    // if (init.h < 0) y = -y;
    switch (circle) {
      case position.bottom_center:
        d = init.sy * y;
        break;
      case position.right_center:
        a = init.sx * x;
        break;
      case position.top_center:
        d = init.sy * (init.h - y);
        f = init.ty + y;
        break;
      case position.left_center:
        if (init.w < 0) x = -x;
        a = init.sx * (init.w - x);
        e = init.tx + x;
        break;
      case position.top_left:
        if (init.w < 0) x = -x;
        a = init.sx * (init.w - x);
        d = init.sy * (init.h - y);
        e = init.tx + x;
        f = init.ty + y;
        break;
      case position.top_right:
        a = init.sx * x;
        d = init.sy * (init.h - y);
        f = init.ty + y;
        break;
      case position.bottom_left:
        if (init.w < 0) x = -x;
        a = init.sx * (init.w - x);
        d = init.sy * y;
        e = init.tx + x;
        break;
      case position.bottom_right:
        a = init.sx * x;
        d = init.sy * y;
        break;
      default: ;
    }
    this.attr('transform', `matrix(${a} ${b} ${c} ${d} ${e} ${f})`);
  }
  return d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged.bind(target))
    .on("end", dragged.bind(handler));
}