import * as d3 from 'd3';
import { ROOT_ID } from './'

// TODO cmd 点击选择进入下一层
export default function interactionSelect(root, callback) {
  root.on('click', function () {
    const { path } = d3.event;
    let value;
    for (let i = 0; i < path.length; i++) {
      let node = path[i];
      let id = d3.select(node).attr('id');
      let dataRole = d3.select(node).attr('data-role');
      if (id === ROOT_ID) break;
      if (dataRole === 'mask') return callback("");
      value = id;
    }
    callback(value);
  })
}