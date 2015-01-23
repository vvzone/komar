/*
 * L.Icon.Default is the blue marker icon used by default in Leaflet.
 */
"use strict";
L.Icon.Canvas = L.Icon.extend({

    options: {
        iconSize: undefined,
        zIndex: undefined,
        popupAnchor: undefined,
        labelAnchor: undefined,
        clickableClass: ''
    },

    _createImg: function (canvas) {
        var el;

        if (!L.Browser.ie6) {
            el = canvas;
        } else {
            throw new Error('to old browser');
        }
        this.el = el;
        return el;
    },
    setClickable: function (clickable) {
        if (clickable) {
            this.el.setAttribute('class', 'leaflet-zoom-animated leaflet-marker-' + 'icon' + ' ' + (this.options.className || '') + ' ' + this.options.clickableClass);
        } else {
            this.el.setAttribute('class', 'leaflet-zoom-animated leaflet-marker-' + 'icon' + ' ' + (this.options.className || ''));
        }
    },
    _setIconStyles: function (img, name) {
        var options = this.options,
            size = L.point(options[name + 'Size']),
            anchor;

        if (name === 'shadow') {
            anchor = L.point(options.shadowAnchor || options.iconAnchor);
        } else {
            anchor = L.point(options.iconAnchor);
        }

        if (!anchor && size) {
            anchor = size.divideBy(2, true);
        }

        img.setAttribute('class', 'leaflet-zoom-animated leaflet-marker-' + name + ' ' + options.className);

        if (anchor) {
            img.style.marginLeft = (-anchor.x) + 'px';
            img.style.marginTop  = (-anchor.y) + 'px';
        }

        if (size) {
            img.style.width  = size.x + 'px';
            img.style.height = size.y + 'px';
        }
    },
    setStyle: function (style) {
        this.g.setAttribute('style', style);
    },
    getWidth: function () {
        if (this.options.size) {
            return this.options.size.x;
        }
        var width = this.el.width, clientHeight = this.el.height;
        if (width > 0 && clientHeight > 0) {
            this.options.size = L.point(width, clientHeight);
        }
        return width;
    },
    getHeight: function () {
        if (this.options.size) {
            return this.options.size.y;
        }
        var height = this.el.clientHeight, clientWidth = this.el.clientWidth;
        if (height > 0 && clientWidth > 0) {
            this.options.size = L.point(clientWidth, height);
        }
        return height;
    },
    addClass: function (className) {
        className = className && className.trim();
        return this.el && !this.hasClass(className) && this.el.setAttribute('class', (this.el.getAttribute('class') + " " + className).trim());
    },
    hasClass: function (className) {
        return this.el && this.el.getAttribute('class').indexOf(className) >= 0;
    },
    removeClass: function (className) {
        return this.el && this.el.setAttribute('class', (this.el.getAttribute('class').replace(className, '')).trim());
    },
    createShadow: function () {
        return undefined;
    },
    _getIconUrl: function () {
        return this.options.src;
    }
});
