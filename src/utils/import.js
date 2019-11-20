import { select, xml, drag, event } from 'd3';
import { transform } from 'd3-transform';

const updatePosition = (g, [cx, cy]) => {
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
    .classed('mask', true);
}

const resize = g => {
  // g.on('click', function () {
  //   select(this).select('.mask').classed('selected', true);
  // })
}

const draggable = () => {
  // group move by position at beginning
  let diff = { x: 0, y: 0 };
  function dragStarted() {
    let svg = this.parentNode;
    let { x: baseX, y: baseY } = svg.getBoundingClientRect();
    let { x: targetX, y: targetY, width, height } = this.getBoundingClientRect();
    let { x, y } = event;
    diff.x = x - (targetX - baseX + width / 2);
    diff.y = y - (targetY - baseY + height / 2);
    select(this).select('.mask').classed('selected', true);
  }
  function dragged(d) {
    select(this).call(updatePosition, [event.x - diff.x, event.y - diff.y])
  }
  function dragEnded(d) {
    diff = { x: 0, y: 0 };
    select(this).select('.mask').classed('selected', false);
  }

  return drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded)
}

export const addAssetToCanvas = (url, draw, [startX, startY]) => {
  xml(url).then(data => {
    let svg = select(data.documentElement).node();  // svg dom node
    draw.append('g')
      .html(svg.innerHTML)  // append assets to canvas
      .call(updatePosition, [startX, startY]) // scale and translate to current position
      .call(addMask)  // add mask rect to select and drag
      .call(draggable())  // draggable
      .call(resize)
  })
}