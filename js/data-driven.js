! function () {
  'use strict';

  function withRefresh (callback, d, refresh) {
    refresh = refresh || true;
    callback.call(this);
    if (refresh && "refresh" in this !== false) this.refresh();
  }


  function DataDriven () {
    this.data = [];
  }

  DataDriven.prototype._identity = function (b) {
    var attribute = this._identityAttribute;

    return function (a) {
      return a[attribute] === b[attribute];
    }
  };

  DataDriven.prototype._identityAttribute = 'name';

  DataDriven.prototype.add = function (d, refresh) {
    withRefresh.call(this, function () {
      this.data.push(d);
    }, refresh);
  }

  DataDriven.prototype.remove = function (d, refresh) {
    withRefresh.call(this, function () {
      this.data = _.reject(this.data, this._identity(d));
    }, refresh);
  }

  DataDriven.prototype.setIdentity = function (arg) {
    if (typeof arg === 'function') {
      this._identity = arg;
    } else {
      this.identityAttribute = arg;
    }
  }

  this.DataDriven = DataDriven;
}.call(app);
