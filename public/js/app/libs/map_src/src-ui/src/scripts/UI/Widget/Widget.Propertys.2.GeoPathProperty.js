(function () {
    "use strict";
    var instance,
        marker, nameForSave, firstInit = true;

    function resetRouting(path) {
        var route = (path || OSRM.G.route);
        if (route.saved) {
            route.hideAdditional();
            OSRM.G.route = new OSRM.Route();
        }
    }

    function constructName($parent) {
        return nameForSave || $('#gui-input-source', $parent).val() + $('#gui-input-target', $parent).val();
    }

    /**
     *
     * @class
     * @extends Gis.Widget.Propertys
     */
    Gis.Widget.GeoPathProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.GeoPathProperty.prototype
         */
        {
            _type: 'geo-path',
            _defaultStyle: {
                color: 'rgba(15, 55, 213, 0.42)',
                border: 'white',
                dash: Gis.Dash.dot,
                selectedBorder: 'rgba(0, 0, 0, 0.64)',
                thickness: 2
            },
            options: {
                needCheckLayers: false,
                colors: undefined
            },
            _history: [],
            initialize: function () {
                Gis.Widget.Propertys.prototype.initialize.call(this);
                instance = this;
            },
            setData: function () {
                Gis.Widget.Propertys.prototype.initialize.apply(this, arguments);

            },
            back: function () {
//                this.revertHtmlPointSelectorWidgetData(this._$posiiton);
//                this._$text.val(lastQuery);
//                this._list.setValueSelected(_typeWasSearch);
//                this._updateButtonState();
            },
            updateData: function (e) {

//                this._setData();
                this._updateColor();
                this._updateButtonState();
            },
            setBounds: function () {
                var maxHeight, heightContainer, $wrapper = $(), $wrParent, pointsHeight, infoPadding;
                heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
                maxHeight = heightContainer  - Gis.Widget.Scheme.needHeight(heightContainer) - $('#information-box-header', this._$div).outerHeight(true) - $('#main-wrapper', this._$div).outerHeight(true);
                var $information = $('#information-box', this._$div);
                var $color = $('.color-selector-block', this._$div);
                $wrParent = $information.parents('.gis-widget-propertys-wraper');
                maxHeight -= $wrParent.outerHeight(true) - $('.gis-widget-propertys-data', $wrParent).height() + $color.outerHeight(true);
                $information.css({
                    maxHeight: maxHeight - ($information.outerHeight(true) - $information.height())
                });
            },
            initHTML: function () {
                var self = this;
                Gis.Widget.Propertys.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.GeoPathProperty.CLASS_NAME);
                this._$div.attr('id', 'gui');
                instance._updateButtonState();
            },
            _isStateChanged: function () {
                var changed = false,
                    colorSelected = this.getValueFromData('getColor', null, true);
                changed = changed || (this.options.dataBinded && colorSelected != this.getSelectedColor());
                return changed;
            },
            _updateColor: function () {
                Gis.Widget.Propertys.prototype._updateColor.call(this, this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)));
                this._colorChanged(true);
            },
            initDataBlock: function () {
                return '<!-- gui -->' +
'                <!-- main gui -->' +
'                    <div id="main-wrapper" class="box-wrapper ' + Gis.Widget.Propertys.DATA_WRAPER_CLASS + '">' +
                    "<div id='search-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Маршрутные точки</div>\n" +
                    '<div class="' + Gis.Widget.Propertys.DATA_BLOCK_CLASS + '">'+
'                        <!-- input box -->' +
'                        <div id="main-input" class="box-content">' + 
'                            <!--  input mask -->' +
'                            <div id="input-mask">' + 
'                                <!-- source/target input -->' +
'                                <div class="full">' + 
'                                    <div id="input-source" class="input-marker">' + 
'                                        <div class="left"><span id="gui-search-source-label" class="input-label nowrap">Start:</span></div>' + 
'                                        <div class="center stretch"><input id="gui-input-source" class="input-box" type="text" maxlength="200" value="" title="Enter start" /></div>' + 
'                                        <div class="right"><button class="widget-control gis-propertys-button location-show" id="gui-search-source"><span></span></button></div>' +
'                                    </div>' + 
'                                    <div id="input-target" class="input-marker">' + 
'                                        <div class="left"><span id="gui-search-target-label" class="input-label nowrap">End:</span></div>' + 
'                                        <div class="center stretch"><input id="gui-input-target" class="input-box" type="text" maxlength="200" value="" title="Enter destination" /></div>' + 
'                                        <div class="right"><button class="widget-control gis-propertys-button location-show" id="gui-search-target"><span></span></button></div>' +
'                                    </div>' + 
'                                </div>' + 
'                                <div class="quad"></div>' +
'                                <!-- action buttons -->' +
'                                <div class="full">' + 
'                                    <div class="row">' + 
'                                        <div class="left">' +
//                                            '<button class="widget-control gis-propertys-button" id="gui-new-route">Новый</button>' +
                                            '<button title="Сбросить" class="widget-control gis-propertys-button gis-propertys-button-deselect" id="gui-reset"><span class="gis-button-icon"></span><span class="gis-button-text"></span></button>' +
                                        '</div>' +
'                                        <div class="center" style="display: none"><select id="gui-engine-toggle" class="engine-select"></select></div>' +
'                                        <div class="right"><button class="widget-control gis-propertys-button" id="gui-reverse">Reverse</button></div>' +
'                                    </div>' + 
'                                </div>' + 
'                            </div>' + 
'                            </div>' +
'                            </div>' +
'                        </div>' +
                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + " color-selector-block'>\n" +
                    "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Цвет</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                    this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)) +
                    this._HTMLstyleSelector() +
                    "</div>\n" +
                    "</div>\n" +
                        '<!-- output box -->' +
                        '<div id="main-output" class="box-content ' + Gis.Widget.Propertys.DATA_WRAPER_CLASS + '">' +
                            "<div id='search-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Маршрут</div>\n" +
                    '<div class="' + Gis.Widget.Propertys.DATA_BLOCK_CLASS + '">'+
                            '<div id="information-box-header"></div>' +
                            '<div id="information-box" class="information-box-with-small-header"></div>' +
                        '</div></div>'+
'                </div>';
            },
            initButtonsBlock: function () {
                return "";
            },

            _mapClicked: function (e) {

            },
            _updateButtonState: function () {
                var buttonSaveText;
//                buttonSaveText = !this.options.dataBinded ? "Новый" : "Сохранить";
//                var $button = $('#gui-new-route', this._$buttonNew);
//                $button.html(buttonSaveText);
//                $button[this.options.dataBinded ? 'hide' : 'show']();
//                instance.switchButtonState($('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, instance._$div), isStateChanged && !ajax);
//                instance.switchButtonState($('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, instance._$div), instance.options.dataBinded);

            },
            /**
             *
             * @returns {Array.<Gis.Objects.PathPoint>|undefined}
             * @private
             */
            _getPathPoints: function () {
//                var positions = OSRM.G.route.getPositions(), i, len, pathPoints = [];
//                if (positions && positions.length) {
//                    for (i = 0, len = positions.length; i < len; i += 1) {
//                        pathPoints.push(Gis.pathPoint({
//                            latitude: positions[i].lat,
//                            longitude: positions[i].lng
//                        }))
//                    }
//                    return pathPoints;
//                }
            },
            routeNameChanged: function (e) {
                nameForSave = e.name;
//                if (instance.options.dataBinded) {
                    this._saveRoute();
//                }
            },
            _saveRoute: function () {
                if ((this.options.dataBinded && this.options.dataBinded.getPath() !== OSRM.G.route) || (!this.options.dataBinded && OSRM.G.route.saved)) {
                    Gis.Logger.log("not equals routes");
                    return;
                }
                if (OSRM.G.markers.route.length > 1) {
                    var lineStyle, style, dataBinded, routing;
                    style = instance._defaultStyle;
                    lineStyle = {color: instance.getSelectedColor()};

                    routing = [];
                    for (var i = 0, len = OSRM.G.markers.route.length; i < len; i += 1) {
                        routing.push(OSRM.G.markers.route[i].getPosition());
                    }
                    dataBinded = instance.options.dataBinded;
                    lineStyle.thickness = style.thickness;
                    lineStyle.border = style.border;
                    if (!instance.options.dataBinded) {
                        OSRM.G.route.checksum = OSRM.G.markers.checksum;
                        dataBinded = Gis.geoPath(Gis.Util.extend({
                            routing: routing,
                            path: OSRM.G.route,
                            id: Gis.Util.generateGUID(),
                            name: constructName(),
                            draggable: false,
                            selectable: true,
                            icon: style.icon
                        }));
                    } else {
                        dataBinded.setData(Gis.Util.extend({}, {name: constructName(), routing: routing}));
                    }
                    dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
                    instance.options.dataBinded = dataBinded;
                    if (!instance._containerController.getUIAttached().getMap().hasLayer(dataBinded)) {
                        dataBinded.addTo(instance._containerController.getUIAttached().getMap());
                        instance._containerController.getUIAttached().getMap().selectLayer(dataBinded);
                    }
                    instance._updateButtonState();
                }
//                this._initPolylineEvents();
            },
            _unselectLayer: function () {
                if (instance.isButtonEnable(this)) {
                    if (instance.options.dataBinded) {
                        instance._containerController.getUIAttached().getMap().unselectLayer(instance.options.dataBinded);
                    } else {
                        resetRouting();
                        OSRM.GUI.resetRouting();
                    }
                }
            },
            _colorChanged: function (noSave) {
                if (OSRM.G.route) {
                    OSRM.G.route.updateCurrentRouteStyle(instance.getSelectedColor());
                    if (!noSave) {
                        this._saveRoute();
                    }
                }
            },
            onRemove: function () {
                resetRouting();
                OSRM.deinit();
                Gis.Widget.Propertys.prototype.onRemove.apply(this, arguments);
            },
            onAdd: function () {
                Gis.Widget.Propertys.prototype.onAdd.apply(this, arguments);
                if (this.options.dataBinded) {
                    this.updateData();
                }
                this.requestRouting(firstInit);
                OSRM.init();
                firstInit = false;
            },
            _initEvents: function () {
                Gis.EventBus.on('route-changed', this.setBounds, this);
                Gis.EventBus.on('route-name-changed', this.routeNameChanged, this);
                Gis.Widget.Propertys.prototype._initEvents.apply(this, arguments);
                this.on('color-change', this._colorChanged, this);
//                this._$div.on('click', '#gui-new-route', this._saveRoute)
                this._$div.on('click', '#gui-reset', this._unselectLayer);
            },
            _deInitEvents: function () {
                Gis.Widget.Propertys.prototype._deInitEvents.apply(this, arguments);
                Gis.EventBus.off('route-changed', this.setBounds, this);
                Gis.EventBus.off('route-name-changed', this.routeNameChanged, this);
                this.off('color-change', this._colorChanged, this);
//                this._$div.off('click', '#gui-new-route', this._saveRoute);
                this._$div.off('click', '#gui-reset', this._unselectLayer);
            },
            requestRouting: function (noReset) {
                if (this.options.dataBinded) {
                    var routing = this.options.dataBinded.getRouting();
                    OSRM.G.route = this.options.dataBinded.getPath();
                    OSRM.G.markers.setSource( routing[0]);
                    OSRM.G.markers.setTarget( routing[routing.length - 1]);
                    OSRM.G.markers.checksum = this.options.dataBinded.getPath().checksum;
                    OSRM.G.markers.removeVias();
                    for (var i = 1, len = routing.length - 1; i < len; i += 1) {
                        OSRM.G.markers.setVia( i - 1, routing[i] );
                    }
                    OSRM.G.markers.show();
                    OSRM.Routing.getRoute();
                } else if (!noReset) {
                    resetRouting();
                    OSRM.GUI.resetRouting();
                }
            }, bindData: function (data) {

                if (data !== this.options.dataBinded) {
                    nameForSave = false;
                    if (this.options.dataBinded) {
//                        this._saveRoute();
                        this.options.dataBinded.off('change', this.updateData, this);
                    }
                    resetRouting(this.options.dataBinded && this.options.dataBinded.getPath());
                    OSRM.GUI.resetRouting();
                    if (data) {
                        data.on('change', this.updateData, this);
                    }
                    Gis.Widget.Propertys.prototype.bindData.call(this, data);
                    instance.updateData();
                    this.requestRouting();
                }
            }
        });

    Gis.Widget.GeoPathProperty.CLASS_NAME = "gis-widget-propertys-geo-path";
    Gis.Widget.geoPathProperty = function (data) {
        if (!instance) {
            return new Gis.Widget.GeoPathProperty(data);
        } else {
            instance.setData(data);
        }
        return instance;
    };

    Gis.UI.DeleteActions[Gis.Objects.GeoPath.prototype.options.tacticObjectType] = function (e, dataBinded) {
        if ((e.srcElement || e.target).type !== Gis.Objects.GeoPath.prototype.options.tacticObjectType) {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить маршрут?',
                callback: function () {
                    this.removeLayerFromMap(dataBinded || this.options.dataBinded);
                },
                context: this,
                id: 'geo-path-remove-dialog'
            }, dataBinded);
        }
    };
}());