import { select, axisBottom, scaleLinear, event, drag } from 'd3';

const padding = { top: 20, bottom: 5, left: 50, right: 50 };
const stroke_color = { active: '#f06', inactive: '#7c7c7c' };


export function initTimeline(dom, animation, total = 3000) {
  const width = dom.clientWidth;
  const height = dom.clientHeight;

  let xScale = scaleLinear()
    .domain([0, total])
    .range([padding.left, width - padding.right]);
  let xAxis = axisBottom().scale(xScale);

  // define scale for scale x to data
  let scale = scaleLinear()
    .range([0, total])
    .domain([padding.left, width - padding.right]);

  let svg = select(dom)
    .append('svg')
    .classed('timeline', true)
    .attr('width', width)
    .attr('height', height);

  let g = svg.append('g')
    .attr('transform', `translate(0, ${padding.top})`)
    .call(xAxis);

  let label = g.append('text')
    .attr('x', 200)
    .attr('y', 0)
    .attr('dy', -10)
    .text('100')
    .attr('fill', '#444')
    .style('display', 'none');

  svg.on('dblclick', addKeyframe);

  async function addKeyframe() {
    let { offsetX } = event;
    if (offsetX < padding.left || offsetX > width - padding.right) return;
    let id = await animation.addKeyframe(scale(offsetX))
    animation.changeCurrKeyframe(id);

    let circle = g.append('circle')
      .attr('data-id', id)
      .attr('cx', offsetX)
      .attr('cy', 0)
      .attr('r', 5)
      .attr("fill", '#c1c1c1')
      .attr("stroke", stroke_color.inactive)
      .style("stroke-opacity", 1)
      .style("fill-opacity", 0.55)

    selectCircle(circle)

    circle.on('click', selectCircle)
    circle.call(draggable());
  }

  function selectCircle(circle) {
    if (!circle) circle = select(this);
    let id = circle.attr('data-id');
    g.selectAll('circle[data-id]').classed('selected', false);
    circle.classed('selected', true);
    animation.changeCurrKeyframe(id);
  }

  function draggable() {
    function dragStart() {
      select(this).attr("stroke", stroke_color.active);
      let { x } = event;
      label.style('display', 'block').attr('x', x).text(scale(x).toFixed(2));
    }
    function dragging() {
      let { x } = event;
      let cx = x < padding.left ? padding.left :
        x > width - padding.right ?
          width - padding.right : x;
      select(this).attr('cx', cx);
      label.attr('x', cx).text(scale(cx).toFixed(2));
    }
    function dragEnd() {
      let circle = select(this)
      circle.attr("stroke", stroke_color.inactive);
      label.style('display', 'none');
    }
    return drag()
      .on('start', dragStart)
      .on('drag', dragging)
      .on('end', dragEnd);
  }

  return g;
}