import * as d3 from 'd3';
import short from 'short-uuid';

import { ID_START, getMatrix, ROOT_ID } from './';

let translator = short();
const disabled = ['title', 'desc', 'defs'];

function findNodes(node, treeData) {
  for (var i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes.item(i);
    let nodeType = child.nodeType;
    let d3Node = d3.select(child);

    // nodeType === 3 #text
    // nodeType === 4 javascript
    // nodeType === 8 annotation
    if (nodeType !== 3 && nodeType !== 4 && nodeType !== 8) {
      let dataRole = d3Node.attr('data-role');
      if (dataRole === 'mask') continue;

      let tagName = child.tagName;
      if (disabled.indexOf(tagName) !== -1) continue;

      let title = d3Node.attr('id') ? d3Node.attr('id') : tagName;

      let transform = d3Node.attr('transform');
      let { a, b, c, d, e, f } = getMatrix(transform);
      d3Node.attr('transform', `matrix(${a} ${b} ${c} ${d} ${e} ${f})`)

      d3Node.attr('data-name', title);
      let id = ID_START + translator.new();
      d3Node.attr('id', id);
      let node = { title, key: id };
      if (child.childNodes.length > 0) {
        node.children = [];
        findNodes(child, node.children);
      }
      treeData.push(node);
    }
  }
}

export default function getTreeData(svg) {
  let treeData = { title: 'document', key: ROOT_ID, children: [] };
  findNodes(svg, treeData.children);
  return treeData;
}