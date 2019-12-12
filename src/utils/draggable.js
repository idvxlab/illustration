import * as d3 from 'd3';
import { ROTATE_ANCHOR } from './'
import parseSvg from './';


export default function draggable(targetEl) {

  function dragged() {
    let { x, y } = d3.event;
    d3.select(this)
      .raise()  // display current node at the top
      .attr('transform', `translate(${x}, ${y})`)
  }

  function dragEnded() {
    let { translateX: x, translateY: y } = parseSvg(d3.select(this).attr('transform'));
    targetEl.attr(ROTATE_ANCHOR, `x${x}y${y}`);
  }

  return d3.drag().on("drag", dragged).on("end", dragEnded);
};