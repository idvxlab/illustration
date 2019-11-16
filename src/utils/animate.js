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

// let draw = SVG().addTo(drawEl.current).size(600, 400)
    // let rect = draw.rect(100, 100).attr({ fill: '#f06' }).x(300).y(100)
    // rect.draggable()

    // var polyline = draw.polyline('50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40')
    // polyline.fill('none').move(20, 20).stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' })
    // polyline.draggable();

    // draw.path('M10 80 C 40 150, 65 150, 95 80 S 150 10, 180 80').fill('none').stroke({ color: '#f06', width: 5 })

    // let shape = draw.svg();
    // let rectPath = rect.toPath()
    // .animate(1000).plot('M1101,770.44071H99v-227q483-188.20473,1002,0Z" transform="translate(-99 -38.44071)" fill="#3f3d56"/><path d="M510.80283,643.32181,519.94,671.60339s-8.26693,26.54118-4.351,56.12808,1.74041,30.45709,1.74041,30.45709-39.12624-2.25247-35.21033,9.49527,42.172,4.86307,42.172,4.86307,7.34724-1.97821,10.828-22.86307,12.23232-61.11149,12.23232-61.11149L539.122,650.59745Z')
    // rect.animate(1000).fill('#f0f').opacity(0.7).rotate(45, -5, 0)
    // console.log('rectPath: ', rectPath);
    // var clone = rect.clone()
    // // draw.put(clone)
    // let clonePath = clone.toPath();
    // console.log('clone: ', clonePath.attr());
    // clonePath.animate(2000).attr({ d: 'M100,0 Q40,205 50,230 T90,230' })
    // rect.remove()
    // rect.replace(draw.circle(100))
