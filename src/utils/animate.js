// draw.children().forEach(c => {
//   if (c.animate) {
//     c.animate().dx(20)
//   }
//   if (c.click) {
//     c.click(function () {
//       this.fill({ color: '#f06' })
//     })
//   }
// })


// const appendSvgNode = (filePath) => {
//   axios.get(filePath).then(({ data }) => {
//     // load svg file
//     let draw = SVG('#canvas svg');
//     draw.svg(data, true);
//     // define svg.js instance
//     draw = SVG(drawEl.current).get(0);
//     setLayer(draw.children());

//     draw.children().forEach(c => {
//       if (c.animate) {
//         c.animate().dx(20)
//       }
//       if (c.click) {
//         c.click(function () {
//           this.fill({ color: '#f06' })
//         })
//       }

//     })
//   })
// }