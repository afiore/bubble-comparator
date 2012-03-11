!function () {
  'use strict';

  var methods = {};

  function ComparatorPanel (element, options) {

    element = element || "#comparator";
    options = options || {};

    options = BubbleComparator.extend({
      width: 250,
      height: 500,
      startY: 20,
      bubbleClass: 'bubble'
    }, options);

    this.events = {
      'circle click': 'onClick'
    };

    BubbleComparator.Delegator.call(this, element, options);
    BubbleComparator.DataDriven.call(this);

    this.vis = d3.select(element).append("svg:svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height);
  }


  methods.onClick = function (event, d) {
    event.preventDefault();
    this.remove(d);
  };

  methods.refresh = function () {
    var self = this,
        stepY = 25,
        maxX = this.options.width,
        maxY = this.options.height,
        data = this.data.sort(function (a, b) {
          return d3.descending(a.value, b && b.value);
        }),
        startY = 50,
        marginY = 10,
        marginX = 10,
        nodes = this.vis.selectAll("circle.node").data(this.data, function (d) { return d.value; }),
        lastY = maxY / 2,
        lastX = 0;

    nodes.order(data);

    nodes.enter().append('svg:circle')
      .attr("class", "node")
      .attr("r", function (d) { return d.r; })
      .style("fill", function(d, i) { return d.fill })
      .style("stroke", function(d, i) { return '#000'; })
      .style("stroke-width", 1.5);


    nodes.exit()
      .transition()
      .duration(500)
      .attr('r', 0)
      .remove();

    nodes.transition().duration(500)
      .attr('cx', function (d, i) {
        var step = (d.r * 2) + marginY,
            cx = lastX = lastX + step;

        // reset the value of x when it becomes 
        // greater than the viewport width
        if (cx + d.r >= maxX ) {
          cx = lastX = step;
          lastY += d3.max(data, function (d) { return d.r * 2; }) + marginY;
        }
        return cx;
      })
      .attr("cy", function(d) { 
        return lastY;
      })

  }
  this.extend(ComparatorPanel.prototype, this.Delegator.prototype, methods);
  this.extend(ComparatorPanel.prototype, this.DataDriven.prototype)

  this.ComparatorPanel = ComparatorPanel;

}.call(BubbleComparator);
