!function () {
  function BubblePanel (element, options) {

    element = element || "#bubbles";
    options = options || {};

    _.defaults(options, {
      width: 500,
      height: 500,
      bubbleClass: 'bubble'
    });

    this.events = {
      "circle click": "onClick"
    };

    app.DataDriven.call(this);
    app.Delegator.call(this, element, options);

    this.vis = d3.select(element).append("svg:svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height)
  }

  var methods = {};

  /**
   *
   * Updates scales and setter functions on the basis of the current data values
   *
   *
   * Returns nothing.
   *
   */

  methods._updateSetters = function () {
    var self = this,
        valueExtent = d3.extent(this.data, function (d) { return d.value });


    this.setters = {
      fill: d3.scale.category10(),
      radius: d3.scale.linear().domain(valueExtent).rangeRound([3,20]),
      charge:
       /**
        * Caculates a bubble's attractive force on the surrounding ones.
        * Nicked from http://vallandingham.me/bubble_charts_in_d3.html
        *
        */
        function (d) {
          var radius = self.setters.radius(d.value);
          // not sure why we square the radius and divide it by 8 here, but it seems to work fine.
          return - Math.pow(radius, 2.0) / 8
        }
    }

    return this;
  }


  /***
   *
   * Configures d3 force directed layout
   *
   *
   */


  methods._setForce = function () {
    var self = this;

    this.force = d3.layout.force()
        .nodes(this.data)
        .charge(this.setters.charge)
        .links([])
        .size([this.options.width, this.options.height])
        .start();

    this.force.on("tick", function(e) {
      if (!self.data.length) return;

      var k = 6 * e.alpha,
          nodes = self.vis.selectAll("circle");

      nodes.forEach(function(o, i) {
        o.y += i & 1 ? k : -k;
        o.x += i & 2 ? k : -k;
      });

      nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });

    return this;
  }

  methods.refresh = function () {
    var self = this,
        w = this.options.width,
        h = this.options.height,
        nodes = this.vis.selectAll('circle').data(this.data, function (d) { return d.name; });

    nodes.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .style("fill", function (d) {
          d.fill = self.setters.fill(d.value);
          return d.fill;
        })
        .style("stroke", function(d, i) { return d3.rgb(self.setters.fill(i & 3)).darker(2); })
        .style("stroke-width", 1.5)
        .call(this.force.drag);


    nodes.transition().duration(500).attr('r', function (d) { 
      d.r = self.setters.radius(d.value); 
      return d.r;
    });

    nodes.exit()
      .transition()
      .duration(500)
      .attr('r', 0)
      .remove();

    return this;
  }


  methods.render = function (data) {
    var self = this;

    this.data = data;
    this._updateSetters();
    if (!this.force) this._setForce(); 

    this.refresh();

  }

  methods.onClick = function (event, d) {
    event.preventDefault();
    this.remove(d);
  }


  // inherits from Delegator and DataDriven, and add methods to the BubblePanel prototype
  _.extend(BubblePanel.prototype, this.DataDriven.prototype);
  _.extend(BubblePanel.prototype, this.Delegator.prototype, methods);


  // export BubblePanel into the app namespace
  this.BubblePanel = BubblePanel;

}.call(app)
