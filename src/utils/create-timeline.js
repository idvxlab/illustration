import * as d3 from 'd3';
import { transform } from 'd3-transform';

const padding = { top: 20, bottom: 10, left: 10, right: 10 };

export default function createTimeline(dom, total = 3000) {
  const width = dom.clientWidth;
  const height = dom.clientHeight;

  let xScale = d3.scaleLinear()
    .domain([0, total])
    .range([padding.left, width - padding.right]);
  let xAxis = d3.axisTop().scale(xScale);

  let svg = d3.select(dom)
    .append('svg')
    .classed('timeline', true)
    .attr('width', width)
    .attr('height', height);

  let g = svg.append('g')
    .attr('transform', `translate(0, ${padding.top})`)
    .call(xAxis);
  let symbol = d3.symbol().size(100)
  svg.append('path')
    .attr('d', symbol.type(d3.symbols[5])())
    .attr('fill', d3.schemePaired[4])
    .attr('transform', `translate(${padding.left}, ${padding.top}) rotate(180)`)
    .style('cursor', 'pointer')
    .call(draggable())

  function draggable() {
    function dragging() {
      let { x } = d3.event;
      let cx = x < padding.left ? padding.left :
        x > width - padding.right ?
          width - padding.right : x;
      d3.select(this).attr('transform', transform().translate([cx, padding.top]).rotate(180))
    }
    return d3.drag().on('drag', dragging)
  }

  return g;
}

// const stroke_color = { active: '#f06', inactive: '#7c7c7c' };

  // define scale for scale x to data
  // let scale = d3.scaleLinear()
  //   .range([0, total])
  //   .domain([padding.left, width - padding.right]);