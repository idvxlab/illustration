import { select, xml } from 'd3';
import { transform } from 'd3-transform';
import { interpolate } from 'flubber';

function animate(sel) {
  sel
    // .datum({ start: sel.attr('d'), end: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' })
    .transition()
    .duration(1500)
    .attrTween("d", function(d){
      return interpolate(sel.attr('d'),'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', { maxSegmentLength: 0.1 })
    })
    // .on("end", function() {
    //   sel.call(animate);
    // });
}

export const updatePosition = (g, [cx, cy]) => {
  const SCALE = 0.3; // FIXME scale ratio
  let { width, height } = g.node().getBBox();
  let tf = transform()
    .translate([cx - (width / 2) * SCALE, cy - (height / 2) * SCALE])
    .scale(SCALE)
  g.attr('transform', tf);
  g.select('path').call(animate);
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
  // tl
  g.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 10)
    .attr('fill', 'transparent')
    .attr('stroke', 'transparent')
    .attr('data-role', 'handler-tl')
  // tr
  g.append('circle')
    .attr('cx', width)
    .attr('cy', 0)
    .attr('r', 10)
    .attr('fill', 'transparent')
    .attr('stroke', 'transparent')
    .attr('data-role', 'handler-tr')
  // bl
  g.append('circle')
    .attr('cx', 0)
    .attr('cy', height)
    .attr('r', 10)
    .attr('fill', 'transparent')
    .attr('stroke', 'transparent')
    .attr('data-role', 'handler-bl')
  // br
  g.append('circle')
    .attr('cx', width)
    .attr('cy', height)
    .attr('r', 10)
    .attr('fill', 'transparent')
    .attr('stroke', 'transparent')
    .attr('data-role', 'handler-br')
}

const addAssetToCanvas = async (url, draw, [cx, cy]) => {
  let data = await xml(url)
  let svg = select(data.documentElement).node();  // svg dom node
  let g = draw.append('g')
    .html(svg.innerHTML)  // append assets to canvas
    .call(addHandlers)  // add mask rect to select and drag
    .call(updatePosition, [cx, cy]) // scale and translate to current position
  return Promise.resolve(g);
}

export default addAssetToCanvas