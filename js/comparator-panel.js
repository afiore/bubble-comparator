!function () {
  'use strict';

  function ComparatorPanel (element, options) {

    element = element || "#comparator";
    options = options || {};

    _.defaults(options, {
      width: 1000,
      height: 500,
      bubbleClass: 'bubble'
    });

    this.options = options;
    this.data = [];

    this.vis = d3.select(element).append("svg:svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height);

  }


  ComparatorPanel.prototype.refresh = function (datum) {
    this.data.push(datum);
    this._render();
  }

  ComparatorPanel.prototype._render = function () {
    var y = function (d) {
      d
    }

    this.nodes = this.vis.selectAll("circle.node")
      .data(this.data)
      .enter().append("svg:circle")
      .attr("class", "node")
      .attr("cx", function(d) { return 100; })
      .attr("cy", function (d, i) { return y(i); })
      .attr("r", function (d) { return d.r; })
      .style("fill", function(d, i) { return d.fill })
      .style("stroke", function(d, i) { return '#000'; })
      .style("stroke-width", 1.5)
  }

  this.ComparatorPanel = ComparatorPanel;

}.call(app)
