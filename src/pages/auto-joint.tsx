import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'antd';
import * as d3 from 'd3';

import part1 from '../hitu/part1.svg';
import part2 from '../hitu/part2.svg';

function findChildById(this: any, id: string) {
  let child = [...this.childNodes];
  return child.find(i => i.nodeName !== '#text' && d3.select(i).attr('id') === id)
}

function isEmpty(selection: any) {
  return !selection._groups[0][0]
}

function joint(group: d3.Selection<d3.BaseType, unknown, HTMLElement, any>) {
  let anchor = group.select(function () {
    return findChildById.call(this, '锚点')
  })
  let child = group.select('g');

  if (!isEmpty(anchor) && child) {
    // 和上一节点的定位点
    let position = child.select(function () {
      return findChildById.call(this, '定位点')
    })
    // console.log(isEmpty(anchor))
    let x = Number(anchor.attr('cx'));
    let y = Number(anchor.attr('cy'));

    let x1 = Number(position.attr('cx'));
    let y1 = Number(position.attr('cy'));

    child.attr('transform', `translate(${x - x1}, ${y - y1})`);
    joint(child)
  }
}

function draw(data: XMLDocument, canvas: string) {
  // append svg and select target group
  let svg = d3.select(data.documentElement).node();
  let sample = d3.select(canvas)
    .attr('viewBox', '-100,-100, 300, 300')
    .html(svg!.innerHTML)
    .select('#target')
  joint(sample)
  return Promise.resolve(sample);
};

export default () => {
  useEffect(() => {
    d3.xml(part1).then(data => {
      draw(data, '#canvas1')
    });
    d3.xml(part2).then(data => {
      draw(data, '#canvas2')
    });
  }, [])
  return (
    <div>
      <Row>
        <Col span={6}><img src={part1} alt='' /></Col>
        <Col span={6}><img src={part2} alt='' /></Col>
      </Row>
      <Row>
        <Col span={6}><svg id="canvas1" ></svg></Col>
        <Col span={6}><svg id="canvas2"></svg></Col>
      </Row>
      <p>备注：以手臂为 demo 可以实现素材配合的情况下拼接人物模型</p>
      <p>TODO:</p>
      <ul>
        <li>需要进一步做整个人的拼接</li>
        <li>锚点和定位点的命名可以进一步完善</li>
        <li>可以省略锚点和定位点这样的信息，改用百分比的位置 0.1 0.5 </li>
      </ul>
    </div>
  )
}