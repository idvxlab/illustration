import React, { useEffect, useRef, useState } from 'react';
import { Collapse, Icon, Radio, Drawer } from 'antd';
import { select } from 'd3';
import uuid from 'uuid';

// components
import DragAsset from './components/drag-asset';
import DropDustbin from './components/drop-dustbin';
import Timeline from './components/timeline';
import { Wrapper, Handle, AssetsContainer, TimelineWrapper } from './components/styled';


import { addAssetToCanvas, draggable, resizable, Animation } from './utils';
import fetchAssets from './utils/fetch-assets';

const { Panel } = Collapse;
const menuIcons = ['user', 'robot', 'dollar', 'aliwangwang'];
const ATTR_ID = 'data-id';

function App() {
  const canvas = useRef(null); // svg container
  const [animation, setAnimation] = useState(null);
  const [assets, setAssets] = useState([]);
  const [ratio, setRatio] = useState('1:1');
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState([]);
  const [current, setCurrent] = useState(""); // need to react apply to interface

  // no need to setSate
  let dropEndPosition = { x: 0, y: 0 };

  // fetch assets data
  useEffect(() => {
    let svg = select(canvas.current)
      .append('svg')
      .classed('canvas', true);
    setAnimation(new Animation(svg));
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

  useEffect(() => {
    if (!animation) return;
    animation.changeCurrLayer(current);
  }, [current, animation])

  // drop svg
  const drawing = async ({ url, name }) => {
    let { x: baseX, y: baseY } = canvas.current.getBoundingClientRect();
    let { x, y } = dropEndPosition;
    let id = await animation.addLayer(url, [x - baseX, y - baseY], setCurrent);
    setCurrent(id);
    setLayer([...layer, { name, id }]);
  };

  // to get final drag end position
  const updatePosition = ({ x, y }) => {
    if (dropEndPosition.x !== x && dropEndPosition.y !== y) {
      dropEndPosition = { x, y };
    }
  }

  const onDelete = (e, id) => {
    e.preventDefault();
    let l = layer.filter(i => i.id !== id);
    setLayer(l);
    animation.removeLayer(id)
  };

  const DeleteIcon = (id) => <Icon type='delete' onClick={(e) => onDelete(e, id)} />
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
              {/* TODO change ratio need to modify the element position of canvas */}
              <Radio.Group value={ratio} buttonStyle="solid" size='small' onChange={(e) => setRatio(e.target.value)}>
                <Radio.Button value="1:1">1:1</Radio.Button>
                <Radio.Button value="3:2">3:2</Radio.Button>
                <Radio.Button value="4:3">4:3</Radio.Button>
                <Radio.Button value="16:9">16:9</Radio.Button>
              </Radio.Group>
            </div>
            {/* <div><Icon type='play-circle' onClick={() => setVisible(true)} /></div> */}
            <div><Icon type='play-circle' onClick={() => animation.play()} /></div>
          </header>
          <div className='canvas-container'>
            <DropDustbin updatePosition={updatePosition}>
              <div className='canvas' ref={canvas}></div>
            </DropDustbin>
          </div>
        </Handle>
      </div>
      <TimelineWrapper>
        <Collapse accordion activeKey={current} onChange={key => setCurrent(key)}>
          {layer.map(item => (
            <Panel header={item.name + '---' + item.id} key={item.id} extra={DeleteIcon(item.id)}>
              <Timeline animation={animation}></Timeline>
            </Panel>
          ))}
        </Collapse>,
      </TimelineWrapper>
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