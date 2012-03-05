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
    var self = this;

    var closure = function () {
      self[functionName].apply(self, arguments);
    };


    this.element.addEventListener(eventName, function (event) {
      // map is needed here as querySelectorAll does not return an actual Array instance but a nodeList (which does not respond to the indexOf method).
      var selection = selector && _.map(self.element.querySelectorAll(selector), function (node) { return node; }) || [self.element];

      if (selection.indexOf(event.target) > -1) {
        closure(event, getDatum(event.target));
      }
    });
  }

  this.Delegator = Delegator;

}.call(app);
