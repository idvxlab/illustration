import { select, xml } from 'd3';
import { transform } from 'd3-transform';

export const updatePosition = (g, [cx, cy]) => {
  const SCALE = 0.3; // FIXME scale ratio
  let { width, height } = g.node().getBBox();
  let tf = transform()
    .translate([cx - (width / 2) * SCALE, cy - (height / 2) * SCALE])
    .scale(SCALE)
  g.attr('transform', tf);
}

const addMask = g => {
  let { width, height } = g.node().getBBox();
  g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    .attr('data-role', 'mask')
}

const addAssetToCanvas = async (url, draw, [cx, cy]) => {
  let data = await xml(url)
  let svg = select(data.documentElement).node();  // svg dom node
  let g = draw.append('g')
    .html(svg.innerHTML)  // append assets to canvas
    .call(addMask)  // add mask rect to select and drag
    .call(updatePosition, [cx, cy]) // scale and translate to current position
  return Promise.resolve(g);
}

export default addAssetToCanvas