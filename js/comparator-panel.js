!function () {
  'use strict';

  var methods = {};

  function ComparatorPanel (element, options) {

    element = element || "#comparator";
    options = options || {};

    _.defaults(options, {
      width: 500,
      height: 500,
      startY: 20,
      bubbleClass: 'bubble'
    });

    this.events = {};

    app.Delegator.call(this, element, options);
    app.DataDriven.call(this);

    this.vis = d3.select(element).append("svg:svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height);
  }


  methods.refresh = function () {
    var self = this,
        step = 25,
        startY = 50,
        marginY = 10,
        data = this.data.sort(function (a, b) {
          return d3.descending(a.value, b && b.value);
        }),
        cy = function (d, i) {
          return i * step;
        },
        nodes = this.vis.selectAll("circle.node").data(this.data, function (d) { return d.value; }),
        lastY = 0;

    nodes.order(data);

    nodes.enter().append('svg:circle')
      .attr("class", "node")
      .attr("cx", function(d) { return 100; })
      .attr("r", function (d) { return d.r; })
      .style("fill", function(d, i) { return d.fill })
      .style("stroke", function(d, i) { return '#000'; })
      .style("stroke-width", 1.5);

    nodes.exit().remove();

    nodes.transition().duration(500).attr('cy', function (d, i) {
      return lastY += (d.r * 2) + marginY;
    });

  }
  _.extend(ComparatorPanel.prototype, this.Delegator.prototype, methods);
  _.extend(ComparatorPanel.prototype, this.DataDriven.prototype)

  this.ComparatorPanel = ComparatorPanel;

}.call(app);
