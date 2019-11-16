import React from 'react';

import { useDrag } from 'react-dnd';
import ItemTypes from './item-type';

import styled from 'styled-components';

const AssetsBox = styled.div`
  border: 1px dashed gray;
  cursor: move;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  align-items: center; 
  img{
    width: 100%;
  }
`;

const DragAsset = ({ data, drawing }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.BOX, ...data },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // do something
        drawing(item)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
  })
  const opacity = isDragging ? 0.4 : 1;
  return (
    <AssetsBox ref={drag} style={{ opacity }}>
      <img src={data.url} alt='' key={data.id} />
    </AssetsBox>
  )
}
export default DragAsset;
