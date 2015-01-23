"use strict";

/**
 * Главный класс UI
 * @requires jQuery
 * @class
 * @param {Gis.Map} map
 * @extends Gis.BaseClass
 */
Gis.UI = Gis.BaseClass.extend(
    /** @lends Gis.UI.prototype */
    {
        _attached: false,
        _widgetContainers: {},
        _containers: {},
        _widgets: {},
        _geoSystemConverter: undefined,
        /**
         * Допустимые опции
         * @type {object}
         * @property {object} [style=Gis.UI.DEFAULT_STYLE]
         * @property {string} [actionsEnabled='ellipse marker measure move object path polygon sector select zoom'] если какое-то действие отключено, кнопка на панели инструментов не активируется. Отключение кнопки на панели инструментов не запрещает редактирование при выделении, для запрещения нужно отключить действие. (не используется если указан userSet)
         * @property {number} [userSet] если указано переопределяет actionsEnabled Gis.UI.USERSET.FULL | Gis.UI.USERSET.VIEW_ONLY
         */
        options: {
            style: undefined,
            actionsEnabled: 'ellipse marker measure move object path polygon sector select zoom heatmap overlay areal-relief visibility geo geo-path',
            userSet: undefined
        },
        getStyle: function (type) {
            return this.options.style[type];
        },
        getActionsActive: function () {
            var allActions = 'select zoom ellipse marker measure layers relief move object path polygon sector heatmap overlay areal-relief visibility geo geo-path';
            switch (this.options.userSet) {
                case Gis.UI.USERSET.FULL:
                    return  allActions;
                case Gis.UI.USERSET.VIEW_ONLY:
                    return 'select move zoom measure heatmap areal-relief visibility geo geo-path';
                default:
                    if (this.options.userSet && this.options.userSet.length) {
                        return this.options.userSet.reduce(function (prev, curr) {
                            return prev + (allActions.indexOf(curr) >= 0 ? curr + ' ' : '');
                        }, '').trim();
                    } else {
                        return this.options.actionsEnabled;
                    }
            }
        },
        _initActions: function () {
            var actionsSrc = this.getActionsActive(),
                actions = (Gis.Util.isArray(actionsSrc) ? actionsSrc : actionsSrc.split(' ')), self = this;
            actions.forEach(function (action) {
                if (action) {
                    Gis.UI.Action[action](self);
                }
            });
        },
        initialize: function (map, data) {
            var self = this;
            this._geoSystemConverter = new Gis.UI.CoordinateConverter();
            this._geoSystemConverter.on('skchanged', function (e) {
                this.fire('skchanged', e)
            }, this);
            Gis.BaseClass.prototype.initialize.call(this, data);
            this._initActions();
            this.options.style = (data && data.style) || Gis.UI.DEFAULT_STYLE;
            this._resizeFunction = function () {
                self._recalculateContainerStyles();
            };
            this._keyDown = function (e) {
                self.keyDown(e);
            };
            this._mouseMove = function (e) {
                self.mouseMove(e);
            };
            this._contextMenu = function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            this._mouseDown = function (e) {
                self.mouseDown(e);
            };
            this._mouseUp = function (e) {
                self.mouseUp(e);
            };
            this._keyUp = function (e) {
                self.keyUp(e);
            };
            if (map) {
                this.attachToMap(map);
            }
        },
        /**
         * Текущий конвертер координат
         * @returns {object}
         */
        getGeoConverter: function () {
            return this._geoSystemConverter;
        },
        _setContainerStyle: function () {
            this._container.style.position = "relative";
            this._container.className += " gis-ui-container";
        },
        _addContainer: function (data) {
            function setIfDefine(div, pos, val) {
                if (val !== undefined) {
                    div.style[pos] = val;
                }
            }

            var div = document.createElement('div');
            div.className += " " + data.className + " ";
            div.style.position = 'absolute';
            setIfDefine(div, 'top', data.top);
            setIfDefine(div, 'left', data.left);
            setIfDefine(div, 'right', data.right);
            setIfDefine(div, 'bottom', data.bottom);
            this._container.appendChild(div);
            this._containers[data.className] = div;
            return div;
        },
        _createTopContainer: function () {
            this._addContainer({className: Gis.UI.POSITION.TOP, left: 0, top: 0});
        },
        _createBottomContainer: function () {
            this._addContainer({className: Gis.UI.POSITION.BOTTOM, left: 0, bottom: 0});
        },
        _createLeftContainer: function () {
            this._addContainer({className: Gis.UI.POSITION.LEFT, left: 0, top: 0});
        },
        _createRightContainer: function () {
            this._addContainer({className: Gis.UI.POSITION.RIGHT, right: 0, top: 0});
        },
        _createRightInnerContainer: function () {
            this._addContainer({className: Gis.UI.POSITION.RIGHT_INNER, right: 0, top: 0});
        },
        _createLeftInnerContainer: function () {
            this._addContainer({className: Gis.UI.POSITION.LEFT_INNER, left: 0, top: 0});
        },
        calculateStyles: function () {
            var topContainer = this._containers[Gis.UI.POSITION.TOP],
                bottomContainer = this._containers[Gis.UI.POSITION.BOTTOM],
                leftContainer = this._containers[Gis.UI.POSITION.LEFT],
                rightContainer = this._containers[Gis.UI.POSITION.RIGHT],
                rightInnerContainer = this._containers[Gis.UI.POSITION.RIGHT_INNER],
                leftInnerContainer = this._containers[Gis.UI.POSITION.LEFT_INNER],
                isBottomActive = $(bottomContainer).is(':visible'),
                isTopActive = $(topContainer).is(':visible'),
                topContainerHeight = isTopActive ? $(topContainer).outerHeight(true) : 0,
                bottomContainerHeight = isBottomActive ? $(bottomContainer).outerHeight(true) : 0,
                containerWidth = $(this._container).width(),
                containerHeight = $(this._container).height(),
                leftContainerWidth = $(leftContainer).is(':visible') ? $(leftContainer).outerWidth(true) : 0,
                rightContainerWidth = $(rightContainer).is(':visible') ? $(rightContainer).outerWidth(true) : 0,
                availWidthForInner = (containerWidth - leftContainerWidth - rightContainerWidth) / 2,
                availHeightForInner = containerHeight - topContainerHeight - bottomContainerHeight,
                zIndex = 50,
                isGridEnabled;
            $(leftContainer).css({
                paddingBottom: !isBottomActive ? 24 : 0
            });
            isGridEnabled = this.getMap()._getMapOffset && this.getMap()._getMapOffset() ||  0;
            leftContainer.style.top = topContainerHeight + "px";
            rightContainer.style.top = topContainerHeight + "px";
            rightInnerContainer.style.top = isGridEnabled + topContainerHeight + "px";
            rightInnerContainer.style.right = isGridEnabled + rightContainerWidth + "px";
            rightInnerContainer.style.width = ($(rightInnerContainer).width() || availWidthForInner) + "px";
            leftInnerContainer.style.width = ($(rightInnerContainer).width() || availWidthForInner) + "px";
            leftInnerContainer.style.top = topContainerHeight + "px";
            leftInnerContainer.style.left = leftContainerWidth + "px";
            leftInnerContainer.style.zIndex = zIndex;
            rightInnerContainer.style.zIndex = zIndex;
            rightContainer.style.zIndex = zIndex;
            leftContainer.style.zIndex = zIndex;
            topContainer.style.zIndex = zIndex + 1;
            bottomContainer.style.zIndex = zIndex;
            $(rightInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_WIDTH, availWidthForInner);
            $(leftInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_WIDTH, availWidthForInner);
            $(rightInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner - isGridEnabled * 2);
            $(leftInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner - isGridEnabled * 2);
            $(leftContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner);
            $(rightContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner);
            if (L.Grid) {
                L.Grid.OFFSET_TEXT_TOP = topContainerHeight;
                L.Grid.OFFSET_TEXT_LEFT = leftContainerWidth;
                L.Grid.OFFSET_TEXT_RIGHT = rightContainerWidth;
                L.Grid.OFFSET_TEXT_BOTTOM = bottomContainerHeight;
            }
        }, _recalculateContainerStyles: function () {
        this.fire('presizerecalculated');
        this.calculateStyles();
        this.fire('sizerecalculated');
        },
        /**
         * Возвращает текущее доступное пространство в пикселях
         * @param {string} position
         * @returns {{width: (number), height: (number)}}
         */
        getAvailableContainerBounds: function (position) {
            var $container, data, containerClass;
            containerClass = Gis.UI.POSITION[position.toUpperCase()];
            if (this._containers[containerClass]) {
                $container = $(this._containers[containerClass]);
                data = $container.data();
                return {
                    width: data[Gis.UI.DATA_SELECTORS.AVAILABLE_WIDTH] || $container.width(),
                    height: data[Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT] || $container.height()
                };
            }
        },
        _createWidgetContainers: function () {
            this.addContainer(Gis.Widget.container({position: 'TOP'}));
            this.addContainer(Gis.Widget.container({position: 'LEFT'}));
            this.addContainer(Gis.Widget.container({position: 'RIGHT'}));
            this.addContainer(Gis.Widget.container({position: 'LEFT_INNER'}));
            this.addContainer(Gis.Widget.container({position: 'RIGHT_INNER'}));
            this.addContainer(Gis.Widget.container({position: 'BOTTOM'}));
        },
        _createContainers: function () {
            this._createTopContainer();
            this._createBottomContainer();
            this._createLeftContainer();
            this._createRightContainer();
            this._createRightInnerContainer();
            this._createLeftInnerContainer();
            this._recalculateContainerStyles();
            this._createWidgetContainers();
            $(window).on('resize', this._resizeFunction);
        },
        _initializeHTML: function () {
            this._container = this._map.getMapContainer().parentNode;
            this._setContainerStyle();
            this._createContainers();
        },
        _checkPredefinedState: function () {
            var self = this;
            switch (this.options.userSet) {
                case Gis.UI.USERSET.FULL:
                    this.addWidget(Gis.Widget.instruments());
                    this.addWidget(Gis.Widget.mapcontrol());
                    this.addWidget(Gis.Widget.scheme());
                    this.addWidget(Gis.Widget.sliderHorisontal());
                    this.addWidget(Gis.Widget.sliderVertical());
                    break;
                case Gis.UI.USERSET.VIEW_ONLY:
                    this.addWidget(Gis.Widget.instruments({
                        instruments: 'select move zoom measure'
                    }));
                    this.addWidget(Gis.Widget.mapcontrol());
                    this.addWidget(Gis.Widget.scheme());
                    this.addWidget(Gis.Widget.sliderHorisontal());
                    this.addWidget(Gis.Widget.sliderVertical());
                    break;
                default:
                    if (this.options.userSet && this.options.userSet.length) {
                        this.options.userSet.forEach(function (value) {
                            if (Gis.Widget[value]) {
                                self.addWidget(Gis.Widget[value](self.options.userSet));
                            }
                        });
                    }
            }
        },
        /**
         * Ассоциировать с картой
         * @param map
         * @returns {Gis.UI}
         */
        attachToMap: function (map) {
            this._map = map;
            if (!this._attached) {
                if (Gis.Map.GridVisibilityChanged) {
                    this._map.on(Gis.Map.GridVisibilityChanged.TYPE, this._resizeFunction, this);
                }
                map.setDraggableEnabled(false);
                this._initializeHTML();
                this._attached = true;
                this.initKeyNavigation();
                this.initMouseNavigation();
                this._checkPredefinedState();
            }
            return this;
        },
        /**
         * получить объект карты
         * @returns {Gis.Map}
         */
        getMap: function () {
            return this._map;
        },
        recalculateMaxSize: function () {
            var topSize = this._widgetContainers[Gis.UI.POSITION.TOP].getNeedSize(),
                bottomSize = this._widgetContainers[Gis.UI.POSITION.BOTTOM].getNeedSize(true),
                leftSize = this._widgetContainers[Gis.UI.POSITION.LEFT].getNeedSize(),
                leftInnerSize = this._widgetContainers[Gis.UI.POSITION.LEFT_INNER].getNeedSize(),
                rightSize = this._widgetContainers[Gis.UI.POSITION.RIGHT].getNeedSize(),
                rightInnerSize = this._widgetContainers[Gis.UI.POSITION.RIGHT_INNER].getNeedSize(),
                summWidth, summHeight, topAndBottomHeight, $elements;
            summWidth = leftSize[0] + leftInnerSize[0] + rightSize[0] + rightInnerSize[0];
            topAndBottomHeight = topSize[1] + bottomSize[1];
            summHeight = Math.max(topAndBottomHeight + rightInnerSize[1], topAndBottomHeight + leftInnerSize[1] , topAndBottomHeight , topAndBottomHeight + rightSize[1] );
            $elements = $('html, body, div#map, div#leaflet-map-gis');
            $elements.css('minWidth', Math.max(topSize[0], summWidth));
            $elements.css('minHeight', Math.max(summHeight));
        },
        hideAll: function (exclude) {
            for (var key in this._widgetContainers) {
                if (this._widgetContainers.hasOwnProperty(key)) {
                    this._widgetContainers[key].hideChilds(exclude);
                }
            }
        },
        showAll: function () {
            for (var key in this._widgetContainers) {
                if (this._widgetContainers.hasOwnProperty(key)) {
                    this._widgetContainers[key].showChilds();
                }
            }
        },
        /**
         * Добавить виджет
         * @param {Gis.Widget.Base} widget
         * @returns {Gis.UI}
         */
        addWidget: function (widget) {
            if (widget.isControlAvailable(null, this._map)) {
                var pos = Gis.UI.POSITION[widget.getPosition().toUpperCase()];
                this._widgetContainers[pos].addChild(widget);
                this.recalculateMaxSize();
            }
            this._recalculateContainerStyles();
            return this;
        },
        /**
         * Удалить виджет
         * @param {Gis.Widget.Base} widget
         * @returns {Gis.UI}
         */
        removeWidget: function (widget) {
            if (widget) {
                var pos = Gis.UI.POSITION[widget.getPosition().toUpperCase()];
                this._widgetContainers[pos].removeChild(widget);
                this.recalculateMaxSize();
            }
            this._recalculateContainerStyles();
            return this;
        },
        /**
         * Удалить виджет по его типу
         * @param {string} type
         * @returns {Gis.UI}
         */
        removeWidgetByType: function (type) {
            if (type) {
                var containers = this._widgetContainers,
                    wId;
                for (wId in containers) {
                    if (containers.hasOwnProperty(wId) && type) {
                        containers[wId].removeWidgetByType(type);
                    }
                }
            }
            return this;
        },
        /**
         * @param {Gis.Widget.Container} container
         * */
        addContainer: function (container) {
            //noinspection JSUnresolvedFunction
            var pos = Gis.UI.POSITION[container.getPosition().toUpperCase()];
            this._widgetContainers[pos] = container;
            container.onAdd(this);
            container.draw(this._containers[pos], this.getAvailableContainerBounds(pos));
            this._recalculateContainerStyles();
        },
        _initZoom: function (zoomOut) {
            var action;
            if (!this._lastAction || this._lastAction.getType() !== 'zoom') {
                if (this._lastAction) {
                    this._lastAction.closeAction();
                    this._lastAction = undefined;
                }
                action = Gis.UI.Action.zoom(this);
                if (!action.isExecuted()) {
                    this._lastAction = action;
                    if (Gis.UI.ActionController.getLastExecuted()) {
                        Gis.UI.ActionController.getLastExecuted().pause();
                    }
                    action.setData({noUI: true, zoomOut: zoomOut});
                    action.execute();
                }
            }
        },
        _initMove: function () {
            var action;
            if (!this._lastAction || this._lastAction.getType() !== 'move') {
                if (this._lastAction) {
                    this._lastAction.closeAction();
                    this._lastAction = undefined;
                }
                action = Gis.UI.Action.move(this);
                if (!action.isExecuted()) {
                    if (Gis.UI.ActionController.getLastExecuted()) {
                        Gis.UI.ActionController.getLastExecuted().pause();
                    }
                    action.setData({noUI: true});
                    action.execute();
                    this._lastAction = action;
                }
            }
        },
        keyDown: function (e) {
            var keyKodeSpace = 32, keyKodeAlt = 18, keyKodeCtrl = 17, zoomOut = false,
                keyCode = e.keyCode || parseInt(e.charCode, 10), isSpace = keyCode === keyKodeSpace,
                srcElement = e.srcElement || e.target , notTextElement = srcElement.type !== 'text';
            if (notTextElement && isSpace || (this._lastAction && (keyCode === keyKodeAlt || keyCode === keyKodeCtrl))) {
                if (e.ctrlKey) {
                    if (e.altKey) {
                        zoomOut = true;
                    }
                    this._initZoom(zoomOut);
                    e.preventDefault();
                } else {
                    this._initMove();
                    e.preventDefault();
                }
            }
        },
        mouseDown: function (e) {
            var rightButton = 2, leftButton = 0;
            if (e.originalEvent.button === rightButton) {
                this._secondButton = true;

                this._map.on('mouseup', this._mouseUp);
                this._map.on('mouseout', this._mouseUp);
            } else if (this._secondButton && e.originalEvent.button === leftButton) {
                this._secondButton = false;
                this._zoomStarted = true;
                this._oldDraggable = this._map.isDraggableEnabled();
                this._map.setDraggableEnabled(false);
                this._initZoom();
                this._map.on('mousemove', this._mouseMove);
                e.originalEvent.preventDefault();
            }
        },
        mouseUp: function (e) {
            this._secondButton = false;
            this._map.off('mouseup', this._mouseUp);
            this._map.off('mouseout', this._mouseUp);
            this._map.off('mousemove', this._mouseMove);
            if (this._zoomStarted === true) {
                if (this._lastAction) {
                    this._lastAction._onMouseUp(e);
                    this._lastAction.closeAction();
                    this._lastAction = undefined;
                }
                this._map.setDraggableEnabled(this._oldDraggable);
                if (Gis.UI.ActionController.getLastExecuted()) {
                    Gis.UI.ActionController.getLastExecuted().resume();
                }
            }
            this._zoomStarted = false;
        },
        mouseMove: function (e) {
            if (this._zoomStarted) {
                this._map.off('mousemove', this._mouseMove);
                this._lastAction._onMouseDown(e);
            }
        },
        keyUp: function (e) {
            var keyKodeSpace = 32, keyKodeCtrl = 17;
            if (this._lastAction && e.keyCode === keyKodeSpace) {
                this._lastAction.closeAction();
                this._lastAction = undefined;
                if (Gis.UI.ActionController.getLastExecuted()) {
                    Gis.UI.ActionController.getLastExecuted().resume();
                }
            } else if (this._lastAction && e.keyCode === keyKodeCtrl) {
                this._initMove();
            }
        },
        initKeyNavigation: function () {
            document.body.addEventListener('keydown', this._keyDown);
            document.body.addEventListener('keyup', this._keyUp);
        },
        initMouseNavigation: function () {
            //TODO move to UTIL
            if (navigator.userAgent.toLowerCase().indexOf('msie') === -1) {
                this._map.getMapContainer().addEventListener('contextmenu', this._contextMenu);
                this._map.on('mousedown', this._mouseDown);
            }
        }
    });
Gis.UI.version = window.GIS_UI_buildVersion || '1.0.4';
Gis.UI.POSITION = {
    TOP: 'gis-top-container',
    BOTTOM: 'gis-bottom-container',
    LEFT: 'gis-left-container',
    RIGHT: 'gis-right-container',
    LEFT_INNER: 'gis-left-inner-container',
    RIGHT_INNER: 'gis-right-inner-container'
};
Gis.UI.DATA_SELECTORS = {
    AVAILABLE_WIDTH: 'availableWidth',
    AVAILABLE_HEIGHT: 'availableHeight'
};
Gis.UI.USERSET = {
    NONE: undefined,
    FULL: ['instruments', 'mapcontrol', 'slidervertical', 'scheme', 'sliderhorisontal', 'controlmap', 'controlpostcenter', 'controlmapselector', 'controlobjectcenter', 'controlzoom', 'controlconnectionstate', 'controlmouseposition', 'zoom', 'move', 'select', 'measure', 'layers', 'relief', 'path', 'object', 'marker', 'polygon', 'ellipse', 'sector', 'schemesaveall', 'schemeload', 'schemeclear', 'heatmap', 'overlay', 'visibility', 'areal-relief', 'geo', 'geo-path'],
    VIEW_ONLY: ['instruments', 'mapcontrol', 'slidervertical', 'scheme', 'sliderhorisontal', 'controlpostcenter', 'controlmapselector', 'controlobjectcenter', 'controlzoom', 'controlconnectionstate', 'controlmouseposition', 'zoom', 'move', 'select', 'measure', 'layers', 'relief', 'heatmap', 'areal-relief', 'visibility', 'geo-path']
};