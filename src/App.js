import React, { useEffect, useRef, useState, useCallback } from 'react';
import { List, Icon, Radio, Drawer } from 'antd';
import { select } from 'd3';
import uuid from 'uuid';

// components
import DragAsset from './components/drag-asset';
import DropDustbin from './components/drop-dustbin';
import { Wrapper, Handle, AssetsContainer, Timeline } from './components/styled';


import { addAssetToCanvas, draggable, resizable } from './utils';
import fetchAssets from './utils/fetch-assets';


const menuIcons = ['user', 'robot', 'dollar', 'aliwangwang'];
const ATTR_ID = 'data-id';

function App() {
  const canvas = useRef(null);
  const [draw, setDraw] = useState(null);
  const [assets, setAssets] = useState([]);
  const [ratio, setRatio] = useState('1:1');
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState([]);
  const [current, setCurrent] = useState("");
  const [dropEndPosition, setDropEndPosition] = useState({ x: 0, y: 0 });

  // set svg.js instance
  // fetch assets data
  useEffect(() => {
    let svg = select(canvas.current).append('svg');
    setDraw(svg);
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
    if (!draw || !current) return;
    draw.selectAll('g').each(function () {
      let g = select(this)
      let id = g.attr(ATTR_ID);
      g.call(draggable(id === current));
      g.call(resizable(id === current));
    })

  }, [current, draw])

  // drop svg
  const drawing = async ({ url, name }) => {
    let { x: baseX, y: baseY } = canvas.current.getBoundingClientRect();
    let { x, y } = dropEndPosition;
    let g = await addAssetToCanvas(url, draw, [x - baseX, y - baseY]);
    let id = uuid();
    g.attr(ATTR_ID, id);
    g.on('click', function () {
      let id = select(this).attr(ATTR_ID);
      setCurrent(id);
    })
    // add layer
    setLayer([...layer, { name, id }]);
  };

  // to get final drag end position
  const updatePosition = useCallback(({ x, y }) => {
    if (dropEndPosition.x !== x && dropEndPosition.y !== y) {
      setDropEndPosition({ x, y });
    }
  }, [dropEndPosition]);

  const onDelete = (e, id) => {
    e.preventDefault();
    let l = layer.filter(i => i.id !== id);
    setLayer(l);
    draw.selectAll('g').each(function () {
      let g = select(this)
      let gid = g.attr(ATTR_ID);
      if (gid === id) {
        g.remove();
      }
    })
  };

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
          renderItem={item => (
            <List.Item
              style={{ cursor: 'pointer', color: current === item.id ? '#f06' : '' }}
              onClick={() => setCurrent(item.id)}
            >
              &emsp;{item.name + '---' + item.id}
              <Icon style={{ float: 'right' }} type='delete' theme='filled' onClick={(e) => onDelete(e, item.id)} />
            </List.Item>)}
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