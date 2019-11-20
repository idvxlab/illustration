import React, { useEffect, useRef, useState, useCallback } from 'react';
import { List, Icon, Radio, Drawer } from 'antd';

import { SVG } from '@svgdotjs/svg.js';

// components
import DragAsset from '../src/components/drag-asset';
import DropDustbin from '../src/components/drop-dustbin';
import { Wrapper, Handle, AssetsContainer, Timeline } from '../src/components/styled';


import { addAssetToCanvas } from '../src/utils/import';
import fetchAssets from '../src/utils/fetch-assets';

const menuIcons = ['user', 'robot', 'dollar', 'aliwangwang'];

function App() {
  const canvas = useRef(null);
  const [draw, setDraw] = useState(null);
  const [assets, setAssets] = useState([]);
  const [ratio, setRatio] = useState('1:1');
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState([]);
  const [dropEndPosition, setDropEndPosition] = useState({ x: 0, y: 0 });

  // set svg.js instance
  // fetch assets data
  useEffect(() => {
    let drawIns = SVG().addTo(canvas.current).size(600, 400);
    setDraw(drawIns);
    fetchAssets().then(data => setAssets(data));
  }, []);

  // init canvas size
  useEffect(() => {
    const autoSize = () => {
      let height = canvas.current.clientHeight;
      let width = height;
      switch (ratio) {
        case '3:2': width = (height / 2) * 3; break;
        case '4:3': width = (height / 3) * 4; break;
        case '16:9': width = (height / 9) * 16; break;
        default: width = height;
      }
      canvas.current.style.width = width + 'px';
    }
    autoSize();
    window.addEventListener('resize', autoSize);
    return () => {
      window.removeEventListener('resize', autoSize);
    };
  }, [ratio]);

  // drop svg
  const drawing = ({ url, name }) => {
    let { x: baseX, y: baseY } = canvas.current.getBoundingClientRect();
    let { x, y } = dropEndPosition;
    addAssetToCanvas(url, draw, [x - baseX, y - baseY]);
    // add layer
    setLayer([...layer, name]);
  };

  // to get final drag end position
  const updatePosition = useCallback(({ x, y }) => {
    if (dropEndPosition.x !== x && dropEndPosition.y !== y) {
      setDropEndPosition({ x, y });
    }
  }, [dropEndPosition])

  return (
    <Wrapper>
      <div>
        <AssetsContainer>
          <div className='menu'>
            <Icon type='upload' />
            {menuIcons.map(icon => <Icon type={icon} key={icon} />)}
          </div>
          <div className='assets-list'>
            {assets.map((data) => <DragAsset data={data} key={data.id} drawing={drawing} />)}
          </div>
        </AssetsContainer>
        <Handle>
          <header>
            <div><Icon type='undo' />&emsp;<Icon type='redo' /></div>
            <div>
              画布设置 &emsp;
              <Radio.Group value={ratio} buttonStyle="solid" size='small' onChange={(e) => setRatio(e.target.value)}>
                <Radio.Button value="1:1">1:1</Radio.Button>
                <Radio.Button value="3:2">3:2</Radio.Button>
                <Radio.Button value="4:3">4:3</Radio.Button>
                <Radio.Button value="16:9">16:9</Radio.Button>
              </Radio.Group>
            </div>
            <div><Icon type='play-circle' onClick={() => setVisible(true)} /></div>
          </header>
          <div className='canvas-container'>
            <DropDustbin updatePosition={updatePosition}>
              <div className='canvas' ref={canvas}></div>
            </DropDustbin>
          </div>
        </Handle>
      </div>
      <Timeline>
        <List
          bordered
          dataSource={layer}
          style={{ height: '100%' }}
          renderItem={item => (<List.Item>{item}</List.Item>)}
        />
      </Timeline>
      <Drawer
        placement='right'
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      ></Drawer>
    </Wrapper>
  )
};

export default App;