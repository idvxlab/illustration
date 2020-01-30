import React from 'react';

import { useDrag } from 'react-dnd';
import ItemTypes from './item-type';
import { Material } from '../undraw';

// import { Material } from '../undraw';

const style = {
  border: '1px dashed gray',
  cursor: 'move',
  marginBottom: 10,
  padding: 10,
  display: 'flex',
  alignItems: 'center'
};

interface DragProps {
  data: Material
  dragEnd: (item: Material) => void
}

const DragAsset: React.FC<DragProps> = ({ data, dragEnd }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.BOX, ...data },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        dragEnd(item as Material)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
  })
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} style={{ ...style, opacity }}>
      <img src={data.url} alt='' key={data.id} style={{ width: '100%' }} />
    </div>
  )
}
export default DragAsset;
