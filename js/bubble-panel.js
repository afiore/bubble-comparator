!function () {
  function BubblePanel (element, options) {
    element = element || "#bubbles";
    options = options || {};

    _.defaults(options, {
      width: 1000,
      height: 500,
      bubbleClass: 'bubble'
    });

    this.options = options;

    this.vis = d3.select(element).append("svg:svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height)
      .append("g")
        .attr("transform", 'translate(-' + (this.options.width/3) + ')');

    this.nodes = null;
  }

  /**
   *
   * Updates scales and setter functions on the basis of the current data values
   *
   *
   * Returns nothing.
   *
   */

  BubblePanel.prototype._updateSetters = function () {
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


  BubblePanel.prototype._setForce = function () {
    var self = this;

    this.force = d3.layout.force()
        .nodes(this.data)
        .charge(this.setters.charge)
        .links([])
        .size([this.options.width, this.options.height])
        .start();

    this.force.on("tick", function(e) {
      if (!self.nodes) return;

      var k = 6 * e.alpha;

      self.nodes.forEach(function(o, i) {
        o.y += i & 1 ? k : -k;
        o.x += i & 2 ? k : -k;
      });

      self.nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });

    return this;
  }


  BubblePanel.prototype.refresh = function () {
    var self = this,
        w = this.options.width,
        h = this.options.height;

    this.nodes = this.vis.selectAll("circle.node")
        .data(this.data)
        .enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r",  function (d) { 
          return self.setters.radius(d.value); 
        })
        .style("fill", function (d) {
          return self.setters.fill(d.value);
        })
        .style("stroke", function(d, i) { return d3.rgb(self.setters.fill(i & 3)).darker(2); })
        .style("stroke-width", 1.5)
        .call(this.force.drag);

    return this;
  }


  BubblePanel.prototype.render = function (data) {
    var self = this;

    this.data = data;
    this._updateSetters();
    if (!this.force) this._setForce(); 
    this.refresh();

    this.nodes.on("click", function (d) {
      self.force.stop()
      var selected = self.nodes.filter(function (dd) { 
        return dd === d; 

      }).transition().
        duration(500).
        attr("cx", function (d) {
          return self.options.width;
        });
    });

  }


  //export BubblePanel into the app namespace
  this.BubblePanel = BubblePanel;

}.call(app)
