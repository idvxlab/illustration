import { select, xml } from 'd3';
import { transform } from 'd3-transform';
import { parseSvg } from "d3-interpolate/src/transform/parse";

export const updatePosition = (g, [cx, cy], initScale) => {
  let { width, height } = g.node().getBBox();
  let { scaleX } = parseSvg(g.attr('transform'));
  let scale = initScale || scaleX;
  let tf = transform()
    .translate([cx - (width / 2) * scale, cy - (height / 2) * scale])
    .scale(scale)
  g.attr('transform', tf);
}

const addHandlers = g => {
  let { width, height } = g.node().getBBox();
  // mask
  g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    .attr('data-role', 'handler-mask')
}

const addAssetToCanvas = async (url, draw, [cx, cy]) => {
  let data = await xml(url)
  let svg = select(data.documentElement).node();  // svg dom node
  let g = draw.append('g')
    .html(svg.innerHTML)  // append assets to canvas
    .call(addHandlers)  // add mask rect to select and drag
    // TODO dynamic scale of initScale
    .call(updatePosition, [cx, cy], 0.2) // scale and translate to current position
  return Promise.resolve(g);
}

export default addAssetToCanvas