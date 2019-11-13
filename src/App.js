import React, { useRef, useEffect, useState } from 'react';
import { List, Icon, Radio } from 'antd';
import { SVG } from '@svgdotjs/svg.js';
import axios from 'axios';

import './App.css';

import svg1 from './assets/1.svg';
import svg2 from './assets/2.svg';
import svg3 from './assets/3.svg';
import svg4 from './assets/4.svg';


const menuIcons = ['user', 'robot', 'dollar', 'aliwangwang'];
// const svgs = [svg1, svg2, svg3, svg4];

function App() {
  let drawEl = useRef(null);
  let svgs = useRef(null);
  let [ratio, setRatio] = useState('1:1');
  let [layer, setLayer] = useState([]);

  useEffect(() => {
    // init canvas size
    const autoSize = () => {
      let height = drawEl.current.clientHeight;
      let width = height;
      switch (ratio) {
        case '3:2': width = (height / 2) * 3; break;
        case '4:3': width = (height / 3) * 4; break;
        case '16:9': width = (height / 9) * 16; break;
        default: width = height;
      }
      drawEl.current.style.width = width + 'px';
    }
    autoSize();
    window.addEventListener('resize', autoSize);
    return () => {
      window.removeEventListener('resize', autoSize);
    };
  }, [ratio]);

  useEffect(() => {
    let draw = SVG(svgs.current);

    // import svg file
    async function fetchSvg(filePath) {
      let { data } = await axios.get(filePath);
      draw.svg(data);
    }
    fetchSvg(svg1);
    fetchSvg(svg2);
    fetchSvg(svg3);
    fetchSvg(svg4);

    var symbol = SVG().addTo(draw).size(100, 100)
    symbol.rect(100, 100).attr({ fill: '#f06' })
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', flex: 1, height: 0 }}>
        <div style={{ flex: 0.2 }} className='assets'>
          <div className='menu'>
            <Icon type='upload' />
            {menuIcons.map(icon => <Icon type={icon} key={icon} />)}
          </div>
          <div className='svgs' ref={svgs}></div>
        </div>
        <div style={{ flex: 0.8 }} className='handle'>
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
            <div><Icon type='play-circle' /></div>
          </header>
          <div className='canvas-container'>
            <div className='canvas' ref={drawEl}></div>
          </div>
        </div>
      </div>
      <div style={{ height: '200px', overflowY: 'scroll' }} className='timeline'>
        <List
          bordered
          dataSource={layer}
          style={{ height: '100%' }}
          renderItem={item => (<List.Item>{item.type}</List.Item>)}
        />
      </div>
    </div>
  );
}

export default App;
