import {
    convert_json
} from "./converter.js";
import {
    hover,
    onExitNode
} from "./hover.js";
//define layout constraints
let margin = ({
    top: 10,
    right: 120,
    bottom: 10,
    left: 40
})

let width = 2000;
let dy = width / 10;
let dx = 20;

let tree = d3.tree().nodeSize([dx, dy])
let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)

const root = d3.hierarchy(convert_json());

root.x0 = dy / 2;
root.y0 = 0;
root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
});

const visualization = d3.select("#viz")
    .append("svg")
    .attr("viewBox", [-margin.left, -margin.top, width, dx])
    .style("font", "10px sans-serif")
    .style("user-select", "none")
    .call(d3.zoom().on("zoom", function () {
        visualization.attr("transform", d3.event.transform)
    }));


// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents


const gLink = visualization.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5);

const gNode = visualization.append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all");

function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = visualization.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => visualization.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
        .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .attr("class", "node")
        .on("click", d => {
            d.children = d.children ? null : d._children;
            update(d);
        })
        .on("mouseover", d => hover(d))
        .on("mouseout", onExitNode());


    nodeEnter.append("circle")
        .attr("r", 3.5)
        .attr("class", "circle")
        .attr("class", d => d._children ? "circle_hasChildren" : "circle_hasNoChildren")


    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("class", d => d._children ? "text_hasChildren" : "text_hasNoChildren")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links
    const link = gLink.selectAll("path")
        .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
            const o = {
                x: source.x0,
                y: source.y0
            };
            return diagonal({
                source: o,
                target: o
            });
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
            const o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });

}


update(root);
visualization.node();

