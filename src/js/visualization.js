import {
    convert_json
} from "./converter.js";
/*
const root = d3.hierarchy(convert_json());

let dy = 160;
let dx = 10;
root.x0 = dy / 2;
root.y0 = 0;
let margin = ({
    top: 10,
    right: 120,
    bottom: 10,
    left: 40
});
let tree = d3.tree().nodeSize([dx, dy]);
let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

root.x0 = dy / 2;
root.y0 = 0;

root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
});

let x0 = Infinity;
let x1 = -x0;
root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
});*/
let width = 954;

let tree = data => {
    const root = d3.hierarchy(data);
    root.dx = 35;
    root.dy = width / (root.height + 1);
    return d3.tree().nodeSize([root.dx, root.dy])(root);
}

const root = tree(convert_json());

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });


const visualization = d3.select("#viz")
    .append("svg")
    .attr('width', '100%')
    .attr('height', '1000')

console.log(root.dx);

const g = visualization.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
    .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 2)
    .selectAll("path")
    .data(root.links())
    .enter().append('path')
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

const node = g.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .enter().append('g')
    .attr("transform", d => `translate(${d.y},${d.x})`);

node.append("circle")
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 2.5);

node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .clone(true).lower()
    .attr("stroke", "white");

visualization.node();


/*

*/
/*
visualization.append("defs").html(`
<style>
.highlight circle { fill:blue }
.highlight text { fill:blue }
.leaf circle { fill:green }
.leaf text { fill:green }
path.highlight { stroke:blue }
<style>`);
*/