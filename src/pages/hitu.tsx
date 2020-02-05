import React from 'react';
import HiTu, { HiTuRefObject } from '@ant-design/hitu';
import {
  Common_Primary_Plant01,
  Common_Primary_BarChart02,
  Background_Primary_Atom,
} from '@ant-design/hitu-assets';

export default () => {
  const [selectName, setSelectName] = React.useState<string>();
  const [preSelectName, setPreSelectName] = React.useState<string>();
  const hituRef = React.useRef<HiTuRefObject>(null);

  return (
    <div>
      <HiTu
        width={1000}
        height={500}
        ref={hituRef}
        style={{ border: '1px solid red', width: 1000, height: 500 }}
        // defaultPlay={true}
        frames={1000}
        shapes={[
          {
            type: 'shape',
            source: Common_Primary_Plant01,
            scaleX: 0.2,
            scaleY: 0.2,
            x: 200,
            y: 150,
            name: 'plant',
          },
          {
            type: 'shape',
            source: Common_Primary_BarChart02,
            scaleX: 0.2,
            scaleY: 0.2,
            rotate: 30,
            x: 500,
            y: 200,
            name: 'chart',
            // frames: [
            //   { frame: 0, rotate: 0, scaleX: 0.2, scaleY: 0.2, x: 500, y: 200, },
            //   { frame: 500, rotate: 90, scaleX: 0.2, scaleY: 0.2, x: 500, y: 200, },
            //   { frame: 1000, rotate: 180, scaleX: 0.2, scaleY: 0.2, x: 500, y: 200, }
            // ]
          },
          {
            type: 'shape',
            source: Background_Primary_Atom,
            scaleX: 0.1,
            scaleY: 0.1,
            opacity: 0.5,
            x: 800,
            y: 400,
            name: 'atom',
          },
        ]}
        shapeRender={(element, shape, frameInfo) => {
          const clone = React.cloneElement(element, {
            style: {
              cursor: 'pointer',
            },
            onClick: () => {
              setSelectName(shape.name);
            },
            onMouseEnter: () => {
              setPreSelectName(shape.name);
            },
            onMouseLeave: () => {
              setPreSelectName('');
            }
          });

          let selectionEle: React.ReactElement = (<></>);
          if (selectName === shape.name) {
            const {
              width: shapeWidth = 0,
              height: shapeHeight = 0,
            } = shape.source as any;
            const {
              x,
              y,
              originX,
              originY,
              scaleX,
              scaleY,
              rotate,
            } = frameInfo;
            const centerX = shapeWidth * originX;
            const centerY = shapeHeight * originY;

            // Follow one is a simple wrapper example
            selectionEle = (
              <g transform={`translate(${x - centerX}, ${y - centerY})`}>
                {/* Center scale */}
                <g
                  transform={`matrix(${scaleX}, 0, 0, ${scaleY}, ${centerX -
                    scaleX * centerX}, ${centerY - scaleY * centerY})`}
                >
                  {/* Center Rotate */}
                  <g transform={`rotate(${rotate}, ${centerX}, ${centerY})`}>
                    <rect
                      x="0"
                      y="0"
                      width={shapeWidth}
                      height={shapeHeight}
                      stroke="red"
                      fill="transparent"
                    />
                  </g>
                </g>
              </g>
            );

            return (
              <g key={element.key + ''}>
                {selectionEle}
                {clone}
              </g>
            )
          }
          if (preSelectName === shape.name) {
            const {
              width: shapeWidth = 0,
              height: shapeHeight = 0,
            } = shape.source as any;
            const {
              x,
              y,
              originX,
              originY,
              scaleX,
              scaleY,
              rotate,
            } = frameInfo;
            const centerX = shapeWidth * originX;
            const centerY = shapeHeight * originY;

            // Follow one is a simple wrapper example
            selectionEle = (
              <g transform={`translate(${x - centerX}, ${y - centerY})`}>
                {/* Center scale */}
                <g
                  transform={`matrix(${scaleX}, 0, 0, ${scaleY}, ${centerX -
                    scaleX * centerX}, ${centerY - scaleY * centerY})`}
                >
                  {/* Center Rotate */}
                  <g transform={`rotate(${rotate}, ${centerX}, ${centerY})`}>
                    <rect
                      x="0"
                      y="0"
                      width={shapeWidth}
                      height={shapeHeight}
                      stroke="blue"
                      fill="transparent"
                    />
                  </g>
                </g>
              </g>
            );

            return (
              <g key={element.key + ''}>
                {selectionEle}
                {clone}
              </g>
            )
          }
          return clone
        }}
      />
    </div>
  )
}