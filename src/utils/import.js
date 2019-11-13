import { SVG } from '@svgdotjs/svg.js'
import axios from 'axios';

export const appendSvgNode = (filePath) => {
  axios.get(filePath).then(({ data }) => {
    // load svg file
    let draw = SVG('#canvas svg');
    draw.svg(data, true);
    // define svg.js instance
    // draw = SVG(drawEl.current).get(0);
    // setLayer(draw.children());
  })
}