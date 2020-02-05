import React from 'react';
import DragWrapper from './drag-wrapper';
import { Info } from '@ant-design/hitu/es/interface';
import { angle2number, getScopeAngle, number2angleInScope, angle2numberInScope } from '../utils';

interface Props {
  frameInfo: Required<Info>
  shapeWidth: number
  shapeHeight: number

  setFrameInfo: (info: Required<Info>) => void
}

const HandlerWrapper: React.FC<Props> = (props) => {
  const {
    frameInfo: {
      x,
      y,
      originX,
      originY,
      scaleX,
      scaleY,
      rotate,
    },
    shapeWidth,
    shapeHeight,
    setFrameInfo
  } = props;

  const centerX = shapeWidth * originX;
  const centerY = shapeHeight * originY;

  const dw = shapeWidth * scaleX; // display width
  const dh = shapeHeight * scaleY;  // display height

  const tl = [x - scaleX * centerX, y - scaleY * centerY];  // top left
  const tr = [tl[0] + dw, tl[1]];
  const bl = [tl[0], tl[1] + dh];
  const br = [tl[0] + dw, tl[1] + dh];

  const handleChangePosition = (dx: number, dy: number) => {
    setFrameInfo({ ...props.frameInfo, x: dx, y: dy })
  }

  const handleChangeAnchor = (dx: number, dy: number) => {
    let originX = (dx - tl[0]) / dw;
    let originY = (dy - tl[1]) / dh;
    let line = Math.hypot(dx - x, dy - y); // Math.sqrt(a * a + b * b);
    let ƒ = Math.atan2(dy - y, dx - x);
    let a = ƒ + angle2number(rotate) * Math.sign(scaleX) * Math.sign(scaleY);
    setFrameInfo({
      ...props.frameInfo,
      originX, originY,
      // x: dx, y: dy
      x: x + Math.cos(a) * line, y: y + Math.sin(a) * line
    });
  }

  const handleChangeRotate = (dx: number, dy: number) => {
    let ƒ = Math.atan2(dy - y, dx - x);
    let b = angle2number(rotate);
    setFrameInfo({
      ...props.frameInfo,
      rotate: getScopeAngle(rotate + (ƒ > b ? 1 : -1))
    });
  }

  return (
    <g>
      {props.children}
      <g
        transform={`rotate(${rotate * Math.sign(scaleX) * Math.sign(scaleY)}, ${x}, ${y})`}
      >
        {/* drag to modify rotate */}
        {/* <DragWrapper
          cursor='rotate'
          translateX={x}
          translateY={y}
          onDragging={handleChangeRotate}
        >
          <rect
            x={scaleX > 0 ? tl[0] - 100 : tr[0] + 100}
            y={scaleY > 0 ? tl[1] - 100 : br[1] + 100}
            width={Math.abs(dw) + 200}
            height={Math.abs(dh) + 200}
            fill="#17becf"
            fillOpacity="0.1"
          />
        </DragWrapper> */}
        {/* drag to modify position */}
        <DragWrapper
          cursor='grab'
          translateX={x}
          translateY={y}
          onDragging={handleChangePosition}
        >
          <rect
            x={scaleX > 0 ? tl[0] : tr[0]}
            y={scaleY > 0 ? tl[1] : br[1]}
            width={Math.abs(dw)}
            height={Math.abs(dh)}
            stroke="blue"
            fill="transparent"
          />
        </DragWrapper>
        {/* drag to modify origin (position) */}
        <DragWrapper
          cursor='move'
          translateX={x}
          translateY={y}
          onDragging={handleChangeAnchor}
        >
          <circle cx={x} cy={y} r={10} fill="#f06" />
        </DragWrapper>
        <text x={tl[0]} y={tl[1]}>上左</text>
        <text x={tr[0]} y={tr[1]}>上右</text>
        <text x={bl[0]} y={bl[1]}>下左</text>
        <text x={br[0]} y={br[1]}>下右</text>
      </g>
    </g>
  )
}

export default HandlerWrapper;