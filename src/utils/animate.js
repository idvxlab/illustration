import { select } from 'd3';
import uuid from 'uuid';

import { addAssetToCanvas, draggable, resizable } from './';

const ATTR_ID = 'data-id';

class Animation {
  constructor(svg, layerArr = []) {
    this.svg = svg;
    this.layerArr = layerArr;
    this.currentLayer = ''; // layer id
    this.currentKey = ''; // keyframe id
  }
  setTimeline(tl) {
    let currentLayer = this.layerArr.find(i => i.id === this.currentLayer);
    currentLayer.tl = tl;
  }
  async addLayer(url, [startX, startY], setCurrent) {
    let g = await addAssetToCanvas(url, this.svg, [startX, startY]);
    let layerId = uuid();
    g.attr(ATTR_ID, layerId);
    g.on('click', function () {
      let id = select(this).attr(ATTR_ID);
      setCurrent(id); // change react current layer
    })
    // add layer
    this.layerArr.push({ id: layerId, el: g, keyframeArr: [] });
    return Promise.resolve(layerId);
  }
  changeCurrLayer(layerId) {
    let updateCurrKeyframe = this.updateCurrKeyframe.bind(this);
    // clear all select
    if (!layerId) {
      this.svg.selectAll('g')
        .call(draggable(false))
        .call(resizable(false))
    } else {
      this.svg.selectAll('g').each(function () {
        let g = select(this)
        let id = g.attr(ATTR_ID);
        g.call(draggable(id === layerId, updateCurrKeyframe));
        g.call(resizable(id === layerId));
      })
    }
    this.currentLayer = layerId;
  }
  removeLayer(layerId) {
    this.svg.selectAll('g').each(function () {
      let g = select(this)
      let gid = g.attr(ATTR_ID);
      if (gid === layerId) {
        g.remove();
      }
    })
    this.layerArr = this.layerArr.filter(i => i.id !== layerId)
  }
  async addKeyframe(key) {
    let id = uuid();
    let { el, keyframeArr } = this.layerArr.find(i => i.id === this.currentLayer);
    let keyframe = { id, key, value: el.attr('transform') };
    keyframeArr.push(keyframe);
    return Promise.resolve(id);
  }
  changeCurrKeyframe(id) {
    this.currentKey = id;
    let { el, keyframeArr } = this.layerArr.find(i => i.id === this.currentLayer);
    let { value } = keyframeArr.find(i => i.id === id);
    el.attr('transform', value)
  }
  updateCurrKeyframe(id = this.currentKey, key) {
    if (!id) return;
    let { el, keyframeArr } = this.layerArr.find(i => i.id === this.currentLayer);
    let keyframe = keyframeArr.find(i => i.id === id);
    if (key) keyframe.key = key;
    keyframe.value = el.attr('transform');
  }
  play() {
    this.layerArr.forEach(({ el, keyframeArr }) => {
      let tf = el;
      for (let i = 0; i < keyframeArr.length - 1; i++) {
        let { key, value } = keyframeArr[i];
        let { key: key2, value: value2 } = keyframeArr[i + 1];
        tf = tf.attr('transform', value)
          .transition()
          .duration(key2 - key)
          .attr('transform', value2)
      }
    })
  }
}

export default Animation;