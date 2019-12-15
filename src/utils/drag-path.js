import * as d3 from 'd3';

export default function dragPath(chart, points, lines, draw) {
  //   update(chart, points, lines, draw);

  //   const dist = p => {
  //     const m = d3.mouse(chart);
  //     return Math.sqrt((p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2);
  //   };

  //   var subject, dx, dy;

  //   function dragSubject() {
  //     subject = d3.least(points, (a, b) => dist(a) - dist(b));
  //     if (dist(subject) > 48) subject = null;
  //     if (subject)
  //       d3.select(chart)
  //         .style("cursor", "hand")
  //         .style("cursor", "grab");
  //     else d3.select(chart).style("cursor", null);
  //     return subject;
  //   }

  //   d3.select(chart)
  //     .on("mousemove", dragSubject)
  //     .call(
  //       d3
  //         .drag()
  //         .subject(dragSubject)
  //         .on("start", () => {
  //           if (subject) {
  //             d3.select(chart).style("cursor", "grabbing");
  //             dx = subject[0] - d3.event.x;
  //             dy = subject[1] - d3.event.y;
  //           }
  //         })
  //         .on("drag", () => {
  //           if (subject) {
  //             subject[0] = d3.event.x + dx;
  //             subject[1] = d3.event.y + dy;
  //           }
  //         })
  //         .on("end", () => {
  //           d3.select(chart).style("cursor", "grab");
  //         })
  //         .on("start.render drag.render end.render", () =>
  //           update(chart, points, lines, draw)
  //         )
  //     );
  // }

  // function update(chart, points, lines, draw) {
  //   d3.select(chart)
  //     .select(".u-path")
  //     .attr("d", draw());

  //   // d3.select(chart)
  //   //   .selectAll(".u-point")
  //   //   .data(points)
  //   //   .join(enter =>
  //   //     enter
  //   //       .append("g")
  //   //       .classed("u-point", true)
  //   //       .call(g => {
  //   //         g.append("circle").attr("r", 3);
  //   //         g.append("text")
  //   //           .text((d, i) => labels[i])
  //   //           .attr("dy", d => (d[1] > 100 ? 15 : -5));
  //   //       })
  //   //   )
  //   //   .attr("transform", d => `translate(${d})`);

  //   d3.select(chart)
  //     .selectAll(".u-line")
  //     .data(lines)
  //     .join("line")
  //     .attr("x1", d => d[0][0])
  //     .attr("y1", d => d[0][1])
  //     .attr("x2", d => d[1][0])
  //     .attr("y2", d => d[1][1])
  //     .classed("u-line", true);
}