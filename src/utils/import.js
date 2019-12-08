import * as d3 from 'd3';

export default async function appendSvgAsGroup(filePath, targetD3Svg, center = { x: 0, y: 0 }) {
  let data = await d3.xml(filePath);
  let svg = d3.select(data.documentElement).node();
  let { x, y } = center;
  let g = targetD3Svg.append('g')
    .html(svg.innerHTML)
  let { width, height } = g.node().getBBox();
  g.attr('transform', `translate(${x - width / 2}, ${y - height / 2}) scale(1)`)
  // function zoomed() {
  //   console.log('--')
  //   g.attr("transform", d3.event.transform);
  // }
  // var zoom = d3.zoom()
  //   .scaleExtent([1 / 2, 4])
  //   .on("zoom", zoomed);
  // d3.select(svg).call(zoom);
  // // set initial position via zoom
  // d3.select(svg).call(zoom.transform, d3.zoomIdentity.translate(x - width / 2, y - height / 2));
}