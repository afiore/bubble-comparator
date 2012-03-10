!function () {
  'use strict';

  function bootstrap () {
    var records = d3.range(50).map(function (n) { 
      return {
        name: "item_" + n,
        value: Math.floor(Math.random()*10) || 1
      };
    });

    var comparator = new app.ComparatorPanel(),
        panel = new app.BubblePanel("#bubbles", {comparator: comparator});

    panel.render(records);
    window.panel = panel;
  }



  document.addEventListener("DOMContentLoaded", bootstrap, false);

}.call(window.app);
