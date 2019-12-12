import * as d3 from 'd3';
import { isEmpty, ROTATE_ANCHOR, parseSvg, getMatrix } from './';
// import { transform } from 'd3-transform';

const color = {
  box: d3.schemePaired[5],
  rotate: d3.schemePaired[1],
  position: d3.schemePaired[4],
  scale: d3.schemePaired[0],
}
let reg = /^x(\d.*)y(\d.*)$/;

const transform_origin = { x: 0, y: 0 }

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
  handler = root.append('g').attr('id', 'handler')

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

  wrapper.call(dragMove(leaf));

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
  // .call(dragScale(leaf, 'bottom-center'))
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
  function dragStarted() {
    let transform = d3.select(this).attr('transform');
    let { e: tx, f: ty } = getMatrix(transform);
    let { x, y } = d3.event;
    diff.x = x - tx;
    diff.y = y - ty;
  }
  function dragged() {
    let transform = d3.select(this).attr('transform');
    let { a, b, c, d } = getMatrix(transform);
    let { x, y } = d3.event;
    d3.select(this).attr('transform', `matrix(${a} ${b} ${c} ${d} ${x - diff.x} ${y - diff.y})`);
    target.attr('transform', `matrix(${a} ${b} ${c} ${d} ${x - diff.x} ${y - diff.y})`);
  }
  return d3.drag().on("start", dragStarted).on("drag", dragged)
}

function dragScale(target) {
  // let diff = { x: 0, y: 0 };
  function dragStarted() {
    let transform = d3.select(this).attr('transform');
    let { d: sy } = getMatrix(transform);
    let { x, y } = d3.event;

  }
  function dragged() { }
  return d3.drag().on("start", dragStarted).on("drag", dragged)
}