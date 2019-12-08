import * as d3 from 'd3';
import short from 'short-uuid';

import { ID_START } from './';

let translator = short();
const disabled = ['title', 'desc', 'defs'];

function findNodes(node, treeData) {
  for (var i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes.item(i);
    let nodeType = child.nodeType;

    // console.log(node.childNodes.item(i), node.childNodes.item(i).nodeType)
    // if (node.childNodes.item(i).nodeType === 8) {
    //   console.log('child: ', node.childNodes.item(i));
    // }

    // nodeType === 3 #text
    // nodeType === 4 javascript
    // nodeType === 8 annotation
    if (nodeType !== 3 && nodeType !== 4 && nodeType !== 8) {
      let tagName = child.tagName;
      if (disabled.indexOf(tagName) !== -1) continue;

      let d3Node = d3.select(child);
      let title = d3Node.attr('id') ? d3Node.attr('id') : tagName;
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
  let id = ID_START + translator.new();
  d3.select(svg).attr('id', id);
  let treeData = { title: 'document', key: id, children: [] };
  findNodes(svg, treeData.children);
  // console.log('treeData: ', treeData);
  return treeData;
}