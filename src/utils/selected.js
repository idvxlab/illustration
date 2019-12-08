import * as d3 from 'd3';
import { draggable, ROTATE_ANCHOR } from './';

const color = d3.schemePaired[5];
let reg = /^x(\d.*)y(\d.*)$/;

export const getRotateAnchor = el => {
  let rotate = el.attr(ROTATE_ANCHOR);
  let { width, height } = el.node().getBBox();
  if (!rotate) return { x: width / 2, y: height / 2 };
  let [, x, y] = rotate.match(reg);
  if (isNaN(x) || isNaN(y)) return { x: width / 2, y: height / 2 };
  return { x, y };
}

function enterFn(id) {
  let el = d3.select(this).select('#' + id);
  let { width, height, x, y } = el.node().getBBox();
  let parent = el.node().parentNode;
  let transform = el.attr('transform');

  let handler = d3.select(parent)
    .append('g')
    .attr('data-role', 'handler')
    .attr('data-for', id)
    .attr('transform', transform);

  handler.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', x)
    .attr('y', y)
    .attr('stroke', color)
    .attr('fill', 'none');

  // TODO 现在先只做选中一个的情况，之后多选需要做其他的操作
  let symbol = d3.symbol().size(240);

  handler.append('path')
    .attr('transform', () => {
      let { x, y } = getRotateAnchor(el);
      return `translate(${x}, ${y})`
    })
    .attr("d", symbol.type(d3.symbols[1])())
    .attr('fill', color)
    .call(draggable(el))
}

function updateFn(svg, id) {
  let el = svg.select('#' + id);
  console.log('el: ', el);
  // let parent = el.node().parentNode;

  let { width, height, x, y } = el.node().getBBox();
  let parent = el.node().parentNode;
  let transform = el.attr('transform');

  // TODO 这里选择的层级有问题
  let handler = d3.select(parent)
    .select('g[data-role=handler]')
    .attr('data-for', id)
    .attr('transform', transform);

  handler.select('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', x)
    .attr('y', y)
    .attr('stroke', color)
    .attr('fill', 'none');

  let symbol = d3.symbol().size(240);

  handler.select('path')
    .attr('transform', () => {
      let { x, y } = getRotateAnchor(el);
      return `translate(${x}, ${y})`
    })
    .attr("d", symbol.type(d3.symbols[1])())
    .attr('fill', color)
    .call(draggable(el))
}

export default function selected(svgDom, selectKeys) {
  let svg = d3.select(svgDom).select('svg');
  svg.selectAll("g[data-role=handler]")
    .data(selectKeys, d => d)
    .join(
      enter => enter.each(enterFn),
      update => update.each(id => updateFn(svg, id)), // !! Must Add
    )
};

// TODO set zoom, first transform to 0:0  
// enter.each(function (id) {
// enterFn.call(this, id);
// let { el, handler } = 
// canZoom(svg, el, handler);
// }),

// .style("fill", "gold")
// .append('circle')
// .attr('cx', width / 2)
// .attr('cy', height / 2)
// .attr('r', 5)
// .attr('fill', 'red')
// .call(draggable)
// return { el, handler };