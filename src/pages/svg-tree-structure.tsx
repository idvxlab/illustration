import React, { CSSProperties, useState, useEffect, useRef } from 'react';
import { Layout, Tree } from 'antd';
import * as d3 from 'd3';
import { ROOT_ID, xmlUrl, getTreeData, TreeData } from '../utils';

import Hitu from '../hitu/figure.svg';

const siderStyle: CSSProperties = {
  overflow: 'scroll',
  backgroundColor: '#fff',
  marginRight: 20
};

const { Sider, Content } = Layout;
const { TreeNode } = Tree;

function findExpandKeys(treeData: TreeData[], level: number, result: string[] = []) {
  for (let i = 0; i < treeData.length; i++) {
    let { key, children } = treeData[i];
    result.push(key);
    if (level > 0 && children) findExpandKeys(children, level - 1, result)
  }
  return result;
}

export default () => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  let canvas = useRef<HTMLDivElement>(null); // svg container

  useEffect(() => {
    let wrapper = d3.select(canvas.current);
    let svg = wrapper.append('svg')
      .attr('width', 600)
      .attr('height', 640);

    const init = async () => {
      let root = svg.append('g').attr('id', ROOT_ID)
      await xmlUrl(root, Hitu);
      let treeData = [getTreeData(root.node()!)];
      setTreeData(treeData);
    }
    init();
  }, []);

  const onExpand = (expandedKeys: string[]) => setExpandedKeys(expandedKeys);

  useEffect(() => {
    let expandedKeys = findExpandKeys(treeData, 3);
    setExpandedKeys(expandedKeys);
  }, [treeData]);

  let nodes = (children: TreeData[]) => children.map(node => (
    <TreeNode title={node.title} key={node.key} isLeaf={!node.children}>
      {node.children ? nodes(node.children) : null}
    </TreeNode>))

  return (
    <Layout>
      <Sider style={siderStyle} width={300}>
        <Tree autoExpandParent={false} expandedKeys={expandedKeys} onExpand={onExpand}>
          {nodes(treeData)}
        </Tree>
      </Sider>
      <Content>
        <div ref={canvas}></div>
        <p>备注:</p>
        <ul>
          <li>递归解析出每个 svg 每一层的内容</li>
          <li>同时将没个 transform 信息都整合成 matrix </li>
        </ul>
      </Content>
    </Layout>
  )
}