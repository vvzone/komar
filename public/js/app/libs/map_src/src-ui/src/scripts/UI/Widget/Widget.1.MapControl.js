(function (){
    "use strict";
    var closeToolTip = function () {
        $(this).tooltip('close');
    }, countLoading = 0, instance;
    /**
     * Панель с инструментами управления картой
     * @requires jQuery
     * @class
     * @extends Gis.Widget.Base
     */
    Gis.Widget.MapControl = Gis.Widget.Base.extend(
        /** @lends Gis.Widget.MapControl.prototype */
        {
            includes: Gis.Widget.ZoomBehavior,
            _type: 'mapcontrol',
            _buttons: {},
            /**
             * Допустимые параметры
             * @type {object}
             * @property {string} [position='top'] пока не стоит менять
             */
            options: {
                position: "top"
            },
            initialize: function (data) {
                var self = this;
                instance = this;
                Gis.Widget.Base.prototype.initialize.call(this, data);
                this._centerObject = function () {
                    var layerToCenter;
                    layerToCenter = self._getFirstSelected();
                    if (self._objectCentered) {
                        self._deinitCenterOnObject();
                    } else if (layerToCenter || self._lastSelected) {
                        self._initCenterOnObject(layerToCenter || self._lastSelected);
                    }
                };
                this._centerPost = function () {
                    if (self._postCentered) {
                        self._deinitCenterOnPost();
                    } else if (self._lastPostSelected) {
                        self._initCenterOnPost(self._lastPostSelected);
                    }
                };
                this._selectMap = function () {
                    if (!Gis.Widget.MapControl.mapDialog.isOpened()) {
                        Gis.Widget.MapControl.mapDialog.setMap(self._containerController.getUIAttached().getMap());
                        Gis.Widget.MapControl.mapDialog.setControlAvailable(self.isControlAvailable('controlmap'));
                        Gis.Widget.MapControl.mapDialog.open();
                    } else {
                        Gis.Widget.MapControl.mapDialog.close();
                    }
                };
                this._zoomIn = function () {
                    self._containerController.getUIAttached().getMap().zoomIn();
                };
                this._centerFromLayer = function (e) {
                    var center = self._lastSelected.getCenter();
                    var isOkROws = (e.rows &&
                        (e.rows.indexOf('latitude') >= 0 || e.rows.indexOf('longitude') >= 0 ||
                            e.rows.indexOf('latitudes') >= 0 || e.rows.indexOf('longitudes') >= 0));
                    if (e && (isOkROws || (self._lastSelected && self._lastSelected.getType() === 'source')) &&
                        self._isLayerOutFromContainer(center)) {
                        self._containerController.getUIAttached().getMap().setCenter(center);
                    }
                };
                this._centerFromPost = function () {
                    var latLng = self._lastPostSelected.getCenter();
                    if (self._isLayerOutFromContainer(latLng)) {
                        this._containerController.getUIAttached().getMap().setCenter(latLng);
                    }
                };
                this._zoomOut = function () {
                    self._containerController.getUIAttached().getMap().zoomOut();
                };
            },
            onAdd: function (container) {
                Gis.Widget.Base.prototype.onAdd.call(this, container);
                this.draw();
            },
            _skChanged: function (e) {
                var geoConverter = this._containerController.getUIAttached().getGeoConverter(), $container = $('#gis-widget-control-mouse-position', this._$div);
                this.updateDataPosition({
                    latLng: geoConverter.convert(e.oldSk, 'wgs84', Gis.UI.coordinate(
                        $('.value-x', $container).html().trim(),
                        $('.value-y', $container).html().trim()
                    ))
                });
                Gis.Widget.Base.prototype._skChanged.call(this);
            },
            setWidth: function () {
                this._$div.css({
                    width: this._containerController.getWidth(),
                    height: this._containerController.getHeight()
                });
            },
            _checkRemoveButtonAvailable: function () {
                var map = this._containerController.getUIAttached().getMap(), selected = Gis.TileMapService.decodeKey(map.getSelectedMapKey());
                $('.gis-control-map-remove')[(selected && selected.length > 1 && map.isMeOwnerOfTms(selected[1])) ? 'show' : 'hide']();
            },
            _postCenterHtml: function () {
                return this.isControlAvailable('controlpostcenter') ?
                    "<li class='gis-control-element gis-post-center'>" +
                        "<div class='gis-control-square-button' id='gis-post-center' title='Авто-центрирование по посту'>" +
                        "<span></span></div><div class='post-list'></div></li>" :
                    '';
            },
            _mapSelectorContainer: function () {
                return this.isControlAvailable('controlmapselector') ? "<li class='gis-control-element gis-map-selector'>" +
                    "<div class='gis-control-square-button' id='gis-select-map' title='Выбрать карту'><span></span></li>" : '';
            },
            _objectCenterHtml: function () {
                return this.isControlAvailable('controlobjectcenter') ? "<li class='gis-control-element gis-object-center'>" +
                    "<div class='gis-control-square-button' id='gis-object-center'  title='Авто-центрирование по объекту'><span></span></div></li>" : '';
            },
            _zoomSelectorHtml: function () {
                return this.isControlAvailable('controlzoom') ? "<li class='gis-control-element gis-zoom-selector'>" +
                    "<div id='gis-widget-control-zoom-selector'></div>" +
                    "<div class='gis-control-square-button' id='gis-control-zoom-in' title='Увеличить масштаб'><span></span></div>" +
                    "<div class='gis-control-square-button' id='gis-control-zoom-out' title='Уменьшить масштаб'><span></span></div>" +
                    "</li>" : '';
            },
            _connectionStateHtml: function () {
                return this.isControlAvailable('controlconnectionstate') ?
                    "<li class='gis-control-element gis-connection-status'><div id='gis-widget-control-status-connection' title='Статус соединения'></div></li>" :
                    '';
            },
            _mousePositionHtml: function () {
                return this.isControlAvailable('controlmouseposition') ?
                    "<li class='gis-control-element gis-mouse-position'><div id='gis-widget-control-mouse-position' title='Текущая позиция указателя мыши'></div>" +
                        "<div class='gis-sk-selector-container'><div class='gis-sk-title'></div><div id='gis-sk-selector'></div></div></li>" :
                    '';
            },
            _generateControlsHtml: function () {
                var html = '';
                html += this._mapSelectorContainer();
                html += this._postCenterHtml();
                html += this._objectCenterHtml();
                html += this._zoomSelectorHtml();
                html += this._connectionStateHtml();
                html += this._mousePositionHtml();
                html = html ? "<ul class='gis-widget-control'>" + html + "</ul>" : '';
                return html;
            },
            _isLayerOutFromContainer: function (coordinates) {
                return !this._containerController.getUIAttached().getMap().getMapBounds().pad(-0.8).contains(coordinates);
            },
            zoomSelected: function (zoomVal) {
                this._containerController.getUIAttached().getMap().setZoom(parseFloat(zoomVal));
            },
            _createPostList: function () {
                this._listPost = Gis.HTML.listView({
                    data: this._getPostValues(),
                    container: $('.gis-post-center > div.post-list', this._$list)[0],
                    callback: this.postSelected,
                    context: this,
                    defaultValue: {val: '', name: ''},
                    noText: true
                });
            },
            _getSkValues: function (values) {
                var geoConverter = this._containerController.getUIAttached().getGeoConverter(),
                    result = [];
                values = values || geoConverter.getAvailableSystems();
                values.forEach(function (val) {
                    var childs = geoConverter.getAvailableTemplates(val);
                    if (childs) {
                        result = result.concat(childs.map(function (childVal) {
                            return {
                                val: geoConverter.getFullSystemKey(val, childVal),
                                name: geoConverter.getFullSystemName(geoConverter.getFullSystemKey(val, childVal))
                            };
                        }));
                    } else if (geoConverter.isNeedZone(val)) {
                        result = result.concat([
                            {
                                val: val + Gis.UI.CoordinateConverter.DELIMETER + 'null' + Gis.UI.CoordinateConverter.DELIMETER + 'null',
                                name: geoConverter.getSystemName(val) + ' (авто)'
                            },
                            {
                                val: val + Gis.UI.CoordinateConverter.DELIMETER + 'null' + Gis.UI.CoordinateConverter.DELIMETER + 'fix',
                                name: geoConverter.getSystemName(val) + ' (фикс)'
                            }
                        ]);
                    } else {
                        result.push({
                            val: val,
                            name: geoConverter.getSystemName(val)
                        });
                    }
                });
                return result;
            },
            showActiveZoneDialog: function (skId) {
                var $dialogDiv = $('.dialogZone'), map, ok = false, geoConverter = this._containerController.getUIAttached().getGeoConverter(), self = this;
                if (!$dialogDiv.length) {
                    $dialogDiv = $('<div class="dialogZone" style="display: none; text-align: left;">' +
                        '<h2 style="font-size: 16px;">Выбор спорной зоны</h2>' +
                        '<label for="fixed" >Фиксированная зона <input name="fixed" type="text"></label>' +
                        '</div>').appendTo(document.body);
                }
                var save = function () {
                    var $this = $(this), $inputFixed;
                    ok = false;
                    $inputFixed = $('input[name="fixed"]', $this);
                    if (parseInt($inputFixed.val(), 10)) {
                        ok = true;
                        geoConverter.setActiveSystem(skId.replace('fix', parseInt($inputFixed.val(), 10)));
                        self._createSkList();
                    }
                    if (ok) {
                        $this.dialog('close');
                    }
                },
                    keyUp = function (ev) {
                    if (ev.keyCode === 13) {
                        save.call($dialogDiv);
                    }
                };
                map = this._containerController.getUIAttached().getMap();
                this._$dialogZone = $dialogDiv.dialog(Gis.Util.extend(this._dialogOptions, {
                        buttons: [
                            {
                                text: 'Сохранить',
                                click: save
                            },
                            {
                                text: 'Отменить',
                                click: function () {
                                    $(this).dialog('close');
                                }
                            }]
                    })).on('dialogopen', function () {
                        var autozone = geoConverter.getAutoZone();
                        $('input[name="fixed"]', $(this)).val(Gis.Util.isNumeric(autozone) ? autozone : Gis.Util.getZoneFromLongitude(map.getCenter().lng));
                        $dialogDiv.on('keyup', keyUp);
                    }).on('dialogclose', function () {
                        $dialogDiv.off('keyup', keyUp);
                    });
                this._$dialogZone.dialog('open');
            },
            getNeedSize: function () {
                var width = 0;
                $('>li', this._$list).each(function () {
                    width += $(this).outerWidth(true);
                });
                return [width + this._$div.outerWidth(true) - this._$div.width() + this._$list.outerWidth(true) - this._$list.width(), this._$div.outerHeight(true)];
            },
            skSelected: function (skId) {
                if (this._containerController.getUIAttached().getGeoConverter().isNeedZone(skId) && skId.split(Gis.UI.CoordinateConverter.DELIMETER)[2] === 'fix') {
                    this.showActiveZoneDialog(skId);
                    return true;
                }
                this._containerController.getUIAttached().getGeoConverter().setActiveSystem(skId);
                return false;
            },
            _createSkList: function () {
                var geoConverter = this._containerController.getUIAttached().getGeoConverter();
                this._skPost = Gis.HTML.listView({
                    data: this._getSkValues(),
                    container: $('#gis-sk-selector', this._$list)[0],
                    onBeforeSelect: this.skSelected,
                    context: this,
                    defaultValue: {val: geoConverter.getFullSystemSelectedKey().replace(/_\|_(\d+)/g, '_|_fix'), name: geoConverter.getFullSystemName()}
                });
            },
            _getMapValues: function () {
                var mapList = this._containerController.getUIAttached().getMap().getMapList();
                mapList.sort(function (a, b){
                    var blower = b.title.toLowerCase(), alower = a.title.toLowerCase();
                    return alower > blower ? 1 : alower < blower ? -1 : 0;
                });
                return mapList.map(function (val) {
                    return {
                        val: val.key,
                        name: val.title
                    };
                });
            },
            _recalculatePost: function (e) {
                if (e && e.target && e.target.getType() === 'post') {
                    this._createPostList();
                }
            },
            _createZoomList: function () {
                var defZoom;
                defZoom = this.getConvertedZoom();
                this._listZoom = Gis.HTML.listView({
                    data: this._getZoomValues(),
                    container: $('#gis-widget-control-zoom-selector', this._$list)[0],
                    callback: this.zoomSelected,
                    context: this,
                    defaultValue: {val: this._containerController.getUIAttached().getMap().getZoom(), name: defZoom}
                });
            },
            _tileLayerChanged: function () {
                this._createZoomList();
                this._checkRemoveButtonAvailable();
            },
            initHTML: function () {
                Gis.Widget.Base.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.MapControl.CLASS_NAME);
                this.setWidth();
                this._$list = $(this._generateControlsHtml());
                this._$div.append(this._$list);
                this._$statusConnection = $('#gis-widget-control-status-connection', this._$list);
                this._createZoomList();
                this._createPostList();
                this._createSkList();
                this.updateStatusConnection();
                this._setMousePosition(this._containerController.getUIAttached().getMap().getCenter())
            },
            postSelected: function (postId) {
                var post = this._containerController.getUIAttached().getMap().getLayer(postId);
                this._deinitCenterOnObject();
                this._initCenterOnPost(post);
            },
            _getPostValues: function () {
                var data = [],
                    map = this._containerController.getUIAttached().getMap(),
                    ids = map.getLayerIDs();
                ids.forEach(function (row) {
                    var layer = map.getLayer(row);
                    if (layer.getType() === 'post') {
                        data.push({
                            val: row,
                            name: layer.getName() || row
                        });
                    }
                });
                return data;
            },
            updateDataZoom: function () {
                this._listZoom.setValueSelected(this._containerController.getUIAttached().getMap().getZoom());
            },
            updateDataPosition: function (e) {
                this._setMousePosition(e.latLng);
            },
            _setMousePosition: function (latlng) {
                var point = this.coordinateToTemplate(latlng),
                    geoConverter = this._containerController.getUIAttached().getGeoConverter(),
                    isMetric = geoConverter.isMetric(geoConverter.getSelectedSystem()), html;
                if (!isMetric) {
                    html = '<span>' + this._HTMLRowName(true) + ': <span class="value-y">' + point.y + ' </span></span><span>' + this._HTMLRowName() + ': <span class="value-x">' + point.x + '</span></span>'
                } else {
                    html = '<span>' + this._HTMLRowName() + ': <span class="value-x">' + point.x + ' </span></span><span>' + this._HTMLRowName(true) + ': <span class="value-y">' + point.y + '</span></span>';
                }
                $('#gis-widget-control-mouse-position', this._$div).html(html);
            },
            _deinitCenterOnPost: function () {
                if (this._lastPostSelected) {
                    this._lastPostSelected.off('change', this._centerFromPost, this);
                    $('#gis-post-center', this._$div).removeClass('active');
                    this._postCentered = false;
                }
            },
            _initCenterOnPost: function (layerToCenter) {
                var latlng = layerToCenter.getLatLng();
                if (latlng && latlng[0] && latlng[1]) {
                    this._deinitCenterOnPost();
                    this._deinitCenterOnObject();
                    this._listPost.setValueSelected(layerToCenter.getId());
                    this._lastPostSelected = layerToCenter;
                    layerToCenter.on('change', this._centerFromPost, this);
                    this._containerController.getUIAttached().getMap().setCenter(latlng, true);
                    $('#gis-post-center', this._$div).addClass('active');
                    this._postCentered = true;
                }
            },
            _deinitCenterOnObject: function () {
                if (this._lastSelected) {
                    this._lastSelected.off('change', this._centerFromLayer, this);
                    $('#gis-object-center', this._$div).removeClass('active');
                    this._objectCentered = false;
                }
            },
            _initCenterOnObject: function (layerToCenter) {
                this._deinitCenterOnObject();
                this._deinitCenterOnPost();
                this._lastSelected = layerToCenter;
                layerToCenter.on('change', this._centerFromLayer, this);
                this._containerController.getUIAttached().getMap().setCenter(layerToCenter.getCenter());
                $('#gis-object-center', this._$div).addClass('active');
                this._objectCentered = true;
            },
            _setSelected: function (e) {
                switch (e.type){
                    case 'unselectlayer':
                        if(this._layerSelected === e.layer) {
                            this._layerSelected = undefined;
                        }
                        break;
                    case 'selectlayer':
                        this._layerSelected = e.layer;
                        break;
                }
            },
            _updateLoader: function () {
                var loader = Gis.config(L.TileWithLoader.CONFIG_KEY, L.TileWithLoader.FULL_LOADER);
                if (loader === L.TileWithLoader.FULL_LOADER || loader === L.TileWithLoader.CORNER_LOADER) {
                    var isLoading = Gis.ProgressBarController.isLoading();
                    if (isLoading !== this._loading) {
                        this._loading = isLoading;
                        $('.gis-connection-status', this._$div)[this._loading ? 'addClass' : 'removeClass']('loading');
                    }
                }
            },
            _tilesCountChanged: function (e) {
                this._updateLoader();
            },
            _deInitEvents: function () {
                var uiAttached = this._containerController.getUIAttached();
                var map = uiAttached.getMap();
                Gis.EventBus.on('tilesloading tilesloaded', this._tilesCountChanged, this);
                map.off('zoomend', this.updateDataZoom, this);
                map.off('mousemove', this.updateDataPosition, this);
                map.off('statuschanged', this.updateStatusConnection, this);
                this._$div.off('click', '#gis-control-zoom-in', this._zoomIn);
                this._$div.off('click', '#gis-control-zoom-out', this._zoomOut);
                this._$div.off('click', '#gis-object-center', this._centerObject);
                uiAttached.off('sizerecalculated', this.setWidth, this);
                map.off('layerremoved layeradded', this._recalculatePost, this);
                uiAttached.on('selectlayer unselectlayer', this._setSelected, this);
                map.off('tilelayerchanged', this._tileLayerChanged, this);
                this._$div.off('click', '#gis-select-map', this._selectMap);
                this._deinitCenterOnObject();
                this._$div.tooltip('destroy');
                this._$div.off('mouseleave mouseout', closeToolTip);
                Gis.Widget.Base.prototype._deInitEvents.call(this);
            },
            _getFirstSelected: function () {
                if (this._layerSelected) {
                    return this._layerSelected;
                }
                var map = this._containerController.getUIAttached().getMap(), lastSelectedKey, selected;
                selected = map.getSelected();
                lastSelectedKey = Object.keys(selected)[0];
                selected = lastSelectedKey && selected[lastSelectedKey];
                return selected;
            },
            updateStatusConnection: function (e) {
                var connection = e && e.target,
                    status = (connection && connection.getStatus()) || 0;
                this._$statusConnection.html('<div class="server-status server-status-' + status + '"></div>');
                status = Gis.Widget.MapControl.STATUS_TEXT[status] && Gis.Widget.MapControl.STATUS_TEXT[status](connection);
                status = (status || '') + '<hr/>' + Gis.moduleName.ru + ': <span class="value">' + Gis.version + '</span>, сборка <span class="value">' + Gis.buildDate + '</span>';
                status += '<hr/>Версия графического интерфейса: <span class="value">' + Gis.UI.version + '</span>, сборка <span class="value">' + GIS_UI_buildDate + '</span>';
                this._$statusConnection.data('aTooltip', '<div class="serve-status-tooltip">' + status + '</div>' );
            },
            _initEvents: function () {
                var uiAttached = this._containerController.getUIAttached();
                var map = uiAttached.getMap();
                Gis.EventBus.on('tilesloading tilesloaded', this._tilesCountChanged, this);
                this._updateLoader();
                map.on('zoomend', this.updateDataZoom, this);
                map.on('mousemove', this.updateDataPosition, this);
                map.on('statuschanged', this.updateStatusConnection, this);
                this._$div.on('click', '#gis-control-zoom-in', this._zoomIn);
                this._$div.on('click', '#gis-control-zoom-out', this._zoomOut);
                this._lastSelected = this._getFirstSelected();
                this._$div.on('click', '#gis-object-center', this._centerObject);
                this._$div.on('click', '#gis-post-center', this._centerPost);
                this._$div.on('click', '#gis-select-map', this._selectMap);
                map.on('layerremoved layeradded', this._recalculatePost, this);
                uiAttached.on('selectlayer unselectlayer', this._setSelected, this);
//                map.on('maplistchanged tilelayerchanged', this._recalculateMaps, this);
                map.on('tilelayerchanged', this._tileLayerChanged, this);
                uiAttached.on('sizerecalculated', this.setWidth, this);
                Gis.Widget.Base.prototype._initEvents.call(this);
                this._$div.on('mouseleave mouseout', closeToolTip);
                this._$div.tooltip({
                    track: true,
                    content: function() {
                        var element = $( this );
                        var aTooltip = element.data('aTooltip');
                        if (aTooltip) {
                            return aTooltip;
                        }
                        if ( element.is( "[title]" ) ) {
                            return element.attr( "title" );
                        }
                    }
                });
            },
            draw: function () {
                Gis.Widget.Base.prototype.draw.call(this);
            }
        }
    );

    Gis.Widget.MapControl.STATUS_TEXT = {
        '0': function () {
            return 'Активное соединение отсутствует';
        },
        '1': function (connection) {
            return 'Соединение с сервером ' + connection.getDomain() + ':' + connection.getPort() + ' установлено';
        },
        '2': function (connection) {
            return 'Выполняется соединение с сервером ' + connection.getDomain() + ':' + connection.getPort();
        }
    };
    Gis.Widget.MapControl.CLASS_NAME = 'gis-widget-mapcontrol';
    Gis.Widget.MapControl.mapDialog = Gis.mapListControl();
    /**
     * Возвращает новый экземпляр @link {Gis.Widget.MapControl}
     * @param data
     * @returns {Gis.Widget.MapControl}
     */
    Gis.Widget.mapcontrol = function (data) {
        if (instance) {
            if (data) {
                instance.setOptions(data);
            }
        } else {
            new Gis.Widget.MapControl(data);
        }
        return instance;
    };
}()
);