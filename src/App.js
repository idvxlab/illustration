import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Layout, Tree, Input, Button, Icon } from 'antd';
import * as d3 from 'd3';

import { appendSvgAsGroup, getTreeData, selected, createTimeline, getRotateAnchor } from "./utils";

import figure from './assets/figure.svg';
import flowerpot from './assets/flowerpot.svg';

import './app.less';

const { Sider, Footer } = Layout;
const { TreeNode, DirectoryTree } = Tree;

const siderWidth = 300;

const siderStyle = {
  overflow: 'auto',
  height: '75vh',
  position: 'fixed',
  left: 0,
  backgroundColor: '#fff',
  borderRight: '1px solid #444'
};

function findExpandKeys(treeData, level, result = []) {
  for (let i = 0; i < treeData.length; i++) {
    let { key, children } = treeData[i];
    result.push(key);
    if (level > 0 && children) findExpandKeys(children, level - 1, result)
  }
  return result;
}

let nodes = (children) => children.map(node => (
  <TreeNode title={node.title} key={node.key} isLeaf={!node.children}>
    {node.children ? nodes(node.children) : null}
  </TreeNode>))

const App = () => {
  let canvas = useRef(null);
  let timeline = useRef(null);
  const [treeData, setTreeData] = useState([]);
  const [curSelectKeys, setCurSelectKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [rotateDeg, setRotateDeg] = useState("");
  const [keyframes, setKeyframes] = useState([]); // id, name, value

  useEffect(() => {
    async function init() {
      let width = canvas.current.clientWidth * 0.8;
      let height = canvas.current.clientHeight;
      let wrapper = d3.select(canvas.current);
      let svg = wrapper.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `${-width * 0.2}, ${-height * 0.2}, ${width * 1.5}, ${height * 1.5}`)
      await appendSvgAsGroup(figure, svg, { x: width / 3, y: height / 2 })
      await appendSvgAsGroup(flowerpot, svg, { x: width * 2 / 3, y: height / 2 });
      let treeData = [getTreeData(svg.node())];
      setTreeData(treeData);
    }
    init();
    createTimeline(timeline.current);
  }, []);

  const onSelect = selectedKeys => {
    let keys = selectedKeys.filter(id => id !== treeData[0].key);
    setCurSelectKeys(keys);
    if (keys.length > 0) {
      let keyframe = keyframes.find(kf => kf.id === keys[0]);
      setRotateDeg(keyframe ? keyframe.value : "");
    }
  }
  const onExpand = expandedKeys => setExpandedKeys(expandedKeys);

  useEffect(() => {
    selected(canvas.current, curSelectKeys);
  }, [curSelectKeys])

  useEffect(() => {
    let expandedKeys = findExpandKeys(treeData, 3);
    setExpandedKeys(expandedKeys);
  }, [treeData])

  const onValueChange = e => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setRotateDeg(value);
    }
  };

  const getName = (id) => {
    let svg = d3.select(canvas.current).select('svg')
    let node = svg.select('#' + id);
    let name = [node.attr('data-name')];
    let parent = node.node().parentNode;
    // console.log('parent: ', parent);
    if (parent) {
      name.unshift(d3.select(parent).attr('data-name'))
    }
    return name.join('-');
  };

  const onAddKeyframe = () => {
    let id = curSelectKeys[0];
    let keyframe = keyframes.find(kf => kf.id === id);
    if (!keyframe) {
      keyframe = { id, name: getName(id), value: rotateDeg };
      setKeyframes([...keyframes, keyframe]);
    } else {
      keyframe.value = rotateDeg;
      setKeyframes([...keyframes]);
    }
  }

  const onPlay = useCallback(() => {
    // if (keyframes.length === 0) return;
    let svg = d3.select(canvas.current).select('svg');
    for (let i = 0; i < keyframes.length; i++) {
      let { id, value: deg } = keyframes[i];
      let node = svg.select('#' + id);
      // let parent = node.node().parentNode;
      let { x, y } = getRotateAnchor(node);
      let s = node.attr('transform');
      if (!s) s = "";
      function tween() {
        return d3.interpolateString(s + `rotate(0, ${x}, ${y})`, s + `rotate(${deg}, ${x}, ${y})`);
      }
      node
        .transition()
        .duration(1000)
        .attrTween("transform", tween);
    }

  }, [keyframes])

  return (
    <Layout>
      <Layout>
        <Sider style={siderStyle} width={siderWidth}>
          <Tree autoExpandParent={false} onSelect={onSelect} expandedKeys={expandedKeys} onExpand={onExpand}>
            {nodes(treeData)}
          </Tree>
        </Sider>
        <Layout style={{ marginLeft: siderWidth, width: '75%' }}>
          <div ref={canvas} style={{ height: '75vh', backgroundColor: '#fff' }}></div>
        </Layout>
        <div className='config'>
          <div className="item">
            rotate: <Input style={{ width: 100 }} value={rotateDeg} onChange={onValueChange} />
          </div>
          <Button type="primary"
            disabled={curSelectKeys.length === 0 || !rotateDeg}
            onClick={onAddKeyframe}>Add Keyframe</Button>
        </div>
      </Layout>
      <Footer className='footer'>
        <div className="timeline-header timeline-layout">
          <div><Icon type="play-circle" style={{ fontSize: 20, float: "right", cursor: 'pointer' }} onClick={onPlay} /> </div>
          <div ref={timeline} style={{ height: '100%' }}></div>
        </div>
        <div className="timeline-container">
          {keyframes.map(kf => (<div className="timeline-layout" key={kf.id}>
            <div>{kf.name}</div><div>{kf.value}</div>
          </div>))}
        </div>
      </Footer>
    </Layout>
  )
}

export default App;


// function selectByClick() {
//   console.log(curSelectKeys)
  // let { path } = d3.event;
  // let selectedKey;
  // for (let i = 0; i < path.length; i++) {
  //   let node = path[i];
  //   if (node.tagName === 'svg') break;
  //   let id = d3.select(node).attr('id');
  //   if (curSelectKeys.length > 0 && curSelectKeys.indexOf(id) !== -1) break;
  //   selectedKey = id;
  // }
  // console.log('path', selectedKey)
// };

// const s = useCallback((svg) => {
//   console.log(curSelectKeys)
  // svg.on('click', function () {
  //   let { path } = d3.event;
  //   let id;
  //   for (let i = 0; i < path.length; i++) {
  //     let node = path[i];
  //     console.log('node.tagName: ', node.tagName === 'svg');
  //     if (node.tagName === 'svg') break;
  //     id = d3.select(node).attr('id');
  //   }
  //   // console.log(id, path)
  //   setCurSelectKeys([id])
  // })
// }, [curSelectKeys]);