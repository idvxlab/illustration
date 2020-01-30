import * as d3 from 'd3';
import { getMatrix, ROOT_ID, generateId } from './';

const disabled = ['title', 'desc', 'defs'];

export interface TreeData {
  title: string
  key: string
  children?: TreeData[]
}

function findNodes(node: any, treeData: TreeData[]) {
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
      let id = generateId();
      d3Node.attr('id', id);
      let node: TreeData = { title, key: id };
      if (child.childNodes.length > 0) {
        node.children = [];
        findNodes(child, node.children);
      }
      treeData.push(node);
    }
  }
}

export function getTreeData(svg: SVGGElement) {
  let treeData = { title: 'document', key: ROOT_ID, children: [] };
  findNodes(svg, treeData.children);
  return treeData;
}