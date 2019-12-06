import React from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from './item-type'

const DropDustbin = ({ children, updatePosition }) => {
  // const [{ canDrop, isOver }, drop] = useDrop({
  const [, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({ name: 'Dustbin' }),
    hover: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      updatePosition(clientOffset);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  // const isActive = canDrop && isOver
  return (
    <div ref={drop}>
      {children}
    </div>
  )
}
export default DropDustbin
