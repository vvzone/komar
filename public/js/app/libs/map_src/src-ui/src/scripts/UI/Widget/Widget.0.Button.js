"use strict";
/**
 *
 * @class
 * @extends Gis.BaseClass
 */
Gis.Widget.Button = Gis.BaseClass.extend(
    /**
     * @lends Gis.Widget.Button.prototype
     */
    {
    required: ['className', 'action'],

        /**
         * Допустимые параметры
         * @type {object}
         * @property {Gis.UI.Action} action
         * @property {string} [tag='li']
         * @property {string} [className]
         */
    options: {
        tag: 'li',
        className: undefined,
        title: undefined,
        action: undefined
    },
    getButton: function (container) {
        var span;
        if (!this._node) {
            this._container = container;
            this._node = document.createElement(this.options.tag);
            span = document.createElement("span");
            if (this.options.title) {
                span.title = this.options.title;
            }
            this._node.appendChild(span);
            this._node.className = Gis.Widget.Button.BUTTON_CLASS_NAME + ' ' + this.options.className;
            $(this._node).data('class-name', this.options.className);
            this.options.action.attachToButton(container, this.options.className);
        }
        return this._node;
    },
    getId: function () {
        this._id = this._id || Gis.Util.generateGUID();
        return this._id;
    },
    getAction: function () {
        return this.options.action;
    }
});
Gis.Widget.Button.BUTTON_CLASS_NAME = 'gis-instruments-button';