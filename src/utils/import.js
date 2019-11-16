export const addAssetToCanvas = (url, draw, startX, startY) => {
  fetch(url)
    .then(response => response.text())
    .then(text => {
      let el = document.createElement('div');
      el.innerHTML = text;
      let g = draw.group()
      g.svg(el.querySelector('svg').innerHTML);
      let { cx, cy } = g.bbox();
      g.transform({
        scale: 0.3, // TODO scale base on actual size
        translateX: startX - cx,
        translateY: startY - cy,
      })
      // TODO add a background rect to the group to catch any areas - rect.draggable();
    })
}