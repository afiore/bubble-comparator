!function () {
  'use strict';

  function ComparatorPanel (element, options) {

    element = element || "comparator";
    options = options || {};

    _.defaults(options, {
      width: 960,
      height: 500,
      bubbleClass: 'bubble'
    });

    this.options = options;
  }

  ComparatorPanel.prototype.render = function (data) {

    this.nodes = this.vis.selectAll("circle.node")
        .data(data)
        .enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function (d) { return r(d.value); })
        .style("fill", function(d, i) { return fill(i & 3); })
        .style("stroke", function(d, i) { return d3.rgb(fill(i & 3)).darker(2); })
        .style("stroke-width", 1.5)
        .call(this.force.drag)
  }

}.call(app)
