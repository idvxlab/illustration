import * as d3 from 'd3';
import Mousetrap from 'mousetrap';

import { ROOT_ID, isEmpty } from './';

function endOfRoot(path) {
  let r = [];
  for (let i = 0; i < path.length; i++) {
    let node = path[i];
    let id = d3.select(node).attr('id');
    if (id === ROOT_ID) break;
    r.push(node);
  }
  return r;
}

// TODO cmd 点击选择进入下一层
export default function interactionSelect(root, callback) {
  root.on('click', function () {
    // filter click path only in svg
    let { path, metaKey } = d3.event;
    path = endOfRoot(path);

    // whether click mask
    let isMask = path.find(i => d3.select(i).attr('data-role') === 'mask');
    if (isMask) return callback("");

    // current select 
    let endId = ROOT_ID;
    let handler = root.select('#handler');
    if (metaKey) {
      let current = handler.attr('data-for');
      let isContain = path.find(i => d3.select(i).attr('id') === current);
      if (isContain) endId = current;
    } else {
      let containHandler = path.find(i => d3.select(i).attr('id') === 'handler');
      if (containHandler) return;
    }
    let value;
    for (let i = 0; i < path.length; i++) {
      let node = path[i];
      let id = d3.select(node).attr('id');
      if (id === endId) break;
      value = id;
    }
    callback(value);
  });
  Mousetrap.bind('command', function () {
    let handler = root.select('#handler');
    if (!isEmpty(handler)) handler.lower();
  }, 'keydown');
  Mousetrap.bind('command', function () {
    let handler = root.select('#handler');
    if (!isEmpty(handler)) handler.raise();
  }, 'keyup');
}