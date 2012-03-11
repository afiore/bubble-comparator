!function () {
  'use strict';

  function bootstrap () {
    var records = d3.range(50).map(function (n) { 
      return {
        name: "item_" + n,
        value: Math.floor(Math.random()*10) || 1
      };
    });

    var panel = new BubbleComparator.BubblePanel("#bubbles"),
        comparator = new BubbleComparator.ComparatorPanel();

    panel.on('data:remove', comparator.add.bind(comparator));
    comparator.on('data:remove', panel.add.bind(panel));

    panel.render(records);
  }



  document.addEventListener("DOMContentLoaded", bootstrap, false);

}.call(BubbleComparator);
