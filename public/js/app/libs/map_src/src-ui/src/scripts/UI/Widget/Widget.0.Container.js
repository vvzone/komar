"use strict";
Gis.Widget.TYPE.CONTAINER = 1;
/**
 *
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.Container = Gis.Widget.Base.extend(
    /**
     * @lends Gis.Widget.Container.prototype
     */
    {
        _className: '',
        includes: Gis.Widget.ContainerBehavior,
        _$container: null,
        _type: Gis.Widget.TYPE.CONTAINER,
        options: {
            width: null,
            height: null
        },
        getNeedSize: function (onlyHeight) {
            var currWidth = 0, currHeight = 0, size;
            this.child.forEach(function (child) {
                size = child.getNeedSize();
                if (onlyHeight) {
                    currWidth = size[0];
                } else {
                    currWidth += size[0];
                }
                currHeight += size[1];
            });
            return [currWidth + this._$container.outerWidth(true) - this._$container.width(), currHeight + this._$container.outerHeight(true) - this._$container.height()];
        },
        initializeHTMLcontainer: function () {
            this._$container = $('<div style="position: relative;" class="' + Gis.Widget.Base.CLASS_NAME + ' ' + Gis.Widget.Container.CLASS_NAME + ' ' + this._className + '"><div class="dragger"><div></div></div>');
        },
        initialize: function (data) {
            Gis.Widget.Base.prototype.initialize.call(this, data);
            this.child = [];
            this.initializeHTMLcontainer();
        },
        onAdd: function (ui) {
            this._ui = ui;
        },
        getUIAttached: function () {
            return this._ui;
        },
        draw: function (container, bounds) {
            $(container).append(this._$container);
            this.swapVisible();
        },

        getContainer: function () {
            return this._$container[0];
        },
        getAvailableWidth: function () {
            var currWidth = this.getWidth();
            this.child.forEach(function (child) {
                currWidth -= $(child).width();
            });
        },
        getAvailableHeight: function () {
            var height = this.getHeight();
            this.child.forEach(function (child) {
                height -= $(child).height();
            });
        },
        getWidth: function () {
            return this._ui.getAvailableContainerBounds(this.options.position).width;
        },
        getHeight: function () {
            return this._ui.getAvailableContainerBounds(this.options.position).height;
        },

        addTo: function (ui) {
            ui.addContainer(this);
        }
    });

Gis.Widget.Container.CLASS_NAME = 'gis-widget-container';

Gis.Widget.container = function (data) {
    return new Gis.Widget.Container(data);
};
