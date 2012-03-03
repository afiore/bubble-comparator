!function () {

  var fill = d3.scale.category10();

  function BubblePanel (element, options) {
    element = element || "#bubbles";
    options = options || {};

    _.defaults(options, {
      width: 960,
      height: 500,
      bubbleClass: 'bubble'
    });

    this.options = options;

    this.vis = d3.select(element).append("svg:svg")
      .attr("width", this.options.width)
      .attr("height", this.options.height);


    this.nodes = null;
  }

  BubblePanel.prototype.render = function (data) {

    var self = this,
        valueExtent = d3.extent(data, function (d) { return d.value }),
        w = this.options.width,
        h = this.options.height,
        r = d3.scale.linear().domain(valueExtent).rangeRound([3,20]);

    this.scales = {
      radius: r
    };

    this.force = d3.layout.force()
        .nodes(data)
        .links([])
        .size([w, h])
        .start();

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

    this.nodes.on("click", function () {
      console.info(this);
    })


    this.force.on("tick", function(e) {
      var k = 6 * e.alpha;
      self.nodes.forEach(function(o, i) {
        o.y += i & 1 ? k : -k;
        o.x += i & 2 ? k : -k;
      });

      self.nodes.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });

  }


  //export BubblePanel into the app namespace
  this.BubblePanel = BubblePanel;

}.call(app)
