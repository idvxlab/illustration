import { select, drag, event } from 'd3';
import { transform } from 'd3-transform';
import { parseSvg } from "d3-interpolate/src/transform/parse";

const dragResize = (g) => {
  // function dragStarted() {}
  function dragging() {
    // let circle1 = select(this);
    let circle2 = g.selectAll('circle[data-role=handler-bl]');
    let { x: x1, y: y1 } = this.getBoundingClientRect();
    let { width, height } = this.getBBox();
    let { x: x0, y: y0 } = circle2.node().getBoundingClientRect();
    let { scaleX, scaleY } = parseSvg(g.attr('transform'));
    let { x: x2, y: y2 } = event;
    // let tf = transform()
    // let position = circle.attr('data-role').replace('handler-', '');
    // console.log('position: ', position);
    let s = (scaleX * (x2 - x0)) / (x1 - x0);
    // console.log(s)
    g.attr('transform', transform().scale(s))

  }
  return drag().on('drag', dragging)
  // .on("start", dragStarted)
  // .on('start', null)
}

const resizable = (canResize) => g => {
  // selectable - show handlers 
  g.selectAll('*[data-role^=handler-]').classed('selected', canResize);
  // add drag event
  if (!canResize) {
    g.selectAll('circle[data-role^=handler]').call(drag().on('drag', null));
  } else {
    // g.selectAll('circle[data-role^=handler]').call(dragResize(g))
  }
};

export default resizable;