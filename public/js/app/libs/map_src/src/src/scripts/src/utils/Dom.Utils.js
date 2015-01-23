/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    var prefix = '_gis_';
    G.DomUtil = {
        getStyle: function (element, style) {
            var computedStyle;
            computedStyle = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
            return computedStyle[style] || '';
        },
        prepend: function (parent, element) {
            if (parent.firstChild) {
                parent.insertBefore(element, parent.firstChild);
            } else {
                parent.appendChild(element);
            }
        },
        isCssTransform: function () {
            return Modernizr && (Modernizr.csstransforms3d || Modernizr.csstransforms);
        },
        isCssTransform3d: function () {
            return Modernizr && Modernizr.csstransforms3d;
        },
        prefixes: function (property) {
            return (Modernizr && Modernizr.prefixed(property)) || property;
        },
        getPosition: function (domElement) {
            if (domElement) {
                return {
                    left: domElement[prefix + 'left'],
                    top: domElement[prefix + 'top']
                };
            }
        },
        attachValue: function (domElement, key ,value) {
            if (domElement) {
                domElement[prefix + key] = value;
            }
            return this;
        }
    };
}(Gis));