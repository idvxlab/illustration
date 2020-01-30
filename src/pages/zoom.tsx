import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { xmlUrl } from '../utils';
import { d3SelectSvg, d3SelectGroup } from '../typings';

import fetchAssets from '../undraw';

function zoom(svg: d3SelectSvg, g: d3SelectGroup) {
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])  // 指定缩放比例允许范围
    .on("zoom", () => g.attr("transform", d3.event.transform));
  svg.call(zoom as any);
  // set initial position via zoom
  svg.call(zoom.transform as any, d3.zoomIdentity.translate(30, 50).scale(0.6));
}

export default () => {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const width = 800, height = 550;

    var svg = d3.select(container.current!).append("svg")
      .attr("width", width)
      .attr("height", height)
      .style('border', '1px solid #000')
      .attr('preserveAspectRatio', 'xMinYMin')  // 强制进行统一缩

    const init = async () => {
      let dataset = await fetchAssets();
      let g = await xmlUrl(svg, dataset[0].url);
      if (g) zoom(svg, g);
    }
    init();
  }, [])
  return (
    <div>
      <p>使用滚轮+鼠标拖拽</p>
      <div ref={container}></div>
      <p>备注：利用 d3 自带缩放属性可以做整个画布的缩放，不适合作为关键帧缩放的调节方法，因为不准确，且不易控制</p>
    </div>
  )
}