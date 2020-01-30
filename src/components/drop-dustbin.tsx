import React from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import ItemTypes from './item-type';

const style = {
  width: '100%',
  height: 500,
  border: '1px solid #f06'
}

// export const updatePosition = (g, [cx, cy], initScale) => {
//   let { width, height } = g.node().getBBox();
//   let { scaleX } = parseSvg(g.attr('transform'));
//   let scale = initScale || scaleX;
//   let tf = transform()
//     .translate([cx - (width / 2) * scale, cy - (height / 2) * scale])
//     .scale(scale)
//   g.attr('transform', tf);
// }

interface DropProps {
  hoverUpdatePos: (xyCoord: XYCoord) => void
}

const DropDustbin: React.FC<DropProps> = ({ children, hoverUpdatePos }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ name: 'Dustbin' }),
    hover: (item, monitor) => {
      const xyCoord = monitor.getClientOffset();
      if (xyCoord) {
        hoverUpdatePos(xyCoord);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  return (
    <div style={style} ref={drop}>{children}</div>
  )
}
export default DropDustbin;
