"use strict";
/**
 * @class
 * @classdesc
 * Графическая метка пути
 * @param {Object} options
 * @param {string} [options.tacticObjectType='point'] тип
 * @extends Gis.Objects.ImageLabel
 */
Gis.Objects.PathPoint = Gis.Objects.ImageLabel.extend(
    /** @lends Gis.Objects.PathPoint# */
    {
        events: Gis.Core.Events.availableDomEvents,
        required: ['id', 'latitude', 'longitude'],
        fixed: 'id tacticObjectType',
        _isCountable: false,
        options: {
            tacticObjectType: 'point',
            simplify: null
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'tags',
            'latitude',
            'longitude',
            'icon',
            'caption',
            'customActions',
            'tooltip'
        ],
        _detachFromPrevious: function () {
            if (this._prevPoint) {
                this._prevPoint.off('change delete', this._previousEvent, this);
                this._prevPoint = null;
            }
        },
        _previousEvent: function (e) {
            switch (e.type) {
            case 'remove':
                this._detachFromPrevious();
                this.simplifyPoint();
                this.fire('change');
                break;
            case 'change':
                this.simplifyPoint();
//                this.fire('change');
                break;
            }
        },
        /**
         * точка не должна быть дальше 360 градусов от предыдущей
         */
        simplifyPoint: function () {
            if (this.options.simplify && this._parent) {
                var prev = this._parent.getPoints()[this.getIndex() - 1], startPoint, endPoint;
                if (prev) {
                    if (!this._prevPoint || prev !== this._prevPoint) {
                        this._detachFromPrevious();
                        this._prevPoint = prev;
                        this._prevPoint.on('change delete', this._previousEvent, this);
                    }
                    startPoint = Gis.latLng(prev.getLatLng());
                    endPoint = Gis.latLng(this.options.latitude, this.options.longitude);
                    endPoint = Gis.Projection.getNextBearingPointSimplifiedLongitude(startPoint, endPoint);
                    if (this._parent.isOrthodrome()) {
                        endPoint = Gis.Projection.calculateNextBearingPoint(startPoint, endPoint);
                    }
                    this.options.longitude = endPoint.lng;
                    this.options.latitude = endPoint.lat;
                }
            }
        },

        setData: function (data, val, notFireToServer) {
            var changed = Gis.Objects.ImageLabel.prototype.setData.apply(this, arguments);
            if (changed) {
                this.simplifyPoint();
                if (!notFireToServer && this._map && this._map.getLayer(this.options.parentId) && (changed.indexOf('latitude') > -1 || changed.indexOf('longitude') > -1)) {
                    this._map.getLayer(this.options.parentId).fire('change', {rows: ['points']});
                }
            }
            return changed;
        },
        _dragCalculate: function (event, fireEvent) {
            this._dragged = true;
            this.options.latitude = event.latLng.latitude;
            this.options.longitude = event.latLng.longitude;
            this.simplifyPoint();
            this.fire('change', {
                target: this,
                rows: ['latitude', 'longitude'],
                notFireToServer: !fireEvent
            });
        },
        initialize: function (data) {
            data.id = data.id || Gis.Util.generateGUID();
            Gis.Objects.Selectable.prototype.initialize.call(this, data);
            if (data.icon) {
                this.options.icon = data.icon && Gis.icon(data.icon);
                this._icoUrl = this.options.icon.getImageUrl();
            }
        },
        _getParentIcon: function () {
            var parentIcon = this._map && this.options.parentId && this._map.getLayer(this.options.parentId).getParams().icon;
            this._parentIcon = this._parentIcon || (parentIcon && parentIcon.clone());
            return this._parentIcon;
        },
        /**
         *
         * @return {*}
         */
        getIcon: function () {
            return Gis.Objects.ImageLabel.prototype.getIcon.call(this) || this._getParentIcon();
        },
        preDraw: function () {
            return Gis.Objects.ImageLabel.prototype.preDraw.apply(this, arguments) && this.getIcon();
        },
        hideFromMap: function () {
            if (this._map) {
                this._map.removeLayer(this);
                this._lowLevelObject = null;
            }
        },
        draw: function (map) {
            if (!this.getIcon()) {
                this.hideFromMap();
                return;
            }
            try {
                Gis.Objects.ImageLabel.prototype.draw.apply(this, arguments);
            } catch (e) {
                console.log(e.stack);
            }
        },
        onAdd: function () {
            Gis.Objects.ImageLabel.prototype.onAdd.apply(this, arguments);
            this._parent = this._map.getLayer(this.options.parentId);
            this.simplifyPoint();
            this._parent.on('change', this._parentChange, this);
        },
        onDelete: function () {
            this._detachFromPrevious();
            this._parent.off('change', this._parentChange, this);
            delete this._parent;
            Gis.Objects.ImageLabel.prototype.onDelete.apply(this, arguments);
        },
        preAdd: function (map) {
            this._parent = map.getLayer(this.options.parentId);
            return this._parent;
        },
        _parentChange: function (e) {
            if (e.rows) {
                if (e.rows.indexOf('icon') > -1) {
                    this._parentIcon = undefined;
                    this.fire('change', {notFireToServer: e.notFireToServer});
                } else if (e.rows.indexOf('points') > -1) {
                    this.simplifyPoint();
                    this.fire('change', {notFireToServer: e.notFireToServer});
                }
            }
        },
        setIndex: function (index) {
            this.index = index;
            this._detachFromPrevious();
        },
        getIndex: function () {
            return this.index;
        },
        getOriginalType: function () {
            return 'point';
        }
    }
);
/**
 * Возвращает новый экземпляр Gis.Objects.PathPoint
 * @param {object} data допустимые параметры Gis.Objects.PathPoint.options
 * @returns {Gis.Objects.PathPoint}
 */
Gis.pathPoint = function (data) {
    if (data.getType && data.getType() === 'point') {
        return data;
    }
    return new Gis.Objects.PathPoint(data);
};
Gis.ObjectFactory.list.point = Gis.Objects.PathPoint;