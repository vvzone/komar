"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.ZoomProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.ZoomProperty.prototype
     */
    {
        _type: 'zoom',
        includes: Gis.Widget.ZoomBehavior,
        options: {
            needCheckLayers: false
        },
        _history: [],
        _updateHistory: function (data) {
//            this._history.push({
//                zoom: data && (data.zoom || this._containerController.getUIAttached().getMap().getZoom()),
//                center: data && (data.center || this._containerController.getUIAttached().getMap().getCenter())
//            });
            this._updateButtonState();
        },
        back: function () {
            var map = this._containerController.getUIAttached().getMap(), dataHistory;
            if (!this._isStateChanged()) {
                dataHistory = this._history.pop();
                if (dataHistory) {
                    this.setZoomAndCenter(dataHistory.zoom, dataHistory.center);
                    this._setData(dataHistory.zoom, dataHistory.center);
                }
            } else {
                this.revertHtmlPointSelectorWidgetData(this._$CoordinateContainer);
                this._list.setValueSelected(map.getZoom());
                this._newZoom = map.getZoom();
            }
            this._updateButtonState();
        },
        setZoomAndCenter: function (zoom, center) {
            var map = this._containerController.getUIAttached().getMap();
            if (Gis.Util.isNumeric(zoom) && zoom !== map.getZoom()) {
                map.setZoom(zoom);
                this._centerToSet = center;
            } else {
                this._centerToSet = null;
                map.setCenter(center, true);
            }
        },
        _updateCenter: function () {
            var x, y, latlng, map, point = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));
            x = point.x;
            y = point.y;
            if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y)) {
                latlng = Gis.latLng(y, x);
                map = this._containerController.getUIAttached().getMap();
                this._updateHistory({center: map.getCenter(), zoom: map.getZoom()});
                this.setZoomAndCenter(this._newZoom, latlng);
            } else {
                Gis.Logger.log('ERROR UPDATE CENTER', "x = " + x + " | y = " + y);
            }
        },
        _setNewZoom: function (zoomVal) {
            this._updateHistory({zoom: this._containerController.getUIAttached().getMap().getZoom()});
            this._containerController.getUIAttached().getMap().setZoom(zoomVal);
        },
        zoomSelected: function (zoomVal) {
            this._newZoom = parseFloat(zoomVal);
            this._updateButtonState();
        },
        _setData: function (zoom, center) {
            var x, y;
            center = this.coordinateToTemplate(center || this._containerController.getUIAttached().getMap().getCenter());
            zoom = zoom || this._containerController.getUIAttached().getMap().getZoom();
            x = center.x || '';
            y = center.y || '';
            this._newZoom = zoom;
            this._list.setValueSelected(zoom);
            this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
        },
        updateData: function (e) {
            if (e && e.type === 'zoomend' && this._centerToSet) {
                this.setZoomAndCenter(null, this._centerToSet);
            }
            this._setData();
            this._updateButtonState();
        },
        _initZoomList: function () {
            var defZoom = this.getConvertedZoom();
            this._list = Gis.HTML.listView({
                data: this._getZoomValues(),
                container: $('#zoom-selector', this._$div)[0],
                callback: this.zoomSelected,
                context: this,
                defaultValue: {val: this._containerController.getUIAttached().getMap().getZoom(), name: defZoom}
            });
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.ZoomProperty.CLASS_NAME);
            this._$Xrow = $('#zoom-x', this._$div);
            this._$CoordinateContainer = $('#center-selector', this._$div);
            this._$Yrow = $('#zoom-y', this._$div);
            this._initZoomList();
            this._setData();
        },
        initDataBlock: function () {
            var center = this.coordinateToTemplate(this._containerController.getUIAttached().getMap().getCenter()),
                x = center.x || '',
                y = center.y || '';
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Текущие координаты центра</div>\n" +
                "<div id='center-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ul class='inline-points'>\n" +
                this._HTMLPointSelectorWidget({
                    tag: 'li',
                    tagClass: 'data-coll',
                    x: x,
                    y: y,
                    xID: 'zoom-x',
                    yID: 'zoom-y',
                    yClass: 'zoom-input',
                    xClass: 'zoom-input'
                }) +
                "</ul>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='zoom-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Текущий масштаб</div>\n" +
                "<div id='zoom-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>\n" +
                "</div>\n" +
                "</div>\n";
        },
        initButtonsBlock: function () {
            return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                "<ul class='gis-property-buttons-list'>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Перейти') + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                "</ul>\n" +
                "</div>\n";
        },

        _mapClicked: function () {
        },
        _isStateChanged: function () {
            var xRowChanged, yRowChanged, changed;
            xRowChanged = this._rowChanged(this._$Xrow);
            yRowChanged = this._rowChanged(this._$Yrow);
            changed = (xRowChanged || yRowChanged) ? Gis.Widget.ZoomProperty.CENTER_CHANGED : Gis.Widget.ZoomProperty.NOT_CHANGED;
            changed = this._containerController.getUIAttached().getMap().getZoom() !== this._newZoom ?
                changed ? Gis.Widget.ZoomProperty.BOTH_CHANGED : Gis.Widget.ZoomProperty.ZOOM_CHANGED :
                changed;
            return changed;
        },
        _updateButtonState: function () {
            var isStateChanged = this._isStateChanged();
            this.switchButtonState($('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div), this._history.length || isStateChanged);
            this.switchButtonState($('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div), isStateChanged);
            if (isStateChanged === Gis.Widget.ZoomProperty.BOTH_CHANGED || isStateChanged === Gis.Widget.ZoomProperty.CENTER_CHANGED) {
                $('#center-title', this._$div).html('Новые координаты центра');
            } else {
                $('#center-title', this._$div).html('Текущие координаты центра');
            }
            if (isStateChanged === Gis.Widget.ZoomProperty.BOTH_CHANGED || isStateChanged === Gis.Widget.ZoomProperty.ZOOM_CHANGED) {
                $('#zoom-title', this._$div).html('Новый масштаб');
            } else {
                $('#zoom-title', this._$div).html('Текущий масштаб');
            }
        },
        _deInitEvents: function () {
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
            var map = this._containerController.getUIAttached().getMap();
            map.off('zoomend moveend', this.updateData, this);
            map.off('tilelayerchanged', this._initZoomList, this);
            $('.data-row input', this._$div).off({
                keypress: this._keyupUpdateFunction,
                change: this._inputChange
            });
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
                click: this._updateStateFunc,
                keypress: this._keyupUpdateFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
                click: this._revertFunc,
                keypress: this._keyupRevertFunction
            });
        },
        _initEvents: function () {
            var self = this, map;
            Gis.Widget.Propertys.prototype._initEvents.call(this);
            this._updateStateFunc = this._updateStateFunc || function () {
                if (self.isButtonEnable(this)) {
                    self._updateCenter();
                }
            };
            this._inputChange = this._inputChange || function () {
                self._updateButtonState();
            };
            this._revertFunc = this._revertFunc || function () {
                if (self.isButtonEnable(this)) {
                    self.back();
                }
            };
            this._keyupUpdateFunction = this._keyupUpdateFunction || function (e) {
                if (self.isButtonEnable(this)) {
                    var returnKeyCode = 13;
                    if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                        self._updateStateFunc();
                    } else {
                        self._updateButtonState();
                    }
                    e.stopPropagation();
                }
            };
            this._keyupRevertFunction = this._keyupRevertFunction || function (e) {
                var returnKeyCode = 13;
                if (self.isButtonEnable(this) && (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + ""))) {
                    self.back();
                }
            };
            map = this._containerController.getUIAttached().getMap();
            map.on('zoomend moveend', this.updateData, this);
            map.on('tilelayerchanged', this._initZoomList, this);
            $('.data-row input', this._$div).on({
                change: this._inputChange,
                keyup: this._keyupUpdateFunction,
                keydown: this.keyPressPreventDefault
            });
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
                click: this._updateStateFunc,
                keyup: this._keyupUpdateFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
                click: this._revertFunc,
                keyup: this._keyupRevertFunction
            });
        }
    });
Gis.Widget.ZoomProperty.CLASS_NAME = "gis-widget-propertys-zoom";
Gis.Widget.ZoomProperty.CENTER_CHANGED = 1;
Gis.Widget.ZoomProperty.ZOOM_CHANGED = 3;
Gis.Widget.ZoomProperty.BOTH_CHANGED = 2;
Gis.Widget.ZoomProperty.NOT_CHANGED = 0;
Gis.Widget.zoomProperty = function (data) {
    return new Gis.Widget.ZoomProperty(data);
};