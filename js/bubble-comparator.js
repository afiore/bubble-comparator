!function () {
 'use strict';


  var slice = Array.prototype.slice
    , BubbleComparator = {
        // 
        // Mixin function stolen from underscore.js
        //
        extend: function (obj) {
          slice.call(arguments, 1).forEach(function(source) {
            for (var prop in source) {
              obj[prop] = source[prop];
            }
          });
          return obj;
        }
  };


  this.BubbleComparator = BubbleComparator;

}.call(this);


