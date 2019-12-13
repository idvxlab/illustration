import * as d3 from 'd3';
import { isEmpty } from './';

export default async function appendSvgAsGroup(filePath, root, center = { x: 0, y: 0 }) {
  let data = await d3.xml(filePath);
  let svg = d3.select(data.documentElement).node();
  let { x, y } = center;
  let g = root.append('g').html(svg.innerHTML)
  let { width, height } = g.node().getBBox();
  g.attr('transform', `translate(${x - width / 2}, ${y - height / 2}) scale(1)`);

  // set canvas ratio
  let mask = root.select('rect[data-role=mask]');
  if (isEmpty(mask)) {
    mask = root.insert('rect').attr('data-role', 'mask').lower();
  } else {
    mask.lower();
  }
  let { width: w, height: h, x: x0, y: y0 } = root.node().getBBox();

  // TODO 比例算法待完善
  w = d3.max([w, h]) * 1.2;
  h = w;
  mask
    .attr('x', x0)
    .attr('y', y0)
    .attr('width', w)
    .attr('height', h)
    .attr('fill', '#fff')
    .attr('transform', `translate(${-w * 0.1}, ${-h * 0.1})`)

}