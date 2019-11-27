// import { select, event, zoom } from 'd3';
// const ATTR_ID = 'data-id';

const resizable = (canResize) => g => {
  g.selectAll('*[data-role^=handler-]').classed('selected', canResize);

  // svg.selectAll('g').each(function () {
  //   let g = select(this)
  //   let id = g.attr(ATTR_ID);
  //   // selectable - show handlers 
  //   svg.selectAll('*[data-role^=handler-]').classed('selected', id === currentId);
  //   if (id === currentId) {
  //     // add drag event
  //     svg.call(zoom().on("zoom", function () {
  //       g.attr("transform", event.transform)
  //     }))
  //   }
  // })

};

export default resizable;