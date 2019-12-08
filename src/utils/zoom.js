import * as d3 from 'd3';

export default function canZoom(d3Svg, activeD3Group, handler) {
  d3Svg.call(d3.zoom().on('zoom', () => {
    // console.log(activeD3Group.attr('transform'))
    // activeD3Group.attr('transform', activeD3Group.attr('transform'));
    activeD3Group.attr('transform', d3.event.transform);
    handler.attr('transform', d3.event.transform);
  }));
}