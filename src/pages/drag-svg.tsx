import React, { useState, useEffect, useRef } from 'react';
import { DragAsset, DropDustbin } from '../components';
import fetchAssets, { Material } from '../undraw';
import { XYCoord } from 'react-dnd';
import { LayerController } from '../utils';

export default () => {
  const [assets, setAssets] = useState<Material[]>([]);
  let canvas = useRef<SVGSVGElement>(null); // svg container
  let dropEndPosition = useRef<XYCoord>({ x: 0, y: 0 });
  let svgLayer = useRef<LayerController>();

  useEffect(() => {
    fetchAssets().then(data => setAssets(data));
    svgLayer.current = new LayerController(canvas.current!);
  }, []);

  const dragEnd = ({ url }: Material) => {
    let { x: baseX, y: baseY } = canvas.current!.getBoundingClientRect();
    let { x, y } = dropEndPosition.current;
    svgLayer.current!.push(url, [x - baseX, y - baseY])
  };

  const hoverUpdatePos = ({ x, y }: XYCoord) => {
    if (dropEndPosition.current.x !== x && dropEndPosition.current.y !== y) {
      dropEndPosition.current = { x, y };
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 150, marginRight: 20 }}>
        {assets.filter((i, idx) => idx < 4).map((data) =>
          <DragAsset data={data} key={data.id} dragEnd={dragEnd} />
        )}
      </div>
      <div style={{ width: 150, marginRight: 20 }}>
        {assets.filter((i, idx) => idx >= 4).map((data) =>
          <DragAsset data={data} key={data.id} dragEnd={dragEnd} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <DropDustbin hoverUpdatePos={hoverUpdatePos}>
          <svg style={{ width: '100%', height: '100%' }} ref={canvas}></svg>
        </DropDustbin>
        <br />
        <br />
        <p>TODO</p>
        <ul>
          <li>正常显示在页面上的比例逻辑</li>
          <li>这里只有单个 svg 作为一个对象图层的操作，需要进一步和图层操作以及关键帧的操作联系起来</li>
          <li>-- 可以添加一个当前项，可删除</li>
        </ul>
      </div>
    </div>
  )
}