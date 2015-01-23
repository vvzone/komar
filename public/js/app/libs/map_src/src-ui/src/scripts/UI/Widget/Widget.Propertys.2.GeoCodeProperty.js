(function () {
    "use strict";
    var ajax, instance, polygon, lastData, TYPE_FORWARD = 'forward', TYPE_BACKWARD = 'backward', _searchType = TYPE_FORWARD, _typeWasSearch = _searchType,
        types = {},
        lastSearchCoordinate,
        lastQuery,
        POLYGON_STYLE = {
            fill: true,
            stroke: true,
            weight: 3,
            color: 'rgba(16, 0, 247, 0.5)',
            fillColor: 'rgba(255, 255, 255, 0.46)'
        },
        LINE_STYLE = {
            stroke: true,
            weight: 3,
            color: 'rgba(16, 0, 247, 0.5)'
        },
        marker;
    types[TYPE_FORWARD] = 'Прямое';
    types[TYPE_BACKWARD] = 'Обратное';
    function initMarker(latLng, title, openTitle) {
        var map = Gis.Map.CURRENT_MAP.options.provider.map;
        if (!marker) {
            marker = L.marker(latLng, {
                icon: L.icon({
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    iconUrl: Gis.config('relativePath') + 'images/marker-source.png'
                })
            });
        } else {
            marker.setLatLng(latLng);
        }
        if (!map.hasLayer(marker)) {
            marker.addTo(map);
        }
//        if (title) {
//            marker.bindPopup(title);
//        } else {
//            marker.unbindPopup(title);
//        }
//        if (openTitle && title) {
//            marker.openPopup();
//        } else {
//            marker.closePopup();
//        }
    }

    function removeMarker () {
        if (marker) {
            var map = Gis.Map.CURRENT_MAP.options.provider.map;
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    }

    /**
     *
     * @class
     * @extends Gis.Widget.Propertys
     */
    Gis.Widget.GeoCodeProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.GeoCodeProperty.prototype
         */
        {
            _type: 'geo',
            options: {
                needCheckLayers: false
            },
            _history: [],
            initialize: function () {
                Gis.Widget.Propertys.prototype.initialize.call(this);
                instance = this;
            },
            back: function () {
                this.revertHtmlPointSelectorWidgetData(this._$posiiton);
                this._$text.val(lastQuery);
                this._list.setValueSelected(_typeWasSearch);
                this._updateButtonState();
            },
            _setData: function (text, center) {
                center = this.coordinateToTemplate(center || lastSearchCoordinate || Gis.Map.CURRENT_MAP.getCenter());
                var x = (center && center.x) || "";
                var y = (center && center.y) || "";
                text = text || lastQuery;
                this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                this._setValue(this._$text, text, text);
            },
            updateData: function (e) {

                this._setData();
                this._updateButtonState();
            },
            _updateTypeState: function () {
                Gis.Widget.Propertys.prototype._updateTypeState.call(this);
                switch (_searchType) {
                    case TYPE_FORWARD:
                        this._$posiiton.addClass('hide');
                        this._$text.removeClass('hide');
                        break;
                    case TYPE_BACKWARD:
                        this._$text.addClass('hide');
                        this._$posiiton.removeClass('hide');
                        break;
                }
            },
            drawPolygon: function (data) {
                var isLine = data.geojson.type.toLowerCase().indexOf('line') > -1;
                polygon = L.geoJson(data.geojson, {
                    style: function (feature) {
                        return isLine ? LINE_STYLE : POLYGON_STYLE;
                    }
                }).addTo(Gis.Map.CURRENT_MAP.options.provider.map);
            },
            doShowOnMap: function (li) {
                var data = lastData[$(li).data('id')], center;
                if (polygon && Gis.Map.CURRENT_MAP.options.provider.map.hasLayer(polygon)) {
                    Gis.Map.CURRENT_MAP.options.provider.map.removeLayer(polygon);
                }
                if (data) {
                    center = data.lat && data.lon && L.latLng(data.lat, data.lon);
                    if (data.geojson) {
                        removeMarker();
                        this.drawPolygon(data);
                    } else {
                        initMarker(center, data.display_name, true);
                    }
                    if (data.boundingbox) {
                        Gis.Map.CURRENT_MAP.options.provider.map.fitBounds(L.latLngBounds(
                            [data.boundingbox[0], data.boundingbox[2]],
                            [data.boundingbox[1], data.boundingbox[3]]
                        ));
                    } else if (data.lat && data.lon) {
                        Gis.Map.CURRENT_MAP.setCenter(Gis.latLng(data.lat, data.lon));
                    }
                }
                return false;
            },
            fillList: function (data) {
                var i, len = data.length, html = '', currentData;
                lastData = data;
                for (i = 0; i < len; i += 1) {
                    currentData = data[i];
                    html += '<li data-id="' + i +'">' +
                        (currentData.icon ? '<img src="' + currentData.icon + '" alt="' + currentData.display_name +'">' : '') +
                        '<span class="name">' + currentData.display_name +'</span>' +
                        '</li>';
                }
                if (!html) {
                    html = '<li>Ничего не найдено</li>';
                }
                $('ul', this._$resultContainer).html(html);
            },
            setBounds: function () {
                var maxHeight, heightContainer, $wrapper, $wrParent, pointsHeight, infoPadding;
                heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
                maxHeight = heightContainer - Gis.Widget.Scheme.needHeight(heightContainer);
                $wrapper = $('ul', this._$resultContainer);
                $wrParent = $wrapper.parents('.gis-widget-propertys-wraper');
                $('.gis-widget-propertys-buttons-wraper, .gis-widget-propertys-wraper', this._$div).not($wrParent)
                    .each(function () {
                        maxHeight -= $(this).outerHeight(true);
                    });
                maxHeight -= $wrParent.outerHeight(true) - $wrapper.height();
                $wrapper.css({
                    maxHeight: maxHeight
                });
            },
            getRowLoaderHeight: function () {
                var height = 0;
                var $li = $('li', this._$resultContainer);
                $li.each(function () {
                    height += $(this).outerHeight(true);
                });
                var element = $($li[0]);
                height -= element.outerHeight(true) - element.height();
                return Math.min(200, height);
            },
            getSearchUrl: function () {
                switch (_searchType) {
                    case Gis.OSRM.TYPE_FORWARD:
                        return Gis.config(Gis.GEO_FORWARD_SEARCH_URL, 'http://nominatim.openstreetmap.org/search') + '?q=' + this._$text.val() + '&limit=' + Gis.config(Gis.GEO_FORWARD_SEARCH__MAX_RESULTS, 30) + '&format=json&polygon_geojson=1&addressdetails=1';
                    case Gis.OSRM.TYPE_BACKWARD:
                        var projectedPoint = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));
                        return Gis.config(Gis.GEO_REVERSE_SEARCH_URL, 'http://nominatim.openstreetmap.org/reverse') + '?format=json&lat=' + projectedPoint.y + '&lon=' + projectedPoint.x + '&polygon_geojson=1&addressdetails=1&zoom=' + Gis.OSRM.getMapZoom();
                }

            },
            _doRequest: function (latLng) {
                var self = this, sType = _searchType;
                if (ajax) {
                    ajax.abort();
                }
                var $ul = $('ul', this._$resultContainer);
                $ul.html('<li style="height: ' + this.getRowLoaderHeight() + 'px;">' + Gis.HTML.LOADER_HTML + '</li>');
                $('.windows8', this._$resultContainer).addClass('show');

                if (sType === TYPE_BACKWARD && latLng) {
                    initMarker(latLng);
                } else {
                    removeMarker();
                }
                ajax = $.ajax({
                    url: this.getSearchUrl(),
                    success: function (data) {
                        _typeWasSearch = sType;
                        if (sType === TYPE_BACKWARD) {
                            if (data && Gis.Util.isDefine(data.lat) && Gis.Util.isDefine(data.lon)) {
                                initMarker(L.latLng(parseFloat(data.lat), parseFloat(data.lon)));
                            }
                            data = [data];
                            var projectedPoint = self.templateToCoordinate(self.getPointValue(self._$Xrow), self.getPointValue(self._$Yrow));
                            lastSearchCoordinate = Gis.latLng(projectedPoint.y, projectedPoint.x);
                        } else {
                            lastQuery = self._$text.val();
                        }
                        if (data[0] && data[0].error) {
                            data = [];
                        }
                        self.fillList(data);
                        self._setData();
                    },
                    complete: function () {
//                        self._$button.text('Найти');
                        ajax = null;
                        self._updateButtonState();
                    },
                    error: function (e) {
                        if (e.status !== 0) {
                            self.fillList([]);
                            Gis.notify('Не удалось запросить данные', 'error');
                        }
                    }
                });
                this._updateButtonState();
            },

            _getTypeValues: function () {
                var data = [], key;
                for (key in types) {
                    if (types.hasOwnProperty(key)) {
                        data.push({
                            val: key,
                            name: types[key]
                        });
                    }
                }
                return data;
            },
            _getTypeName: function (type) {
                return types[type];
            },
            initHTML: function () {
                var self = this;
                Gis.Widget.Propertys.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.GeoCodeProperty.CLASS_NAME);
                this._$Xrow = $('#query-x', this._$div);
                this._$Yrow = $('#query-y', this._$div);
                this._$resultContainer = $('#result-container', this._$div);
                this._$text = $('#query-text', this._$div);
                this._$posiiton = $('#position-selector', this._$div);
                this._$button = $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME + ' .gis-button-text', this._$div);
                this._list = Gis.HTML.listView({
                    data: this._getTypeValues(),
                    container: $('#type-selector', this._$div)[0],
                    callback: function (type) {
                        _searchType = type;
                        self._updateState();
                    },
                    context: this,
                    defaultValue: {val: _searchType, name: this._getTypeName(_searchType)}
                });
                if (lastData) {
                    this.fillList(lastData);
                }
                this._setData();
                this._updateState();
            },
            initDataBlock: function () {
                var center = lastSearchCoordinate || Gis.Map.CURRENT_MAP.getCenter(),
                    centerTemplated = this.coordinateToTemplate(center),
                    centerX = centerTemplated.x || '',
                    centerY = centerTemplated.y || '';
                return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='search-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Параметры поиска</div>\n" +
                    "<div id='search-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<ul>\n" +
                    "<li class='data-row query-param'><span class='type-title'>Тип кодирования</span><span id='type-selector'></span>" + this._HTMLRowInput(lastQuery || "", 'query-text', 'query-input query-right', null, 'Введите запрос') + "\n" +
                    "</ul>\n" +
                    "<ul id='position-selector' class='inline-points hide'>\n" +
                    this._HTMLPointSelectorWidget({
                        tag: 'li',
                        tagClass: 'data-coll',
                        x: centerX,
                        y: centerY,
                        xID: 'query-x',
                        yID: 'query-y',
                        yClass: 'query-input',
                        xClass: 'query-input'
                    }) +
                    "</ul>\n" +
                    "</div>\n" +
                    "</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='result-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Результат поиска</div>\n" +
                    "<div id='result-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<div id='result-container'><ul class=' data-list element-hover'><li>Укажите параметры поиска и нажмите \"Найти\"</li></ul></div>" +
                    "</div>\n" +
                    "</div>\n";
            },
            initButtonsBlock: function () {
                return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                    "<ul class='gis-property-buttons-list'>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Найти') + "</li>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n";
            },

            _mapClicked: function (e) {
                if (_searchType === TYPE_BACKWARD) {
                    var latLng = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
                    var point = this.coordinateToTemplate(latLng), x, y;
                    x = point.x || '';
                    y = point.y || '';
                    this.setHtmlPointSelectorWidgetData(this._$posiiton, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                    this._doRequest(latLng);
                }
            },
            _hilightErrors: function () {
                switch (_searchType) {
                    case TYPE_BACKWARD:
                        return this.checkPoint(this._$posiiton);
                        break;
                    case TYPE_FORWARD:
                        return !this._$text.val();
                        break;
                }
            },
            typeChanged: function () {
                return _typeWasSearch !== _searchType;
            },
            _isStateChanged: function () {
                var changed;
                switch (_searchType) {
                case TYPE_BACKWARD:
                    changed = this._rowChanged(this._$Xrow)||
                        this._rowChanged(this._$Yrow);
                    break;
                case TYPE_FORWARD:
                    changed = this._rowChanged(this._$text);
                    break;
                }
                return changed || this.typeChanged();
            },
            _updateButtonState: function () {
                var isStateChanged = this._isStateChanged();
                this.switchButtonState($('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div), isStateChanged);
                this.switchButtonState($('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div), isStateChanged && !this._hilightErrors());

            },
            _deInitEvents: function () {
                Gis.Widget.Propertys.prototype._deInitEvents.call(this);
                var map = this._containerController.getUIAttached().getMap();
                $('.data-row input', this._$div).off({
                    keypress: this._keyupUpdateFunction,
                    change: this._inputChange
                });
                $('#result-container').off('click', 'li', this._showOnMap);
                $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
                    click: this._updateStateFunc,
                    keypress: this._keyupUpdateFunction
                });
                $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
                    click: this._revertFunc,
                    keypress: this._keyupRevertFunction
                });
                if (polygon) {
                    Gis.Map.CURRENT_MAP.options.provider.map.removeLayer(polygon);
                }
                removeMarker();
            },
            _initEvents: function () {
                var self = this, map;
                this._showOnMap = function () {
                   self.doShowOnMap(this);
                };
                Gis.Widget.Propertys.prototype._initEvents.call(this);
                this._updateStateFunc = this._updateStateFunc || function () {
                    if (self.isButtonEnable($('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, self._$div)[0])) {
                        self._doRequest();
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
                $('#result-container').on('click', 'li', this._showOnMap);
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
                $('input', this._$div).on({
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
                document.getElementById("query-text").focus();
            }
        });

    Gis.GEO_FORWARD_SEARCH__MAX_RESULTS = 'gis.geo.forward.max_results';
    Gis.GEO_FORWARD_SEARCH_URL = 'gis.geo.forward';
    Gis.GEO_REVERSE_SEARCH_URL = 'gis.geo.reverse';
    Gis.GEO_SHORTEN_URL = 'gis.geo.shorten';
    Gis.GEO_TIMESTAMP_URL = 'gis.timestamp.url';
    Gis.GEO_ROUTING_URL = 'gis.routing.url';
    Gis.GEO_NEAREST_URL = 'gis.nearest.url';
    Gis.Widget.GeoCodeProperty.CLASS_NAME = "gis-widget-propertys-geo";
    Gis.Widget.geoProperty = function (data) {
        return instance || new Gis.Widget.GeoCodeProperty(data);
    };
}());