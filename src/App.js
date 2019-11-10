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
  const appendSvgNode = (filePath) => {
    axios.get(filePath).then(({ data }) => {
      // load svg file
      let draw = SVG('#canvas svg');
      draw.svg(data, true);
      // define svg.js instance
      draw = SVG(drawEl.current).get(0);
      setLayer(draw.children());

      draw.children().forEach(c => {
        if (c.animate) {
          c.animate().dx(20)
        }
        if (c.click) {
          c.click(function () {
            this.fill({ color: '#f06' })
          })
        }

      })
    })
  }
  useEffect(() => {
    // init canvas size
    let height = drawEl.current.parentNode.clientHeight;
    drawEl.current.style.height = height * 0.9 + 'px';
    drawEl.current.style.width = height * 0.9 + 'px';
    appendSvgNode(svg1)
  }, [])
  return (
    <div>
      <div style={{ display: 'flex', height: '70vh' }}>
        <div style={{ flex: '0.2' }} className='assets'>
          <div className='menu'>
            <Icon type='upload' />
            {menuIcons.map(icon => <Icon type={icon} key={icon} />)}
          </div>
          <div className='imgs'>
            {svgs.map(svg => <img src={svg} key={svg} onClick={() => appendSvgNode(svg)} />)}
          </div>
        </div>
        <div style={{ flex: 0.8 }} className='handle'>
          <header>
            <div>
              <Icon type='arrow-left' />
              &emsp;
              <Icon type='arrow-right' />
            </div>
            <div>画布设置</div>
            <div><Icon type='play-circle' /></div>
          </header>
          <div className='canvas-container'>
            <div className='canvas' ref={drawEl} id='canvas'>
              <svg></svg>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '30vh', overflowY: 'scroll' }} className='timeline'>
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
