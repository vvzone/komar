"use strict";
/**
 * @class
 * @classdesc
 * Графическая метка
 * @param {Object} options
 * @param {number} options.latitude широта
 * @param {number} options.longitude долгота
 * @param {Gis.Additional.Icon} options.icon
 * @param {boolean} [options.draggable=false]
 * @param {string} [options.tacticObjectType='image'] тип
 * @param {string} [options.position='center'] точка привязки [topleft, topcenter, topright, centerleft, center, centerright, bottomleft, bottomcenter, bottomright]
 * @param {string} [options.captionPosition='bottomcenter'] положение подписи относительно иконки [topleft, topcenter, topright, centerleft, center, centerright, bottomleft, bottomcenter, bottomright]
 * @param {string} [options.className] имя класса HTMLElement
 * @param {number} [options.angle=0] угол поворота от вертикальной оси по часовой стрелке
 * @example Стандартная иконка
 * var a = Gis.imageLabel({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      icon: {type: 'plane', color: 'red'},
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption",
     *      angle: 45
     * }).addTo(gisMap);
 * @example Настраиваемая иконка
 * var a = Gis.imageLabel({
     *      selectable: true,
     *      id: Gis.U,
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      icon: {type: 'custom', image: {fullPath: "http://upload.wikimedia.org/wikipedia/en/b/bc/", hash: "Wiki.png"}},
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption",
     *      angle: 45
     * }).addTo(gisMap);
 * @extends Gis.Objects.Selectable
 */
Gis.Objects.ImageLabel = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.ImageLabel# */
    {
        events: Gis.Core.Events.availableDomEvents,
        required: ['id', 'latitude', 'longitude', 'icon'],
        fixed: 'id tacticObjectType',
        options: {
            tacticObjectType: 'image',
            id: undefined,
            latitude: undefined,
            longitude: undefined,
            selectable: undefined,
            draggable: undefined,
            icon: undefined,
            //UNOFICIAL
            position: 'center',
            captionPosition: 'centerright',
            className: undefined,
            angle: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'tags',
            'latitude',
            'longitude',
            'selectable',
            'draggable',
            'icon',
            'name',
            'caption',
            'customActions',
            'tooltip'
        ],
        /**
         * @override
         * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
         */
        setData: function (data, val, notFireToServer) {
            var oldIco = this.getIcon() && this.getIcon().clone(), result;
            val = this._fillOption(data, val, 'icon', Gis.icon);
            result = Gis.Objects.Selectable.prototype.setData.call(this, data, val, notFireToServer);
            if (result && this.options.icon) {
                this._icoUrl = this.getIcon().getImageUrl();
                this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
            }
            return result;
        },
        getOriginalType: function () {
            return 'image';
        },
        /**
         *
         * @return {string}
         */
        getImageType: function () {
            return this.getIcon().getType();
        },
        /**
         *
         * @return {tring}
         */
        getImageColor: function () {
            return this.getIcon().getColor();
        },
        /**
         *
         * @return {boolean|undefined}
         */
        isDraggable: function () {
            return this.options.draggable;
        },
        /**
         *
         * @return {string}
         */
        getPopup: function () {
            return this.options.tooltip;
        },
        initialize: function (data) {
            if (data.icon) {
                data.icon = Gis.icon(data.icon);
            }
            Gis.Objects.Selectable.prototype.initialize.call(this, data);
            this.options.icon = data.icon  && Gis.icon(data.icon);
            this._icoUrl = this.options.icon.getImageUrl();
        },

        _isPredefinedType: function () {
            return Gis.Objects.ImageLabel.types.indexOf(this.options.icon.type) >= 0;
        },
        _onDrag: function (event) {
            this._dragCalculate(event, false);
        },
        _dragCalculate: function (event, fireEvent) {
            this._dragged = true;
            this.options.latitude = event.latLng.latitude;
            this.options.longitude = event.latLng.longitude;
            this.fire('change', {
                target: this,
                rows: ['latitude', 'longitude'],
                notFireToServer: !fireEvent
            });
        },
        _onDragEnd: function (event) {
            this._dragCalculate(event, true);
        },
        onAdd: function (map) {
            Gis.Objects.Selectable.prototype.onAdd.call(this, map);
            this.on("drag", this._onDrag, this);
            this.on("dragend", this._onDragEnd, this);
            this.on("sizechange", this._onSizeChange, this);
        },
        onDelete: function (e) {
            Gis.Objects.Selectable.prototype.onDelete.call(this, e);
            this.off("drag", this._onDrag, this);
            this.off("dragend", this._onDragEnd, this);
            this.off("sizechange", this._onSizeChange, this);
            delete this._icoUrl;
        },
        _onSizeChange: function (event) {
            this._width = event.width;
            this._height = event.height;
        },
        getIcon: function () {
            return this.getOption('icon') && Gis.icon(this.getOption('icon'));
        },
        getIcoUrl: function () {
            return this._icoUrl || (this.getIcon() && this.getIcon().getImageUrl());
        },
        draw: function (map) {
            var icon, angle, options;
            if (!this.preDraw()) {
                return;
            }
            Gis.Objects.Selectable.prototype.draw.call(this, map);
            if (Gis.Util.isNumeric(this.options.latitude) && Gis.Util.isNumeric(this.options.longitude)) {
                icon = this.getIcon();
                options = this.getOptionsWithStyle();
                angle = icon.isRotatable() ? this.getOption('angle') : 0;
                this._lowLevelObject = map.drawMarker({
                    latlng: [options.latitude, options.longitude],
                    selectable: options.selectable && this.isThisEventable(),
                    selected: this._selected,
                    draggable: options.draggable && this.isThisEventable(),
                    position: options.position,
                    angle: angle,
                    popup: this.getOption('tooltip'),
                    caption: this.getOption('caption'),
                    captionPosition: options.captionPosition,
                    gisClass: Gis.Config.imageLabelClass,
                    className: options.className || '',
                    icon: icon,
                    iconUrl: this.getIcoUrl(),
                    //throw available events to top api
                    events: {
                        type: this.events,
                        callback: this.fireEventsFromLowLevel,
                        context: this
                    }
                }, this._lowLevelObject);
            }
        },
        getLatLng: function () {
            return [this.options.latitude, this.options.longitude];
        },
        /**
         *
         * @return {Gis.LatLngBounds|undefined}
         */
        getCurrentLatLngBounds: function () {
            if (this._lowLevelObject && this._lowLevelObject.marker) {
                return this._map.getObjectBounds(this._lowLevelObject.marker);
            }
        },
        /**
         *
         * @return {Gis.LatLngBounds}
         */
        getLatLngBounds: function () {
            return Gis.latLngBounds(this.getLatLng(), this.getLatLng());
        }
    }
);
/**
 * Возвращает новый экземпляр Gis.Objects.ImageLabel
 * @param {object} data допустимые параметры Gis.Objects.ImageLabel.options
 * @returns {Gis.Objects.ImageLabel}
 */
Gis.imageLabel = function (data) {
    return new Gis.Objects.ImageLabel(data);
};
Gis.ObjectFactory.list.image = Gis.Objects.ImageLabel;