import * as d3 from 'd3';

export default function canZoom(d3Svg, activeD3Group, handler) {
  d3Svg.call(d3.zoom().on('zoom', () => {
    activeD3Group.attr('transform', d3.event.transform);
  }));
}