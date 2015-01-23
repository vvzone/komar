/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    var convert = function (event) {
        var convertedEvent = event;
        switch (event.type) {
        case 'click':
        case 'mouseout':
        case 'dblclick':
        case 'mouseover':
        case 'mousedown':
        case 'contextmenu':
            convertedEvent = G.Maps.Leaflet.EventConverter._mouseEvent(event);
            break;
        case 'drag':
        case 'dragstart':
        case 'dragend':
            convertedEvent = G.Maps.Leaflet.EventConverter._latlngEvent(event);
            break;
        }
        return convertedEvent;
    };
    G.Maps.Leaflet = G.Maps.Leaflet || {};
    G.Maps.Leaflet.EventConverter = {
        _event: function (leafletEvent) {
            return {
                type: leafletEvent.type,
                target: leafletEvent.target
            };
        },
        _mouseEvent: function (leafletEvent) {
            return G.Util.extend(this._latlngEvent(leafletEvent), {
                originalEvent: leafletEvent.originalEvent
            });
        },
        _latlngEvent: function (leafletEvent) {
            var lng = leafletEvent.latlng || leafletEvent.latLng,
                latLngs = {},
                latSeted,
                lngSeted;
            latSeted = lng && (lng.lat !== undefined || lng.latitude !== undefined);
            lngSeted = lng && (lng.lng !== undefined || lng.longitude !== undefined);
            try {
                latLngs.latitude = latSeted ? (lng.lat !== undefined ? lng.lat : lng.latitude)
                    : leafletEvent.target.getLatLng().lat;
                latLngs.longitude = lngSeted ? (lng.lng !== undefined ? lng.lng : lng.longitude)
                    : leafletEvent.target.getLatLng().lng;
            } catch (e) {
                console.log(e);
            }
            return G.Util.extend(this._event(leafletEvent), {
                latLng: latLngs
            });
        },
        setEvents: function (events, object) {
            var callback, context;
            if (events) {
                callback = events.callback;
                context = events.context || this;
                context._TEMP_FUNC = context._TEMP_FUNC || {};
                context._TEMP_FUNC[object] = function (event) {
                    callback.call(context || this, convert(event));
                };
                if (callback && events.type) {
                    object.on(events.type, context._TEMP_FUNC[object], context);
                }
            }
        },
        deleteEvents: function (events, object) {
            var context;
            context = events.context || this;
            if (context._TEMP_FUNC[object]) {
                if (events.type) {
                    object.off(events.type, context._TEMP_FUNC[object], context);
                }
                delete context._TEMP_FUNC[object];
            }
        },
        /**
         * convert leaflet event to base G events
         * */
        Convert: convert
    };
}(Gis));
