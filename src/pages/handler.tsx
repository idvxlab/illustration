import React, { useState, useRef, useEffect, createRef, useCallback } from 'react';

import HiTu, { HiTuRefObject, HiTuProps } from '@ant-design/hitu';
import { Common_Primary_BarChart02 } from '@ant-design/hitu-assets';
import { HandlerWrapper, ParamForm } from '../components';
import { Info } from '@ant-design/hitu/es/interface';
import { FormComponentProps } from 'antd/es/form';
import numeral from 'numeral';
import { Button, Slider } from 'antd';

const defaultInfo = {
  x: 200,
  y: 250,
  rotate: 0,
  scaleX: .2,
  scaleY: .2,
  originX: 0.5,
  originY: 0.5,
  opacity: 1
};

export default () => {
  // const formRef = createRef<FormComponentProps>();
  const hituRef = useRef<HiTuRefObject>(null);
  const info = useRef<Required<Info>>(defaultInfo);
  const [rotate, setRotate] = useState<number>(0);
  const [shapes, setShapes] = useState<HiTuProps['shapes']>([{
    type: 'shape',
    source: Common_Primary_BarChart02,
    name: 'chart',
    ...defaultInfo
  }]);

  const setFrameInfo = (i: Required<Info>) => {
    setShapes([{
      type: 'shape',
      source: Common_Primary_BarChart02,
      name: 'chart',
      ...i
    }])
    info.current = i;
  }

  const handleScale = (type: 'horizontal' | 'vertical') => {
    if (info.current) {
      if (type === 'horizontal') setFrameInfo({ ...info.current, scaleX: -info.current.scaleX })
      if (type === 'vertical') setFrameInfo({ ...info.current, scaleY: -info.current.scaleY })
    }
  }

  const handleRotate = (r: number | [number, number]) => {
    if (typeof r === 'number') {
      setRotate(r);
      if (info.current) {
        setFrameInfo({ ...info.current, rotate: r })
      }
    }
  }

  return (
    <div>
      <HiTu
        ref={hituRef}
        width={800}
        height={500}
        style={{ border: '1px solid red', width: 800, height: 500 }}
        shapes={shapes}
        frames={200}
        defaultPlay={false}
        shapeRender={(element, shape, frameInfo) => {
          const {
            width: shapeWidth = 0,
            height: shapeHeight = 0,
          } = shape.source as any;
          return (
            <HandlerWrapper
              key={element.key + ''}
              frameInfo={frameInfo}
              shapeWidth={shapeWidth}
              shapeHeight={shapeHeight}
              setFrameInfo={setFrameInfo}
            >
              {element}
            </HandlerWrapper>
          )
        }}
      />
      {info.current ?
        <div style={{ width: 200, display: 'inline-block', marginLeft: 24 }}>
          <p>x: &emsp; {numeral(info.current.x).format('0.00')}</p>
          <p>y:  &emsp;{numeral(info.current.y).format('0.00')}</p>
          <p>originX:  &emsp;{numeral(info.current.originX).format('0.00')}</p>
          <p>originY:  &emsp;{numeral(info.current.originY).format('0.00')}</p>
          {/* <p>rotate:  &emsp;{info.current.rotate}</p> */}
          <div>rotate: <Slider min={-180} max={180} value={rotate} onChange={handleRotate} /></div>
          <p>scaleX:  &emsp;{numeral(info.current.scaleX).format('0.00')}</p>
          <p>scaleY:  &emsp;{numeral(info.current.scaleY).format('0.00')}</p>
        </div>
        : null}
      {/* <ParamForm wrappedComponentRef={formRef} /> */}
      <div>
        <Button onClick={() => handleScale('horizontal')}>左右翻转</Button>&emsp;
        <Button onClick={() => handleScale('vertical')}>上下翻转</Button>
      </div>
    </div>
  )
}