import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Layout, Tree, Input, Button, Icon } from 'antd';
import * as d3 from 'd3';

import {
  appendSvgAsGroup,
  getTreeData,
  selected,
  createTimeline,
  getAnchor,
  canZoom,
  ROTATE_ANCHOR,
  interactionSelect,
  ROOT_ID
} from "./utils";

import figure from './assets/figure.svg';
import flowerpot from './assets/flowerpot.svg';

import SwitchWithLabel from './components/switch-with-label';

import './style/app.less';

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
  const [isEditTree, setIsEditTree] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [activeKey, setActiveKey] = useState("");
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
        .style('background-color', '#d6dfef')
      let root = svg.append('g').attr('id', ROOT_ID)
      await appendSvgAsGroup(flowerpot, root, { x: width * 2 / 3, y: height / 2 });
      await appendSvgAsGroup(figure, root, { x: width / 3, y: height / 2 })
      let treeData = [getTreeData(root.node())];
      setTreeData(treeData);
      canZoom(svg, root);
      interactionSelect(root, setActiveKey);
    }
    init();
    createTimeline(timeline.current);
  }, []);

  useEffect(() => {
    let expandedKeys = findExpandKeys(treeData, 3);
    setExpandedKeys(expandedKeys);
  }, [treeData]);

  useEffect(() => {
    selected(canvas.current, activeKey);
    if (activeKey) {
      let keyframe = keyframes.find(kf => kf.id === activeKey);
      setRotateDeg(keyframe ? keyframe.value : "");
    }
  }, [activeKey, keyframes]);

  const onSelect = selectedKeys => {
    let keys = selectedKeys.filter(id => id !== ROOT_ID);
    let key = keys.length > 0 ? keys[0] : '';
    setActiveKey(key);
  }
  const onExpand = expandedKeys => setExpandedKeys(expandedKeys);

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
    if (parent) {
      name.unshift(d3.select(parent).attr('data-name'))
    }
    return name.join('-');
  };

  const onAddKeyframe = () => {
    let id = activeKey;
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
      let { x, y } = getAnchor(node, ROTATE_ANCHOR);
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
          {isEditTree ?
            (<DirectoryTree multiple expandedKeys={expandedKeys} onExpand={onExpand}>
              {nodes(treeData)}
            </DirectoryTree>)
            : (<Tree autoExpandParent={false} onSelect={onSelect} selectedKeys={[activeKey]} expandedKeys={expandedKeys} onExpand={onExpand}>
              {nodes(treeData)}
            </Tree>)
          }
        </Sider>
        <Layout style={{ marginLeft: siderWidth, width: '75%' }}>
          <div ref={canvas} style={{ height: '75vh', backgroundColor: '#fff' }}></div>
        </Layout>
        <div className='config'>
          <div className='item'>
            <SwitchWithLabel checked={isEditTree} onChange={checked => setIsEditTree(checked)} />
          </div>
          {isEditTree ?
            (<></>) :
            (<>
              <div className="item">
                rotate: <Input style={{ width: 100 }} value={rotateDeg} onChange={onValueChange} />
              </div>
              <Button type="primary"
                disabled={!activeKey || !rotateDeg}
                onClick={onAddKeyframe}>Add Keyframe</Button>
            </>)
          }
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
//   console.log(activeKey)
  // let { path } = d3.event;
  // let selectedKey;
  // for (let i = 0; i < path.length; i++) {
  //   let node = path[i];
  //   if (node.tagName === 'svg') break;
  //   let id = d3.select(node).attr('id');
  //   if (activeKey.length > 0 && activeKey.indexOf(id) !== -1) break;
  //   selectedKey = id;
  // }
  // console.log('path', selectedKey)
// };

// const s = useCallback((svg) => {
//   console.log(activeKey)
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
  //   setActiveKey([id])
  // })
// }, [activeKey]);