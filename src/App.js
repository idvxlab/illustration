import React, { useRef, useEffect, useState } from 'react';
import { List, Icon } from 'antd';
import { SVG } from '@svgdotjs/svg.js'
import axios from 'axios';

import './App.css';

import svg1 from './assets/1.svg';
import svg2 from './assets/2.svg';
import svg3 from './assets/3.svg';


const menuIcons = ['user', 'robot', 'dollar', 'aliwangwang'];
const svgs = [svg1, svg2, svg3];

function App() {
  let drawEl = useRef(null);
  let [layer, setLayer] = useState([]);
  useEffect(() => {
    axios.get(svg1).then(({ data }) => {

      // load svg file
      let draw = SVG().addTo(drawEl.current);
      draw.svg(data, true);

      // define svg.js instance
      draw = SVG(drawEl.current).get(0);

      // TODO response size of svg
      draw.attr({ height: 400, width: 300 })
      setLayer(draw.children());
      // console.log('draw.children(): ', draw.children());
    })
  }, [])
  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <div style={{ flex: '1', display: 'flex' }}>
        <div style={{ flex: '0.2' }} className='assets'>
          <div className='menu'>
            <Icon type='upload' />
            {menuIcons.map(icon => <Icon type={icon} key={icon} />)}
          </div>
          <div className='imgs'>
            {svgs.map(svg => <img src={svg} key={svg} />)}
          </div>
        </div>
        <div style={{ flex: '0.8' }} className='handle'>
          <header>
            <div>
              <Icon type='arrow-left' />
              &emsp;
              <Icon type='arrow-right' />
            </div>
            <div>画布设置</div>
            <div><Icon type='play-circle' /></div>
          </header>
          <div className='canvas' ref={drawEl}></div>
        </div>
      </div>
      {/* TODO set fixed height */}
      <div style={{ height: '200px', overflowY: 'scroll' }} className='timeline'>
        <List
          bordered
          dataSource={layer}
          renderItem={item => (<List.Item>{item.type}</List.Item>)}
        />
      </div>
    </div>
  );
}

export default App;
