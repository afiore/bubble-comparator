!function () {
  'use strict';

  function getDatum (element) {
    return element.__data__;
  }

  function Delegator (element, options) {
    this.element = (typeof element === 'string')? document.querySelector(element) : element;
    this.options = options || {};
    this._bindEvents();
  }

  Delegator.prototype._bindEvents = function () {
    if ("events" in this === false) return;

    for (var key in this.events) {
      var functionName = this.events[key],
          chunks = key.split(" "),
          event  = chunks.pop(),
          selector = chunks.join(" ");

      this._bindEvent(selector, event, functionName);
    }
  }

  Delegator.prototype._bindEvent = function (selector, eventName, functionName) {
    var self = this,
        closure = function () {
          self[functionName].apply(self, arguments);
        },
        toArray = function (nodeList) {
          var list = [];
          for (var i=0; i < nodeList.length; i++) {
            list.push(nodeList[i]);
          }
          return list;
        }


    this.element.addEventListener(eventName, function (event) {
      // map is needed here as querySelectorAll does not return an actual Array instance but a nodeList (which does not respond to the indexOf method).
      var selection = selector && toArray(self.element.querySelectorAll(selector)) || [self.element];

      if (selection.indexOf(event.target) > -1) {
        closure(event, getDatum(event.target));
      }
    });
  }

  this.Delegator = Delegator;

}.call(BubbleComparator);
