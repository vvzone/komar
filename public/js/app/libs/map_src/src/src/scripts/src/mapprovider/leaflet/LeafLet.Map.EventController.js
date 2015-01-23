/**
 * Adapter for http://leafletjs.com
 */
(function (G) {
    "use strict";
    G.Maps.Leaflet.EventController = {
        _fireEventFromLowLevel: function (e) {
            this.fire(e.type, G.Maps.Leaflet.EventConverter.Convert(e));
        },
        addEventListener: function (types, fn, context) {
            G.Core.Events.addEventListener.call(this, types, fn, context);
            if (this.map) {
                this.map.on(types, this._fireEventFromLowLevel, this);
            } else {
                this._laterAttach = this._laterAttach || [];
                this._laterAttach.push({
                    types: types,
                    fn: fn,
                    context: context
                });
                G.Core.Events.addEventListener.call(this, 'mapattached', this._mapAttached, this);
            }
        },
        on: function (types, fn, context) {
            this.addEventListener(types, fn, context);
        },
        //Добавляет событие к высокоуровнему объекту
        addEventToLayer: function (layer, types) {
            var lowLevelObject = layer.getLowLevelObject(), self = this;
            function addEvent(object) {
                var key, val;
                if (object && typeof object === 'object') {
                    for (key in object) {
                        if (object.hasOwnProperty(key)) {
                            val = object[key];
                            if (val) {
                                if (!val.inset) {
                                    if (val.on) {
                                        val.on(types, self._fireEventFromLowLevel, layer);
                                    }
                                } else {
                                    addEvent(val);
                                }
                            }
                        }
                    }
                }
            }

            if (lowLevelObject) {
                addEvent(lowLevelObject);
            }
        },
        //удаляет событие от высокоуровневого объекта
        removeEventFromLayer: function (layer, types) {
            var lowLevelObject = layer.getLowLevelObject(), val, self = this;
            function removeEvent(object) {
                var key;
                if (object && typeof object === 'object') {
                    for (key in object) {
                        if (object.hasOwnProperty(key)) {
                            val = object[key];
                            if (!object.inset) {
                                val.off(types, self._fireEventFromLowLevel, layer);
                            } else {
                                removeEvent(val);
                            }
                        }
                    }
                }
            }
            removeEvent(lowLevelObject);
        }
    };
}(Gis));