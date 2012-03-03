!function () {
  'use strict';

  function bootstrap () {
    var records = d3.range(100).map(function (n) { 
      return {
        name: "item_" + n,
        value: Math.floor(Math.random()*10) || 1
      };
    });

    var panel = new app.BubblePanel();

    panel.render(records);
  }



  document.addEventListener("DOMContentLoaded", bootstrap)

}.call(window.app);
