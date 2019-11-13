import gif from 'gif.js';

// return promise
let workerScript = fetch("https://unpkg.com/gif.js@0.2/dist/gif.worker.js")
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob, { type: "text/javascript" }))

function GIF(options) {
  gif.call(this, { workerScript, ...options });
}

GIF.prototype = Object.create(gif.prototype);

export default GIF;
// const GIF = window.GIF;

// let gif = new GIF();
// console.log('gif: ', gif);

    // add a image element
    // gif.addFrame(drawEl.current.childNodes[0]);

    // Create a blob URL from SVG
    // including "charset=utf-8" in the blob type breaks in Safari
    // var img = new Image(),
    //   serialized = new XMLSerializer().serializeToString(drawEl.current.childNodes[0]),
    //   svg = new Blob([serialized], { type: "image/svg+xml" }),
    //   url = URL.createObjectURL(svg);
    // img.src = url;

    // // Onload, callback to move on to next frame
    // img.onload = function () {
    //   console.log(serialized)
    //   gif.addFrame(img, { copy: true });
    // };

    // // console.log(drawEl.current.childNodes)

    // gif.on('finished', function (blob) {
    //   // console.log(blob, URL.createObjectURL(blob));
    //   window.open(URL.createObjectURL(blob));
    // });

    // gif.on("progress", function (p) {
    //   console.log(p)
    // });

    // gif.render();