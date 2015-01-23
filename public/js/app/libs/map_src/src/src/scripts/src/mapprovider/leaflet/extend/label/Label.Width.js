"use strict";
// Add in an option to icon that is used to set where the label anchor is
L.Icon.Default.mergeOptions({
    labelAnchor: L.point(9, -20)
});
L.Icon.include(L.Mixin.Events);
L.Icon.include({
    _createImg: function (src) {
        var el,
            self = this;

        if (!L.Browser.ie6) {
            el = document.createElement('img');
            el.src = src;
            if (!this.options.size) {
                el.onload = function () {
                    self._width = el.clientWidth;
                    self._height = el.clientHeight;
                    self.fire('load');
                };
            }
        } else {
            el = document.createElement('div');
            el.style.filter =
                'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
        }
        this.el = el;
        return el;
    },
    getWidth: function () {
        return this.options.size ? this.options.size.x : this._width;
    },
    getHeight: function () {
        return this.options.size ? this.options.size.y : this._height;
    },
    addClass: function (className) {
        if (this.el) {
            L.DomUtil.addClass(this.el, className);
        }
    },
    removeClass: function (className) {
        if (this.el) {
            L.DomUtil.removeClass(this.el, className);
        }
    }
});
