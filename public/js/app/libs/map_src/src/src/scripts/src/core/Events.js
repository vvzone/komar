"use strict";
var key = '_gis_events';

/**
 *
 * @namespace Gis.Core
 */
Gis.Core = {};

/**
 * Система подключения событий
 * Унаследована от Leaflet
 * @type {Object}
 */
Gis.Core.Events = {
    availableDomEvents: 'drag contextmenu dragstart dragend click dblclick keydown keypress keyup',
    eventsKey: key,

    /**
     * Подключить слушателя событий
     * @alias Gis.Core.Events.on
     * @param {string | object} types типы событий
     * @param {Function} fn калбэк
     * @param {object} [context] контекст выполнения
     * @returns {*}
     */
    addEventListener: function (types, fn, context) {
        var events = this[key] = this[key] || {}, type, i, len;

        // Types can be a map of types/handlers
        if (typeof types === 'object') {
            for (type in types) {
                if (types.hasOwnProperty(type)) {
                    this.addEventListener(type, types[type], fn);
                }
            }

            return this;
        }

        types = Gis.Util.splitWords(types);

        for (i = 0, len = types.length; i < len; i += 1) {
            events[types[i]] = events[types[i]] || [];
            events[types[i]].push({
                action: fn,
                context: context || this
            });
        }

        return this;
    },

    /**
     * Проверить наличие слушателя событий
     * @param {string} type
     * @returns {boolean}
     */
    hasEventListeners: function (type) {
        return this[key] && this[key][type] && this[key][type].length > 0;
    },

    /**
     * Удалить слушателя событий
     * @alias Gis.Core.Events.off
     * @param {string | object} types типы событий
     * @param {Function} fn калбэк
     * @param {object} [context] контекст выполнения
     * @returns {*}
     */
    removeEventListener: function (types, fn, context) {
        var events = this[key], type, i, len, listeners, j;

        if (typeof types === 'object') {
            for (type in types) {
                if (types.hasOwnProperty(type)) {
                    this.removeEventListener(type, types[type], fn);
                }
            }

            return this;
        }

        types = Gis.Util.splitWords(types);

        for (i = 0, len = types.length; i < len; i += 1) {

            if (this.hasEventListeners(types[i])) {
                listeners = events[types[i]];

                for (j = listeners.length - 1; j >= 0; j -= 1) {
                    if (
                        (!fn || listeners[j].action === fn) &&
                            (!context || (listeners[j].context === context))
                    ) {
                        listeners.splice(j, 1);
                    }
                }
            }
        }

        return this;
    },
    /**
     * Бросить событие
     * @alias Gis.Core.Events.fire
     * @param {string} type
     * @param {object} data данные, для передачи слушателю
     * @returns {*}
     */
    fireEvent: function (type, data) {
        if (!this.hasEventListeners(type)) {
            return this;
        }

        var event = Gis.Util.extend({
            type: type,
            target: this
        }, data), listeners, i, len;

        listeners = this[key][type].slice();

        for (i = 0, len = listeners.length; i < len; i += 1) {
            listeners[i].action.call(listeners[i].context || this, event);
        }

        return this;
    }
};

Gis.Core.Events.on = Gis.Core.Events.addEventListener;
Gis.Core.Events.off = Gis.Core.Events.removeEventListener;
Gis.Core.Events.fire = Gis.Core.Events.fireEvent;