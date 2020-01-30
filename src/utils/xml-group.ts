import { select, xml } from 'd3';
import { d3SelectSvg, d3SelectGroup } from '../typings';

export async function xmlUrl(svg: d3SelectSvg | d3SelectGroup, url: string) {
  let data = await xml(url);
  let svgNode = select(data.documentElement).node();
  if (svgNode) {
    let g = svg.append('g').html(svgNode.innerHTML);
    return g;
  } else {
    return null;
  }
}