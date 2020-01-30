import { select, drag, event } from 'd3';
import { transform } from 'd3-transform';

import { generateId, decomposeTransform, xmlUrl } from './';
import { d3SelectGroup, d3SelectSvg } from '../typings';

interface LayerInfo {
  id: string
  isSelect: boolean
}

type CxCy = [number, number];

export function updatePosition(g: d3SelectGroup, [cx, cy]: CxCy, initScale?: number) {
  let { width, height } = (g.node() as SVGGElement).getBBox();
  let { scaleX } = decomposeTransform(g.attr('transform'));
  let scale = initScale || scaleX;
  let tf = transform()
    .translate([cx - (width / 2) * scale, cy - (height / 2) * scale])
    .scale(scale)
  g.attr('transform', tf);
}

// const LAYER_FLAG = { attr: 'data-role', val: 'layer' };

const draggable = () => {
  let diff = { x: 0, y: 0 };
  return drag()
    .on("start", function () {
      let svg = this.parentNode;
      let { x: baseX, y: baseY } = (svg as SVGSVGElement).getBoundingClientRect();
      let { x: targetX, y: targetY, width, height } = this.getBoundingClientRect();
      let { x, y } = event;
      diff.x = x - (targetX - baseX + width / 2);
      diff.y = y - (targetY - baseY + height / 2);
    })
    .on("drag", function () {
      let g = select(this);
      (g as any).call(updatePosition, [event.x - diff.x, event.y - diff.y])
    })
}

export class LayerController {

  parent: d3SelectSvg;
  layers: d3SelectGroup[];
  current: string | null;

  constructor(svg: SVGSVGElement) {
    this.parent = select(svg);
    this.current = null;
    this.layers = [];
  }

  initLayer(g: d3SelectGroup, id: string) {
    g.attr('id', id) // id
    this.layers.push(g);
  }

  async push(url: string, center: CxCy = [0, 0]) {
    let g = await xmlUrl(this.parent, url);
    if (g) {
      let id = generateId();
      this.initLayer(g, id);
      g.call(updatePosition, center, 0.2)
      g.call(draggable() as any);
      this.select(id);
    }
  }

  select(id: string) {
    this.current = id;
    this.layers.forEach(g => {
      let gid = g.attr('id');
      if (gid === id) {
        g.attr('')
      }
    })
  }

  delete() {

  }

}
