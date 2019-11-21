import { select, drag, event } from 'd3';
import { updatePosition } from './import';

const draggable = (canDrag) => {
  if (!canDrag) {
    return drag().on("start", null).on("drag", null)
  }
  // group move by position at beginning
  let diff = { x: 0, y: 0 };
  function dragStarted() {
    let svg = this.parentNode;
    let { x: baseX, y: baseY } = svg.getBoundingClientRect();
    let { x: targetX, y: targetY, width, height } = this.getBoundingClientRect();
    let { x, y } = event;
    diff.x = x - (targetX - baseX + width / 2);
    diff.y = y - (targetY - baseY + height / 2);
  }
  function dragged(d) {
    select(this).call(updatePosition, [event.x - diff.x, event.y - diff.y])
  }

  return drag()
    .on("start", dragStarted)
    .on("drag", dragged)
}

export default draggable;