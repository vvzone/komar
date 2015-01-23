"use strict";

/**
 * Упрощает работу с HTML
 * @type {{listView: Function, hasClass: Function, addClass: Function, removeClass: Function, addEventListener: Function}}
 */
Gis.HTML = {
    /**
     * создает псевдоселект
     * @param {Object} options эмеленты списка
     * */
    listView: function (options) {
        var noText, html = "", rowsHTML = "", selectorButtonContainerClass = 'html-select-view-title-container', selectorButtonClass = 'html-select-view-selector', closedClass = 'closed', data, container, callBack, context, defaultValue;
        data = options.data;
        container = options.container;
        callBack = options.callback;
        context = options.context;
        noText = options.noText;
        defaultValue = options.defaultValue || (data && data[0]);
        function closeSelect() {
            this.style.display = 'none';
            Gis.HTML.addClass(this.parentNode.querySelector(selectorButtonContainerClass), closedClass);
        }
        function closeAllSelects() {
            var rows = document.querySelectorAll('.html-select-view'),
                selects = document.querySelectorAll("." + selectorButtonContainerClass),
                i = 0, len = selects.length;
            if (rows.length) {
                for (i = 0, len = rows.length; i < len; i += 1) {
                    rows[i].style.display = 'none';
                }
            }
            if (selects.length) {
                for (i = 0, len = selects.length; i < len; i += 1) {
                    Gis.HTML.addClass(selects[i], closedClass);
                }
            }
        }
        function openSelect() {
            this.style.display = 'block';
            Gis.HTML.removeClass(this.parentNode.querySelectorAll('.' + selectorButtonContainerClass), closedClass);
        }

        function rowClicked(callBack, context) {
            return function () {
                var titleContailer = this.parentNode.parentNode.querySelector('.html-select-view-title');
                titleContailer.setAttribute('data-value', this.getAttribute('data-value'));
                if (!noText) {
                    titleContailer.innerHTML = this.innerHTML;
                }
                Gis.HTML.removeClass(container.querySelectorAll('selected'), 'selected');
                Gis.HTML.addClass(this, 'selected');
                callBack.call(context, this.getAttribute('data-value'));
                closeSelect.call(this.parentNode);
            };
        }

        function rowKeyPressed(e) {
            var returnKeyCode = 13;
            if (e.keyCode === returnKeyCode || e.charCode === ("" + returnKeyCode)) {
                rowClicked.call(this, e);
            }
        }

        function titleClicked(e) {
            if (Gis.HTML.hasClass(this, closedClass)) {
                openSelect.call(this.parentNode.querySelector('.html-select-view'));
                e.stopPropagation();
                return false;
            }
            closeSelect.call(this.parentNode.querySelector('.html-select-view'));
        }

        function initEvents(callBack, context, container) {
            var rows = (container || document).querySelectorAll('.html-select-view-row');
            Gis.HTML.addEventListener(rows, 'click', rowClicked(callBack, context));
            Gis.HTML.addEventListener(rows, 'keypress', rowKeyPressed);
            if (!Gis.HTML.hasClass(document.body, 'list-initialized')) {
                Gis.HTML.addClass(document.body, 'list-initialized');
                Gis.HTML.addEventListener(document.body, 'click', closeAllSelects);
            }
            Gis.HTML.addEventListener((container || document).querySelector('.html-select-view-title-container'), 'click', titleClicked);
        }

        function initHtml(data, container, callBack, context, defaultValue) {
            if (data && data.forEach) {
                var dv = defaultValue.val,
                    dn = defaultValue && defaultValue.name;
                data.forEach(function (row) {
                    var val = row.val;
                    rowsHTML += "<li class='html-select-view-row" + (dv === val ? " selected" : "") + "' data-value='" + val + "'>" + row.name + "</li>";
                });
                html = "<div class='html-select-view-container'>" +
                    "<div class='html-select-view-title-container " + closedClass + "'>" +
                        "<span class='html-select-view-title' data-value='" + dv + "'>" + dn + "</span>" +
                        "<span class='" + selectorButtonClass + " '></span>" +
                    "</div>" +
                    "<ul class='html-select-view' style='display: none'>" + rowsHTML + "</ul>" +
                    "</div>";
                container.innerHTML = html;
                initEvents(callBack, context, container);
                return container.querySelector('.html-select-view-container');
            }
        }

        return (function (container) {
            return {
                setValueSelected: function (value) {
                    var listElements, i, len, element, title, selected = false;
                    value = value + "";
                    Gis.HTML.removeClass(container.querySelectorAll('.selected'), 'selected');
                    listElements = container.querySelectorAll('.html-select-view-row');
                    title = container.querySelector('.html-select-view-title');
                    for (i = 0, len = listElements.length; i < len; i += 1) {
                        element = listElements[i];
                        if (element.getAttribute('data-value') === value) {
                            Gis.HTML.addClass(element, 'selected');
                            title.setAttribute('data-value', value);
                            selected =  true;
                            if (!noText) {
                                title.innerHTML = element.innerHTML;
                            }
                        }
                    }
                    if (!selected) {
                        Gis.HTML.removeClass(listElements, 'selected');
                        title.setAttribute('data-value', "");
                        title.innerHTML = "";
                    }
                }
            }
        }(initHtml(data, container, callBack, context, defaultValue)));
    },

    hasClass: function (el, name) {
        return (el.className.length > 0) &&
            new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
    },

    addClass: function (el, name) {
        if (el) {
            el.classList.add(name)
        }
    },

    removeClass: function (el, name) {
        var i;

        function replaceFn(w, match) {
            if (match === name) { return ''; }
            return w;
        }

        function replaceClass(el) {
            el.className = el.className
                .replace(/(\S+)\s*/g, replaceFn)
                .replace(/(^\s+|\s+$)/, '');
        }

        if (el) {
            if (el.className) {
                el.classList.remove(name);
            } else if (el.length) {
                for (i = el.length - 1; i >= 0; i -= 1) {
                    el[i].classList.remove(name);
                }
            }
        }
    },
    addEventListener: function (object, type, callback) {
        var id;
        if (object.addEventListener) {
            object.addEventListener(type, callback);
        } else if (object[0] && object[0].addEventListener) {
            for (id in object) {
                if (object.hasOwnProperty(id) && object[id].addEventListener) {
                    object[id].addEventListener(type, callback);
                }
            }
        }
    }
};
"use strict";
var style;

if (!window.jQuery) {
    document.write('\x3Cscript src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">\x3C/script>');
}
if (window.jQuery && !$(document.body).dialog) {
    document.write('\x3Cscript src="./libs/jqueryui/jquery-ui.js">\x3C/script>');
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = './libs/jqueryui/jquery-ui.css';
    document.head.appendChild(style);
}
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
        actionsEnabled: 'ellipse marker measure move object path polygon sector select zoom',
        userSet: undefined
    },
        getStyle: function (type) {
            return this.options.style[type];
        },
        getActionsActive: function () {
            switch (this.options.userSet) {
                case Gis.UI.USERSET.FULL:
                    return 'select zoom ellipse marker measure move object path polygon sector';
                case Gis.UI.USERSET.VIEW_ONLY:
                    return 'select move zoom measure';
                default:
                    return this.options.actionsEnabled;
            }
        },
        _initActions: function () {
            var actions = this.getActionsActive().split(' '), self = this;
            actions.forEach(function (action) {
                Gis.UI.Action[action](self);
            });
        },
        initialize: function (map, data) {
        var self = this;
        this._geoSystemConverter = new Gis.UI.CoordinateConverter();
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
    _recalculateContainerStyles: function () {
        var topContainer = this._containers[Gis.UI.POSITION.TOP],
            bottomContainer = this._containers[Gis.UI.POSITION.BOTTOM],
            leftContainer = this._containers[Gis.UI.POSITION.LEFT],
            rightContainer = this._containers[Gis.UI.POSITION.RIGHT],
            rightInnerContainer = this._containers[Gis.UI.POSITION.RIGHT_INNER],
            leftInnerContainer = this._containers[Gis.UI.POSITION.LEFT_INNER],
            topContainerHeight = $(topContainer).outerHeight(true),
            bottomContainerHeight = $(bottomContainer).outerHeight(true),
            containerWidth = $(this._container).width(),
            containerHeight = $(this._container).height(),
            leftContainerWidth = $(leftContainer).outerWidth(true),
            rightContainerWidth = $(rightContainer).outerWidth(true),
            availWidthForInner = (containerWidth - leftContainerWidth - rightContainerWidth) / 2,
            availHeightForInner = containerHeight - topContainerHeight - bottomContainerHeight;
        leftContainer.style.top = topContainerHeight + "px";
        rightContainer.style.top = topContainerHeight + "px";
        rightInnerContainer.style.top = topContainerHeight + "px";
        rightInnerContainer.style.right = rightContainerWidth + "px";
        rightInnerContainer.style.width = ($(rightInnerContainer).width() || availWidthForInner) + "px";
        leftInnerContainer.style.width = ($(rightInnerContainer).width() || availWidthForInner) + "px";
        leftInnerContainer.style.top = topContainerHeight + "px";
        leftInnerContainer.style.left = leftContainerWidth + "px";
        $(rightInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_WIDTH, availWidthForInner);
        $(leftInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_WIDTH, availWidthForInner);
        $(rightInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner);
        $(leftInnerContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner);
        $(leftContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner);
        $(rightContainer).data(Gis.UI.DATA_SELECTORS.AVAILABLE_HEIGHT, availHeightForInner);
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
            switch (this.options.userSet) {
                case Gis.UI.USERSET.FULL:
                    this.addWidget(Gis.Widget.instruments());
                    this.addWidget(Gis.Widget.mapcontrol());
                    this.addWidget(Gis.Widget.scheme());
                    this.addWidget(Gis.Widget.sliderLongitude());
                    this.addWidget(Gis.Widget.sliderLatitude());
                    break;
                case Gis.UI.USERSET.VIEW_ONLY:
                    this.addWidget(Gis.Widget.instruments({
                        instruments: 'select move zoom measure'
                    }));
                    this.addWidget(Gis.Widget.mapcontrol());
                    this.addWidget(Gis.Widget.scheme());
                    this.addWidget(Gis.Widget.sliderLongitude());
                    this.addWidget(Gis.Widget.sliderLatitude());
                    break;
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
    /**
     * Добавить виджет
     * @param {Gis.Widget.Base} widget
     * @returns {Gis.UI}
     */
    addWidget: function (widget) {
        var pos = Gis.UI.POSITION[widget.getPosition().toUpperCase()];
        this._widgetContainers[pos].addChild(widget);
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
        }
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
                Gis.UI.ActionController.getLastExecuted().pause();
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
                Gis.UI.ActionController.getLastExecuted().pause();
                action.setData({noUI: true});
                action.execute();
                this._lastAction = action;
            }
        }
    },
    keyDown: function (e) {
        var keyKodeSpace = 32, keyKodeAlt = 18, keyKodeCtrl = 17, zoomOut = false,
            keyCode = e.keyCode || parseInt(e.charCode, 10), isSpace = keyCode === keyKodeSpace,
            srcElement = e.srcElement || e.target ,notTextElement = srcElement.type !== 'text';
        if (notTextElement  && isSpace || (this._lastAction && (keyCode === keyKodeAlt || keyCode === keyKodeCtrl))) {
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
            Gis.UI.ActionController.getLastExecuted().resume();
        }
        this._zoomStarted = false;
    },
    mouseMove: function (e) {
        if (this._zoomStarted) {
            this._map.off('mousemove', this._mouseMove);
            this._initZoom();
            this._lastAction._onMouseDown(e);
        }
    },
    keyUp: function (e) {
        var keyKodeSpace = 32, keyKodeCtrl = 17;
        if (this._lastAction && e.keyCode === keyKodeSpace) {
            this._lastAction.closeAction();
            this._lastAction = undefined;
            Gis.UI.ActionController.getLastExecuted().resume();
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
    FULL: 1,
    VIEW_ONLY: 2
};
/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальный Программные Решения
 */
"use strict";

/**
 * Класс конвертер записи координат в различных системах
 * @class
 * @extends Gis.BaseClass
 */
Gis.UI.CoordinateConverter = Gis.BaseClass.extend(
    /** @lends Gis.UI.CoordinateConverter.prototype */
    {
        _baseSystem: 'GAUS-CRUGER', //внутренняя система PW.GIS
        _selectedSystem: 'WGS-84',
        _systems: {
            'angles': {
                'WGS-84': {
                    template: /([\d]{1,3})[\u00B0]*\s(\d{1,2})[']* (\d{1,2}[\.\d+]*)['']{0,2}(\s\w)*/,
                    fromBase: function (coordinate, longitude) {
                        var graduses, direction, minute, second;
                        direction = coordinate > 0 ? longitude ? "E" : 'N' : longitude ? "W" : 'S';
                        coordinate = Math.abs(coordinate);
                        graduses = parseInt(coordinate, 10);
                        minute = parseInt((coordinate - graduses) * 60, 10);
                        second = (parseFloat((((coordinate - graduses) * 60) - minute) * 60)).toFixed(1);
                        minute = minute < 10 ? "0" + minute : minute;
                        second = second < 10 ? "0" + second : second;
                        return graduses + String.fromCharCode('176') + ' ' + minute + '\' ' + second + '\'\' ' + direction;
                    },
                    toBase: function (coordinate) {
                        var values,
                            direction,
                            multiple = 1;
                        values = coordinate.match(this.template);
                        if (values && values.length) {
                            if (values[4]) {
                                direction = values[4].trim().toLowerCase();
                                switch (direction) {
                                    case 'w':
                                    case 's':
                                        multiple = -1;
                                        break
                                }
                            }
                            return ((parseFloat(values[1]) + parseFloat(values[2]) / 60 + parseFloat(values[3]) / 3600) * multiple);
                        }
                        return 0;
                    }
                },
                'SK-42': {
                    template: /([\d]{1,3})[\u00B0]*\s(\d{1,2}[\.\d*]*)[']*(\s\w)*/,
                    fromBase: function (coordinate, longitude) {
                        var graduses, direction, minute;
                        direction = coordinate > 0 ? longitude ? "E" : 'N' : longitude ? "W" : 'S';
                        coordinate = Math.abs(coordinate);
                        graduses = parseInt(coordinate, 10);
                        minute = ((coordinate - graduses) * 60).toFixed(3);
                        minute = minute < 10 ? "0" + minute : minute;
                        return graduses + String.fromCharCode('176') + ' ' + minute + '\' ' + direction;
                    },
                    toBase: function (coordinate) {
                        var values,
                            direction,
                            multiple = 1;
                        values = coordinate.match(this.template);
                        if (values && values.length) {
                            if (values[3]) {
                                direction = values[3].trim().toLowerCase();
                                switch (direction) {
                                    case 'w':
                                    case 's':
                                        multiple = -1;
                                        break
                                }
                            }
                            return ((parseFloat(values[1]) + parseFloat(values[2]) / 60) * multiple);
                        }
                        return 0;
                    }
                },
                'GAUS-CRUGER': {
                    template: /([\d]{1,3}(\d)*)\u00B0/,
                    fromBase: function (coordinate) {
                        return coordinate + String.fromCharCode('176');
                    },
                    toBase: function (coordinate) {
                        return (parseFloat(coordinate));
                    }
                }
            },
            'metric': {
                'distance': {
                    template: undefined
                }
            }
        },
        options: {
            availableSystems: [
                'WGS-84',
                'SK-42',
                'GAUS-CRUGER',
                'distance'
            ]
        },
        /**
         * преобразует строку из базовой записи в выбранную пользователем
         * @param {string} coordinate координата
         * @param {boolean} longitude
         */
        fromBase: function (coordinate, longitude) {
            if (coordinate) {
                var formater = this.getFormatByName(this._selectedSystem);
                if (formater && formater.fromBase) {
                    return formater.fromBase(coordinate, longitude);
                }
            }
            return "";
        },
        /**
         * преобразует строку в базовую запись
         * @param {string} coordinate координата
         */
        toBase: function (coordinate) {
            if (coordinate) {
                var formater = this.getFormat(coordinate);
                if (formater && formater.toBase) {
                    return formater.toBase(coordinate);
                }
            }
            return 0;
        },
        /**
         *  Поиск соответствия формата записи
         *  @param {string} coordinate
         *  @returns {object}
         */
        getFormat: function (coordinate) {
            var groupName, systemName;
            for (groupName in this._systems){
                if (this._systems.hasOwnProperty(groupName)){
                    for (systemName in this._systems[groupName]) {
                        if (this._systems[groupName].hasOwnProperty(systemName)){
                            if (coordinate.match(this._systems[groupName][systemName].template)) {
                                return this._systems[groupName][systemName];
                            }
                        }
                    }
                }
            }
        },
        /**
         *  Выбор формата по имени
         *  @param {string} name
         *  @returns {object}
         */
        getFormatByName: function (name) {
            var groupName;
            for (groupName in this._systems){
                if (this._systems.hasOwnProperty(groupName)){
                    if (this._systems[groupName][name]) {
                        return this._systems[groupName][name];
                    }
                }
            }
        }
});

/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
(function (G) {
    "use strict";
    var topBottomPanelHeight = '40px',
        topBottomPanelWidth = '100%',
        panelBackground = 'gray';
    G.UI.CONTAINER_CLASSES = {
        TOP: 'gis-top-container',
        BOTTOM: 'gis-bottom-container',
        LEFT: 'gis-left-container',
        RIGHT: 'gis-right-container',
        LEFT_INNER: 'gis-left-inner-container',
        RIGHT_INNER: 'gis-right-inner-container'
    };
    /**
     * Для частичного переопределения стилей использовать Gis.Util.extend(G.UI.DEFAULT_STYLE, {}/Свои стили/)
     * @type {{measure: {color: string, border: string, thickness: number, icon: {width: number, type: string}}, path: {border: string, thickness: number, selectedBorder: string, icon: {type: string, color: string}}, polygon: {color: string, border: string, selectedBorder: string, thickness: number, icon: {type: string, color: string}}, sector: {color: string, border: string, thickness: number, selectedBorder: string, angleLineColor: string, angleLineBorder: string, angleLineThickness: number}, ellipse: {color: string, border: string, thickness: number, selectedBorder: string}, marker: {foreColor: string, position: string, drawPoint: boolean}, zoom: {fill: {color: string}, line: {color: string, thickness: number}}}}
     */
    G.UI.DEFAULT_STYLE = {
        measure: {
            color: 'black',
            border: 'white',
            thickness: 2,
            icon: {width: 10, type: 'circle'}
        },
        path: {
            border: 'white',
            thickness: 2,
            selectedBorder: 'rgb(75, 84, 255)',
            icon: {type: 'm', color: '#AF2D51'}
        },
        polygon: {
            color: '#AF2D51',
            border: 'white',
            selectedBorder: 'rgb(75, 84, 255)',
            thickness: 2,
            icon: {type: 'circle', color: '#AF2D51'}
        },
        sector: {
            color: '#AF2D51',
            border: 'white',
            thickness: 2,
            selectedBorder: 'rgb(75, 84, 255)',
            angleLineColor: '#272727',
            angleLineBorder: 'white',
            angleLineThickness: 2
        },
        ellipse: {
            color: '#AF2D51',
            border: 'white',
            thickness: 2,
            selectedBorder: 'rgb(75, 84, 255)'
        },
        marker: {
            foreColor: '#ffffff',
            position: 'centerright',
            drawPoint: true
        },
        zoom: {
            fill: {color: 'rgba(0, 16, 235, 0.3)'},
            line: {color: 'rgba(0, 16, 235, 0.9)', thickness: 2}
        }
    };
    G.UI.DEFAULT_STYLE[G.UI.CONTAINER_CLASSES.TOP] = {
        width: topBottomPanelWidth,
        height: topBottomPanelHeight,
        background: panelBackground
    };
    G.UI.DEFAULT_STYLE[G.UI.CONTAINER_CLASSES.BOTTOM] = {
        width: topBottomPanelWidth,
        height: topBottomPanelHeight,
        background: panelBackground
    };
    G.UI.DEFAULT_STYLE[G.UI.CONTAINER_CLASSES.LEFT] = {
        width: "40px",
        height: topBottomPanelHeight,
        background: panelBackground
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
(function (G) {
    "use strict";

    G.UI.Util = {
        saveDataToFile: function (dataType, data) {
            var str = "этот текст будет сохранен в файл";
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("msie") != -1 && ua.indexOf("opera") == -1 && ua.indexOf("webtv") == -1) { //IE
                var mydoc = window.open();
                mydoc.document.write(str);
                mydoc.document.execCommand("saveAs",true,".xml");
            }
            else { //другие браузеры
                var mydoc = window.open("data:application/download;charset=utf-8;base64," + btoa(str));
            }
        }
    };
}(Gis));
"use strict";
/**
 *
 * @class
 * @extends Gis.BaseClass
 */
Gis.UI.Action = Gis.BaseClass.extend(
    /**
     * @lends Gis.UI.Action.prototype
     */
    {
    _type: undefined,
    _selectType: undefined,
    _executed: false,
    _buttonAtached: undefined,
    options: {
        dataBinded: undefined,
        noUI: false
    },
    _layerSelected: function (e) {
        var layer = e.layer, newAction, layerId;
        layerId = layer.getParentId() || layer.getId();
        layer = this._ui.getMap().getLayer(layerId);
        if (layer.getType() !== this._selectType) {
            newAction = Gis.UI.ActionController.getAction(layer.getType());
            if (newAction) {
                newAction.setData({dataBinded: layer});
                this._disable();
                newAction.execute();
            }
        } else {
            this._widget.bindData(layer);
        }
    },
    getFirstSelection: function () {
        var selected = this._ui.getMap().getSelected(),
            keys = Object.keys(selected);
        if (keys.length && selected[keys[0]].getType() === this._selectType) {
            return selected[keys[0]];
        }
        return undefined;
    },
    _layerUnSelected: function (e) {
        if (e.layer.getOriginalType() === this._selectType) {
            this._widget.bindData(undefined);
        }
    },
    initialize: function (ui, data) {
        var cached = Gis.UI.ActionController.getAction(this.getType()), self;
        if (!cached) {
            self = this;
            this._ui = ui;
            Gis.BaseClass.prototype.initialize.call(this, data);
            this._executeFunction = function () {
                if (!self._executed) {
                    self.fire('newactionexecuted', {action: self});
                    self.execute();
                }
            };
            Gis.UI.ActionController.pushAction(this);
        } else {
            throw new Error('You can not use constructor direct');
        }
    },
    getType: function () {
        return this._type;
    },
    isExecuted: function () {
        return this._executed;
    },
    attachToButton: function (button) {
        if (!this._buttonAtached) {
            button.addEventListener('click', this._executeFunction);
            this._buttonAtached = button;
        }
    },
    execute: function () {
        Gis.UI.ActionController.pushExecuted(this);
        this.options.dataBinded = this.options.dataBinded || this.getFirstSelection();
        this._executed = true;
        this._oldDraggable = this._ui.getMap().isDraggableEnabled();
        this._oldFilter = this._ui.getMap().getFilterSelect();
        if (this._buttonAtached) {
            $(this._buttonAtached).addClass(Gis.UI.Action.SELECTED_CLASS_NAME);
        }
        this.initEvents();
    },
    bindData: function (data) {
        this.options.dataBinded = data;
    },
    _disable: function () {
        this._executed = false;
        this._ui.getMap().setDraggableEnabled(this._oldDraggable);
        if (this._buttonAtached) {
            $(this._buttonAtached).removeClass(Gis.UI.Action.SELECTED_CLASS_NAME);
        }
        this.deInitEvents();
    },
    initEvents: function () {
        this._ui.getMap().on('layerselected', this._layerSelected, this);
        this._ui.getMap().on('layerunselected', this._layerUnSelected, this);
    },
    deInitEvents: function () {
        this._ui.getMap().off('layerselected', this._layerSelected, this);
        this._ui.getMap().off('layerunselected', this._layerUnSelected, this);
    },
    pause: function () {
        this.deInitEvents();
        if (this._widget) {
            this._widget.deactivate();
        }
    },
    resume: function () {
        this.initEvents();
        if (this._widget) {
            this._widget.activate();
        }
    },
    closeAction: function () {
        if (this._executed) {
            this._disable();
            this.options.noUI = false;
            Gis.UI.ActionController.popLastExecuted();
        }
    },
    getId: function () {
        this._id = this._id || Gis.Util.generateGUID();
        return this._id;
    }
});

Gis.UI.Action.SELECTED_CLASS_NAME = 'selected';
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Ellipse = G.UI.Action.extend({
        _type: 'ellipse',
        _selectType: 'ellipse',
        _classMapEllipse: "gis-map-ellipse",
        execute: function () {
            this._ui.getMap().clearSelectedOnClick(false);
            L.DomUtil.disableTextSelection();
            this._ui.getMap().filterSelect(G.UI.Action.Ellipse.type);
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapEllipse);
            this._widget = G.Widget.ellipseProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _update: function () {
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            L.DomUtil.enableTextSelection();
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapEllipse);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.Ellipse.type = 'ellipse';
    G.UI.Action.ellipse = function (ui, data) {
        var ellipse = G.UI.ActionController.getAction('ellipse');
        if (ellipse) {
            ellipse.setData(data);
            return ellipse;
        }
        return new G.UI.Action.Ellipse(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Marker = G.UI.Action.extend({
        _type: 'marker',
        _selectType: 'text',
        _classMapMarker: "gis-map-marker",
        execute: function () {
            if (!this._executed) {
                this._ui.getMap().filterSelect(G.UI.Action.Marker.type);
                G.UI.Action.prototype.execute.call(this);
                this._ui.getMap().setDraggableEnabled(false);
                $(this._ui.getMap().getMapContainer()).addClass(this._classMapMarker);
                this._widget = G.Widget.markerProperty({
                    dataBinded: this.options.dataBinded
                });
                this._ui.addWidget(this._widget);
            }
        },
        _disable: function () {
            if (this._executed) {
                this._ui.removeWidget(this._widget);
                G.UI.Action.prototype._disable.call(this);
                $(this._ui.getMap().getMapContainer()).removeClass(this._classMapMarker);
                this.options.dataBinded = undefined;
            }
        }
    });
    G.UI.Action.Marker.type = 'text';
    G.UI.Action.marker = function (ui, data) {
        var marker = G.UI.ActionController.getAction('marker');
        if (marker) {
            marker.setData(data);
            return marker;
        }
        return new G.UI.Action.Marker(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Measure = G.UI.Action.extend({
        _type: 'measure',
        _ui: undefined,
        _zoomBounds: undefined,
        _selectType: 'measurer',
        _classMapMeasure: "gis-map-measuring",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            L.DomUtil.enableTextSelection();
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapMeasure);
            this._widget = G.Widget.measureProperty();
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            L.DomUtil.disableTextSelection();
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapMeasure);
        }
    });
    G.UI.Action.measure = function (ui, data) {
        var measure = G.UI.ActionController.getAction('measure');
        if (measure) {
            measure.setData(data);
            return measure;
        }
        return new G.UI.Action.Measure(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Move = G.UI.Action.extend({
        _type: 'move',
        _classMapMove: "gis-map-moving",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._oldClearOnClick = this._ui.getMap().isClearOnClick();
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(true);
            this._ui.getMap().filterSelect(G.ObjectController.FILTER_NOTHING, this.options.noUI);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapMove);
            if (!this.options.noUI) {
                this._widget = G.Widget.zoomProperty();
                this._ui.addWidget(this._widget);
            }
        },
        _update: function () {
        },
        _disable: function () {
            if (!this.options.noUI) {
                this._ui.removeWidget(this._widget);
            }
            G.UI.Action.prototype._disable.call(this);
            this._ui.getMap().clearSelectedOnClick(this._oldClearOnClick);
            this._ui.getMap().filterSelect(undefined, this.options.noUI);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapMove);
        }
    });
    G.UI.Action.move = function (ui, data) {
        var move = G.UI.ActionController.getAction('move');
        if (move) {
            move.setData(data);
            return move;
        }
        return new G.UI.Action.Move(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Object = G.UI.Action.extend({
        _type: 'object',
        _selectType: 'image',
        _classMapObject: "gis-map-object",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapObject);
            this._widget = G.Widget.objectProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapObject);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.object = function (ui, data) {
        var object = G.UI.ActionController.getAction('object');
        if (object) {
            object.setData(data);
            return object;
        }
        return new G.UI.Action.Object(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Path = G.UI.Action.extend({
        _type: 'path',
        _selectType: 'path',
        _ui: undefined,
        _zoomBounds: undefined,
        _classMapPath: "gis-map-path",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            L.DomUtil.enableTextSelection();
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapPath);
            this._widget = G.Widget.pathProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            L.DomUtil.disableTextSelection();
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapPath);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.path = function (ui, data) {
        var path = G.UI.ActionController.getAction('path');
        if (path) {
            path.setData(data);
            return path;
        }
        return new G.UI.Action.Path(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Polyton = G.UI.Action.extend({
        _type: 'polygon',
        _selectType: 'polygon',
        _ui: undefined,
        _zoomBounds: undefined,
        _classMapPolyton: "gis-map-polygon",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            L.DomUtil.enableTextSelection();
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapPolyton);
            this._widget = G.Widget.polygonProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            L.DomUtil.disableTextSelection();
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapPolyton);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.polygon = function (ui, data) {
        var polygon = G.UI.ActionController.getAction('polygon');
        if (polygon) {
            polygon.setData(data);
            return polygon;
        }
        return new G.UI.Action.Polyton(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Sector = G.UI.Action.extend({
        _type: 'sector',
        _selectType: 'sector',
        _classMapSector: "gis-map-sector",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().clearSelectedOnClick(false);
            L.DomUtil.disableTextSelection();
            this._ui.getMap().filterSelect(G.UI.Action.Sector.type);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapSector);
            this._widget = G.Widget.sectorProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            L.DomUtil.enableTextSelection();
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapSector);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.Sector.type = 'sector';
    G.UI.Action.sector = function (ui, data) {
        var sector = G.UI.ActionController.getAction('sector');
        if (sector) {
            sector.setData(data);
            return sector;
        }
        return new G.UI.Action.Sector(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Select = G.UI.Action.extend({
        _type: 'select',
        _classMapSelecting: "gis-map-selecting",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.getMap().setDraggableEnabled(true);
            L.DomUtil.enableTextSelection();
            this._ui.getMap().filterSelect(G.ObjectController.FILTER_ALL, true);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapSelecting);
        },
        _disable: function () {
            G.UI.Action.prototype._disable.call(this);
            this._ui.getMap().filterSelect(G.ObjectController.FILTER_NOTHING, true);
            L.DomUtil.disableTextSelection();
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapSelecting);
        }
    });
    G.UI.Action.select = function (ui, data) {
        var select = G.UI.ActionController.getAction('select');
        if (select) {
            select.setData(data);
            return select;
        }
        return new G.UI.Action.Select(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Zoom = G.UI.Action.extend({
        _type: 'zoom',
        _ui: undefined,
        options: {
            zoomOut: false
        },
        _zoomOut: undefined,
        _zoomBounds: undefined,
        _classMapZoom: "gis-map-zooming",
        _classMapZoomOut: "gis-map-zooming-out",
        initialize: function (data) {
            var self = this;
            G.UI.Action.prototype.initialize.call(this, data);
            this._onKeyPress = this._onKeyPress || function (e) {
                var altCode = 18;
                if (e.keyCode === altCode || e.charCode === (altCode + "")) {
                    self._InitZoomOut();
                    return false;
                }
            };
            this._onKeyUp = this._onKeyUp || function (e) {
                self._deInitZoomOut();
            };
        },
        execute: function () {
            if (!this._executed) {
                G.UI.Action.prototype.execute.call(this);
                this._oldClearOnClick = this._ui.getMap().isClearOnClick();
                this._ui.getMap().clearSelectedOnClick(false);
                this._ui.getMap().setDraggableEnabled(false);
                this._ui.getMap().filterSelect(G.ObjectController.FILTER_NOTHING, this.options.noUI);
                L.DomUtil.disableTextSelection();
                $(this._ui.getMap().getMapContainer()).addClass(this._classMapZoom);
                if (this.options.zoomOut) {
                    this._InitZoomOut();
                }
                if (!this.options.noUI) {
                    this._widget = G.Widget.zoomProperty();
                    this._ui.addWidget(this._widget);
                }
            }
        },
        initEvents: function () {
            G.UI.Action.prototype.initEvents.call(this);
            var map = this._ui.getMap();
            map.on('mousemove', this._onMouseMove, this);
            document.body.addEventListener('keydown', this._onKeyPress);
            document.body.addEventListener('keyup', this._onKeyUp);
            this._ui.getMap().getMapContainer().addEventListener('keydown', this._onKeyPress);
            this._ui.getMap().getMapContainer().addEventListener('keyup', this._onKeyUp);
            map.on('mousedown', this._onMouseDown, this);
            map.on('mouseup', this._onMouseUp, this);
            map.on('mouseout', this._onMouseUp, this);
        },
        deInitEvents: function () {
            G.UI.Action.prototype.deInitEvents.call(this);
            var map = this._ui.getMap();
            map.off('mousemove', this._onMouseMove, this);
            map.off('mousedown', this._onMouseDown, this);
            document.body.removeEventListener('keydown', this._onKeyPress);
            document.body.removeEventListener('keyup', this._onKeyUp);
            this._ui.getMap().getMapContainer().removeEventListener('keydown', this._onKeyPress);
            this._ui.getMap().getMapContainer().removeEventListener('keyup', this._onKeyUp);
            map.off('mouseup', this._onMouseUp, this);
            map.off('mouseout', this._onMouseUp, this);
        },
        _InitZoomOut: function () {
            this._zoomOut = true;
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapZoomOut);
        },
        _deInitZoomOut: function () {
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapZoomOut);
            this._zoomOut = false;
        },
        _onMouseMove: function (e) {
            if (this._mouseDown) {
                var style = this._ui.getStyle('zoom')
                if (this._polygon) {
                    this._polygon.setData(G.Util.extend({}, style, G.Objects.Polygon.generateSquareLatLng(this._latlngStart, e.latLng)));
                } else {
                    this._polygon = G.polygon(G.Objects.Polygon.generateSquareLatLng(this._latlngStart, e.latLng));
                    this._polygon.setControllableByServer(false);
                    this._polygon.addTo(this._ui.getMap());
                }
                this._moved = true;
            }
        },
        _onMouseDown: function (e) {
            this._ui.getMap().setDraggableEnabled(false);
            this._latlngStart = e.latLng;
            this._moved = false;
            this._mouseDown = true;
        },
        _disableMove: function () {
            if (this._polygon) {
                this._ui.getMap().removeLayer(this._polygon);
                delete this._polygon;
            }
            this._moved = false;
            this._mouseDown = false;
        },
        _onMouseUp: function (e) {
            var map;
            if (this._mouseDown) {
                map = this._ui.getMap();
                if (this._moved) {
                    map.setZoom(G.Objects.Polygon.generateSquareLatLng(this._latlngStart, e.latLng));
                } else {
                    map.setCenter([e.latLng.latitude, e.latLng.longitude]);
                    if (this._zoomOut || e.originalEvent.altKey) {
                        map.zoomOut();
                    } else {
                        map.zoomIn();
                    }
                }
            }
            this._disableMove();
        },
        _disable: function () {
            if (this._executed) {
                this._deInitZoomOut();
                if (!this.options.noUI) {
                    this._ui.removeWidget(this._widget);
                }
                this._ui.getMap().clearSelectedOnClick(this._oldClearOnClick);
                G.UI.Action.prototype._disable.call(this);
                this._ui.getMap().filterSelect(undefined, this.options.noUI);
                this._disableMove();
                this.options.zoomOut = false;
                L.DomUtil.enableTextSelection();
                $(this._ui.getMap().getMapContainer()).removeClass(this._classMapZoom);
            }
        }
    });
    G.UI.Action.zoom = function (ui, data) {
        var zoom = G.UI.ActionController.getAction('zoom');
        if (zoom) {
            zoom.setData(data);
            return zoom;
        }
        return new G.UI.Action.Zoom(ui, data);
    };
}(Gis));
/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.ActionController = {
        _list: {},
        _listExecuted: [],
        pushAction: function (action) {
            var type = action.getType();
            if (!this._list[type]) {
                this._list[type] = action;
            }
        },
        _getByLayerType: function (type) {
            var index;
            for (index in this._list) {
                if (this._list.hasOwnProperty(index)) {
                    if (this._list[index]._selectType === type) {
                        return this._list[index];
                    }
                }
            }
        },
        getAction: function (type) {
            var element = this._list[type];
            return element || this._getByLayerType(type);
        },
        getFirstAction: function () {
            return this._list[Object.keys(this._list)[0]];
        },
        pushExecuted: function (action) {
            this._listExecuted.push(action);
        },
        popLastExecuted: function () {
            return this._listExecuted.pop();
        },
        getLastExecuted: function () {
            return this._listExecuted[this._listExecuted.length - 1];
        }
    };
}(Gis));
"use strict";
/**
 *
 * @namespace
 */
Gis.Widget = Gis.Widget || {};
/**
 * Базовый класс для виджета
 * @requires jQuery
 * @class
 * @extends Gis.BaseClass
 */
Gis.Widget.Base = Gis.BaseClass.extend(
    /** @lends Gis.Widget.Base */
    {
        _type: undefined,
        options: {
            position: "TOP",
            enabled: true
        },
        templateToCoordinate: function (value) {
            var converter = this._containerController.getUIAttached().getGeoConverter();
            return converter.toBase(value);
        },
        coordinateToTemplate: function (value, longitude) {
            var converter = this._containerController.getUIAttached().getGeoConverter();
            return converter.fromBase(value, longitude);
        },
        canFitTo: function (container) {
            return true;
        },
        onRemove: function () {
            this._deInitEvents();
            this._$div.remove();
        },
        onAdd: function (container) {
            this.container = container.getContainer();
            this._containerController = container;
            this.initHTML();
            this._initEvents();
        },
        initHTML: function () {
            this._$div = $('<div class="' + Gis.Widget.Base.CLASS_NAME + '"/>');
        },
        /**
         * return type of the Widget
         * */
        getType: function () {
            return this._type;
        },
        /**
         * добавляет в выбранный контайнер
         * @param {Gis.Widget.Container} container
         * */
        addTo: function (container) {
            container.addChild(this);
        },

        /**
         * return position of the Widget
         * @return {string | Array} position of the Widget
         * */
        getPosition: function () {
            return this.options.position;
        },
        _deInitEvents: function () {

        },
        _initEvents: function () {

        },


        /**
         *  после добавления вызывается рендер в html
         * */
        draw: function () {
            this.container.appendChild(this._$div[0]);
        },
        getWidth: function () {
            return this._$div.width();
        },
        getHeight: function () {
            return this._$div.height();
        }
    }
);
Gis.Widget.Base.CLASS_NAME = 'gis-widget';
Gis.Widget.Base.TITLE_CLASS = 'gis-widget-title';
Gis.Widget.Base.REVERT_CLASS = 'gis-widget-revert';
Gis.Widget.Base.GO_CLASS = 'gis-widget-go';
Gis.Widget.TYPE = {};

"use strict";
/**
 *
 * @class
 * @extends Gis.BaseClass
 */
Gis.Widget.Button = Gis.BaseClass.extend(
    /**
     * @lends Gis.Widget.Button.prototype
     */
    {
    required: ['className', 'action'],

        /**
         * Допустимые параметры
         * @type {object}
         * @property {Gis.UI.Action} action
         * @property {string} [tag='li']
         * @property {string} [className]
         */
    options: {
        tag: 'li',
        className: undefined,
        action: undefined
    },
    getButton: function () {
        var span;
        if (!this._node) {
            this._node = document.createElement(this.options.tag);
            span = document.createElement("span");
            this._node.appendChild(span);
            this._node.className = Gis.Widget.Button.BUTTON_CLASS_NAME + ' ' + this.options.className;
            this.options.action.attachToButton(this._node);
        }
        return this._node;
    },
    getId: function () {
        this._id = this._id || Gis.Util.generateGUID();
        return this._id;
    },
    getAction: function () {
        return this.options.action;
    }
});
Gis.Widget.Button.BUTTON_CLASS_NAME = 'gis-instruments-button';
/**
 * Container for gui Widgets
 */
(function (G) {
    "use strict";
    G.Widget.ContainerBehavior = {
        child: [],
        /**
         * @param {Gis.Widget.Base} Widget
         * **/
        addChild: function (Widget) {
            if (!this.containsChild(Widget) && Widget.canFitTo(this)) {
                this.child.push(Widget);
                Widget.onAdd(this);
            }
        },
        /**
         * @param {Gis.Widget.Base} Widget
         * **/
        removeChild: function (Widget) {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (Widget === this.child[i]) {
                    delete this.child[i];
                }
            }
            Widget.onRemove();
        },
        removeWidgetByType: function (type) {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (type === this.child[i].getType()) {
                    this.child[i].onRemove();
                    delete this.child[i];
                }
            }
        },
        containsChild: function (Widget) {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (Widget === this.child[i]) {
                    return true;
                }
            }
            return false;
        }
    };
}(Gis));

"use strict";
Gis.Widget.TYPE.CONTAINER = 1;
/**
 *
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.Container = Gis.Widget.Base.extend(
    /**
     * @lends Gis.Widget.Container.prototype
     */
    {
    _className: '',
    includes: Gis.Widget.ContainerBehavior,
    _$container: undefined,
    _type: Gis.Widget.TYPE.CONTAINER,
    options: {
        width: undefined,
        height: undefined
    },
    initializeHTMLcontainer: function () {
        this._$container = $('<div style="position: relative;" class="' + Gis.Widget.Base.CLASS_NAME + ' ' + Gis.Widget.Container.CLASS_NAME + ' ' + this._className + '"/>');
    },
    initialize: function (data) {
        Gis.Widget.Base.prototype.initialize.call(this, data);
        this.initializeHTMLcontainer();
    },
    onAdd: function (ui) {
        this._ui = ui;
    },
    getUIAttached: function () {
        return this._ui;
    },
    draw: function (container, bounds) {
        $(container).append(this._$container);
    },

    getContainer: function () {
        return this._$container[0];
    },
    getAvailableWidth: function () {
        var currWidth = this.getWidth();
        this.child.forEach(function (child) {
            currWidth -= $(child).width();
        });
    },
    getAvailableHeight: function () {
        var height = this.getHeight();
        this.child.forEach(function (child) {
            height -= $(child).height();
        });
    },
    getWidth: function () {
        return this._ui.getAvailableContainerBounds(this.options.position).width;
    },
    getHeight: function () {
        return this._ui.getAvailableContainerBounds(this.options.position).height;
    },

    addTo: function (ui) {
        ui.addContainer(this);
    }
});

Gis.Widget.Container.CLASS_NAME = 'gis-widget-container';

Gis.Widget.container = function (data) {
    return new Gis.Widget.Container(data);
};

"use strict";
var buttons;

buttons = {
    select: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-select', action: Gis.UI.Action.select(ui)});
    },
    move: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-move', action: Gis.UI.Action.move(ui)});
    },
    zoom: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-zoom', action: Gis.UI.Action.zoom(ui)});
    },
    measure: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-measure', action: Gis.UI.Action.measure(ui)});
    },
    marker: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-marker', action: Gis.UI.Action.marker(ui)});
    },
    object: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-object', action: Gis.UI.Action.object(ui)});
    },
    path: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-path', action: Gis.UI.Action.path(ui)});
    },
    polygon: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-polygon', action: Gis.UI.Action.polygon(ui)});
    },
    ellipse: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-ellipse', action: Gis.UI.Action.ellipse(ui)});
    },
    sector: function (ui) {
        return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-sector', action: Gis.UI.Action.sector(ui)});
    }
};
/**
 * Панель инструментов
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.Instruments = Gis.Widget.Base.extend(
    /**
     * @lends Gis.Widget.Instruments.prototype
     */
    {
    _type: 'instruments',
    _buttons: {},
        /**
         * Допустимые опции
         * @type {object}
         * @property {object} [instruments='select move zoom measure separator marker object path polygon ellipse sector'] активные кнопки
         */
    options: {
        instruments: 'select move zoom measure separator marker object path polygon ellipse sector',
        position: "left",
        enabled: true
    },
    _newActionExecuted: function (event) {
        var id, actionExecuted, actionId;
        actionExecuted = event.action;
        actionId = actionExecuted.getId();
        for (id in this._buttons) {
            if (this._buttons.hasOwnProperty(id) && this._buttons[id].getId() !== actionId) {
                this._buttons[id].getAction().closeAction();
            }
        }
    },
    onAdd: function (container) {
        var self, instruments, availableButtons, liTemp, button;
        Gis.Widget.Base.prototype.onAdd.call(this, container);
        self = this;
        instruments = this.options.instruments.split(' ');
        availableButtons = buttons;
        instruments.forEach(function (value) {
            if (availableButtons.hasOwnProperty(value) && Gis.UI.ActionController.getAction(value)) {
                button = availableButtons[value](self._containerController.getUIAttached());
                button.getAction().on('newactionexecuted', self._newActionExecuted, self);
                self._list.appendChild(button.getButton());
                self._buttons[button.getId()] = button;
            }
            if (value === 'separator') {
                liTemp = document.createElement('li');
                liTemp.className = Gis.Widget.Button.BUTTON_CLASS_NAME + ' gis-instruments-button-separator';
                self._list.appendChild(liTemp);
            }
        });
        this.draw();
        Gis.UI.ActionController.getFirstAction().execute();
    },
    _deInitEvents: function () {
        this._containerController.getUIAttached().off('sizerecalculated', this.setWidth, this);
    },
    _initEvents: function () {
        this._containerController.getUIAttached().on('sizerecalculated', this.setWidth, this);
    },
    setWidth: function () {
        this._$div.css({
            width: this._containerController.getWidth(),
            height: this._containerController.getHeight()
        });
    },
    initHTML: function () {
        Gis.Widget.Base.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.Instruments.CLASS_NAME);
        this.setWidth();
        this._list = document.createElement('ul');
        this._list.className = "instruments-list";
        this._$div[0].appendChild(this._list);
    },
    draw: function () {
        Gis.Widget.Base.prototype.draw.call(this);
    }
});

Gis.Widget.Instruments.CLASS_NAME = 'gis-widget-instruments';
Gis.Widget.instruments = function (data) {
    return new Gis.Widget.Instruments(data);
};

/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.Widget.ZoomBehavior = {
        getConvertedZoom: function () {
            return this._containerController.getUIAttached().getMap().getZoom();
        },
        _getZoomValues: function () {
            var data = [],
                map = this._containerController.getUIAttached().getMap(),
                min = map.getMinZoom(),
                max = map.getMaxZoom(),
                current;
            for (current = max; current >= min; current -= 1) {
                data.push({
                    val: current,
                    name: current
                });
            }
            return data;
        }
    };

}(Gis));
"use strict";

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
            this._zoomIn = function () {
                self._containerController.getUIAttached().getMap().zoomIn();
            };
            this._centerFromLayer = function (e) {
                var center = self._lastSelected.getCenter();
                if (e && e.rows &&
                        (e.rows.indexOf('latitude') >= 0 || e.rows.indexOf('longitude') >= 0 ||
                            e.rows.indexOf('latitudes') >= 0 || e.rows.indexOf('longitudes') >= 0) &&
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
        setWidth: function () {
            this._$div.css({
                width: this._containerController.getWidth(),
                height: this._containerController.getHeight()
            });
        },
        _postCenterHtml: function () {
            return "<div class='gis-control-square-button' id='gis-post-center'><span></span></div><div class='post-list'></div>";
        },
        _generateControlsHtml: function () {
            var html = "<ul class='gis-widget-control'>";
            html += "<li class='gis-control-element gis-map-selector'><span>Карта</span><div id='gis-maps-container'></div></li>";
            html += "<li class='gis-control-element gis-post-center'>" + this._postCenterHtml() + "</li>";
            html += "<li class='gis-control-element gis-object-center'><div class='gis-control-square-button' id='gis-object-center'><span></span></div></li>";
            html += "<li class='gis-control-element gis-zoom-selector'>" +
                "<div id='gis-widget-control-zoom-selector'></div>" +
                "<div class='gis-control-square-button' id='gis-control-zoom-in'><span></span></div>" +
                "<div class='gis-control-square-button' id='gis-control-zoom-out'><span></span></div>" +
                "</li>";
            html += "<li class='gis-control-element gis-mouse-position'><div id='gis-widget-control-mouse-position'></div></li>";
            html += "</ul>";
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
        _getMapValues: function () {
            return [];
        },
        _createMapsList: function () {
            this._listMaps = Gis.HTML.listView({
                data: this._getMapValues(),
                container: $('#gis-maps-container', this._$list)[0],
                callback: this.mapSelected,
                context: this,
                defaultValue: {val: '', name: ''},
                noText: true
            });
        },
        _recalculatePost: function (e) {
            if (e && e.target && e.target.getType() === 'post') {
                this._createPostList();
            }
        },
        mapSelected: function (mapid) {
        },
        _createZoomList: function () {
            var defZoom;
            defZoom = this.getConvertedZoom();
            this._listZoom = Gis.HTML.listView({
                data: this._getZoomValues(),
                container: $('#gis-widget-control-zoom-selector', this._$list)[0],
                callback: this.zoomSelected,
                context: this,
                defaultValue: {val: this._containerController.getUIAttached().getMap().getZoom(), name: defZoom + "%"}
            });
        },
        initHTML: function () {
            Gis.Widget.Base.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.MapControl.CLASS_NAME);
            this.setWidth();
            this._$list = $(this._generateControlsHtml());
            this._$div.append(this._$list);
            this._createZoomList();
            this._createPostList();
            this._createMapsList();
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
            var converter = this._containerController.getUIAttached().getGeoConverter();
            $('#gis-widget-control-mouse-position', this._$div).html('X: ' + converter.fromBase(e.latLng.longitude, true) + ' Y: ' + converter.fromBase(e.latLng.latitude));
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
            this._containerController.getUIAttached().getMap().setCenter(layerToCenter.getLatLng());
            $('#gis-object-center', this._$div).addClass('active');
            this._objectCentered = true;
        },
        _deInitEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            map.off('zoomend', this.updateDataZoom, this);
            map.off('mousemove', this.updateDataPosition, this);
            this._$div.off('click', '#gis-control-zoom-in', this._zoomIn);
            this._$div.off('click', '#gis-control-zoom-out', this._zoomOut);
            this._$div.off('click', '#gis-object-center', this._centerObject);
            this._containerController.getUIAttached().off('sizerecalculated', this.setWidth, this);
            map.off('layerremoved layeradded', this._recalculatePost, this);
            this._deinitCenterOnObject();

        },
        _getFirstSelected: function () {
            var map = this._containerController.getUIAttached().getMap(), lastSelectedKey, selected;
            selected = map.getSelected();
            lastSelectedKey = Object.keys(selected)[0];
            selected = lastSelectedKey && selected[lastSelectedKey];
            return selected;
        },
        _initEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            map.on('zoomend', this.updateDataZoom, this);
            map.on('mousemove', this.updateDataPosition, this);
            this._$div.on('click', '#gis-control-zoom-in', this._zoomIn);
            this._$div.on('click', '#gis-control-zoom-out', this._zoomOut);
            this._lastSelected = this._getFirstSelected();
            this._$div.on('click', '#gis-object-center', this._centerObject);
            this._$div.on('click', '#gis-post-center', this._centerPost);
            map.on('layerremoved layeradded', this._recalculatePost, this);
            this._containerController.getUIAttached().on('sizerecalculated', this.setWidth, this);
        },
        draw: function () {
            Gis.Widget.Base.prototype.draw.call(this);
        }
    }
);

Gis.Widget.MapControl.CLASS_NAME = 'gis-widget-mapcontrol';
/**
 * Возвращает новый экземпляр @link {Gis.Widget.MapControl}
 * @param data
 * @returns {Gis.Widget.MapControl}
 */
Gis.Widget.mapcontrol = function (data) {
    return new Gis.Widget.MapControl(data);
};

"use strict";
/**
 * Топосхема
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.Scheme = Gis.Widget.Base.extend(
    /**
     * @lends Gis.Widget.Scheme.prototype
     */
    {
        includes: Gis.Widget.ZoomBehavior,
        _type: 'scheme',
        _buttons: {},
        options: {
            position: "right_inner",
            enabled: true
        },
        initialize: function (data) {
            var self = this;
            Gis.Widget.Base.prototype.initialize.call(this, data);
            this._layerClicked = function (e) {
                var layerId = $(this).data('layer-id'), layer;
                layer = self._containerController.getUIAttached().getMap().getLayer(layerId);
                if (layer) {
                    $('.gis-row-layer', self._$list).not($(this)).removeClass('selected');
                    $(this).addClass('selected');
                    self._containerController.getUIAttached().getMap().setCenter(layer.getCenter());
                    if (layer.isSelectable()) {
                        layer.fire('select', {force: true});
                    }
                }
                return false;
            };
            this._saveAllClick = function (e) {
                var map, layerIds, layer, layers = [];
                map = self._containerController.getUIAttached().getMap();
                layerIds = map.getLayerIDs();
                layerIds.forEach(function (id) {
                    layer = map.getLayer(id);
                    if (Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1) {
                        layers.push(layer);
                    }
                });
                if (window.navigator.msSaveBlob) {
                    window.navigator.msSaveBlob( new Blob([JSON.stringify(layers)]), 'data.json')
                } else {
                    window.open("data:application/octet-stream;base64," + btoa(JSON.stringify(layers)), 'Сохранить');
                }
            };
            this._fileChange = function (e) {
                function addObject (map, object) {
                    try {
                        var existsLayer = map.getLayer(object.id);
                        if (existsLayer && existsLayer.getType() === object.tacticObjectType) {
                            existsLayer.setData(object, undefined, true);
                            Gis.Logger.log('Object updated ' + existsLayer.getId(), existsLayer);
                        } else {
                            Gis.ObjectFactory.createObject(object).addTo(map);
                        }
                    } catch (err) {
                        Gis.Logger.log('Не удалось сохранить объект ' + err.message, object, err.stack);
                    }
                }
                var map, selected_file;
                map = self._containerController.getUIAttached().getMap();
                selected_file = this.files[0];
                this.value = '';
                var reader = new FileReader();
                reader.onload = (function(map) {
                    return function(e) {
                        var objects, i, len;
                        try {
                            objects = JSON.parse(window.atob(e.target.result.substr(e.target.result.indexOf(';base64,') + ';base64,'.length)));
                            for (i = 0, len = objects.length; i < len; i += 1) {
                                addObject(map, objects[i]);
                            }
                        } catch (err) {
                            Gis.Logger.log('Некорректные данные в файле', e.target.result, err.stack);
                        }
                    };
                })(map);
                reader.readAsDataURL(selected_file);
            };

            this._typeClicked = function () {
                self._setTypeOpen($(this).parent().data('type-id'));
            };
            this.allClearClick = function () {
                self._deleteLayersConfirm();
            };
            this.filterTypeSelected = function (type) {
                type = type || Gis.Widget.Scheme.TYPE_FILER_ALL;
                self._selectedType = type;
                var filterFunction = type === Gis.Widget.Scheme.TYPE_FILER_ALL ? function (layer) {
                    return Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1;
                } : function (layer) {
                    return layer.getType() === type;
                };
                self._fillList(filterFunction);
            };
            this.filterTypeClear = function () {
                self.filterTypeSelected();
                self._listTypes.setValueSelected(Gis.Widget.Scheme.TYPE_FILER_ALL);
            };
        },
        _deleteLayersConfirm: function () {
            this._$dialogRemove = this._$dialogRemove || this._initDialogClose();
            this._$dialogRemove.html('Вы действительно хотите очитстить топосхему?');
            this._$dialogRemove.dialog('open');
        },
        _initDialogClose: function () {
            var $dialog, id, self = this;
            id = "gis-clear-dialog";
            $dialog = $('#' + id);
            if (!$dialog.length) {
                $dialog = $('<div id=' + id + '/>');
                $dialog.appendTo($(document.body));
            }
            $dialog.dialog({
                dialogClass: "no-title-bar",
                autoOpen: false,
                modal: true,
                width: 280,
                closeOnEscape: true,
                minHeight: 10,
                draggable: true,
                buttons: [
                    {
                        text: 'Да',
                        click: function () {
                            self.clearAll();
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: 'Нет',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
            return $dialog;
        },
        clearAll: function () {
            var map, layerIds, layer;
            map = this._containerController.getUIAttached().getMap();
            layerIds = map.getLayerIDs();
            layerIds.forEach(function (id) {
                layer = map.getLayer(id);
                if (layer && Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1) {
                    map.removeLayer(map.getLayer(id));
                }
            });
        },
        onAdd: function (container) {
            Gis.Widget.Base.prototype.onAdd.call(this, container);
            this.draw();
            this.setBounds();
        },
        _getFirstSelected: function () {
            var map = this._containerController.getUIAttached().getMap(), lastSelectedKey, selected;
            selected = map.getSelected();
            lastSelectedKey = Object.keys(selected)[0];
            selected = lastSelectedKey && selected[lastSelectedKey];
            return selected;
        },
        _postCenterHtml: function () {
            return "<div class='gis-control-square-button' id='gis-post-center'><span></span></div><div class='post-list'></div>";
        },
        _footerHtml: function () {
            return "<div>" +
                "<div class='gis-widget-button' id='gis-save-all'></div>" +
                "<div class='gis-widget-button' id='gis-load-all'>" +
                    "<input type='file' name='file'>" +
                "</div>" +
                "<div class='gis-widget-button' id='gis-clear-all'></div>" +
                "</div>";
        },
        _contentHtml: function () {
            return "<ul id='gis-list-filtered'>" +
                "</ul>";
        },
        _headerHtml: function () {
            return "<div>" +
                "<div class='gis-widget-button' id='gis-show-all'><span></span></div>" +
                "<div id='gis-show-filter'></div>" +
                "</div>";
        },
        _generateControlsHtml: function () {
            var html = "<ul class='gis-widget-scheme'>";
            html += "<li class='gis-scheme-element gis-map-header'>" + this._headerHtml() + "</li>";
            html += "<li class='gis-scheme-element gis-map-middle'>" + this._contentHtml() + "</li>";
            html += "<li class='gis-scheme-element gis-map-footer'>" + this._footerHtml() + "</li>";
            html += "</ul>";
            return html;
        },
        _getTypeValues: function () {
            var map, layerIds, type, processed = [], layer, types = [{val: Gis.Widget.Scheme.TYPE_FILER_ALL, name: 'Все'}];
            map = this._containerController.getUIAttached().getMap();
            layerIds = map.getLayerIDs();
            layerIds.forEach(function (id) {
                layer = map.getLayer(id);
                type = layer.getType();
                if (processed.indexOf(type) < 0 && Gis.Widget.Scheme.TYPES.indexOf(type) >= 0) {
                    types.push({val: type, name: Gis.Widget.Scheme.TYPE_NAMES[type]});
                    processed.push(type);
                }
            });
            if (processed.indexOf(this._openedType) === -1) {
                this._openedType = undefined;
            }
            return types;
        },
        _getRowsFiltered: function (filterFunction) {
            var map, layerIds, type, layer, rows = {};
            map = this._containerController.getUIAttached().getMap();
            layerIds = map.getLayerIDs();
            layerIds.forEach(function (id) {
                layer = map.getLayer(id);
                type = layer.getOriginalType();
                if (type === layer.getType() && filterFunction(layer)) {
                    rows[type] = rows[type] || [];
                    rows[type].push(layer);
                }
            });
            return rows;
        },
        _fillList: function (filterFunction) {
            var id, i, len, row, html = "", rows = this._getRowsFiltered(filterFunction), selected = this._getFirstSelected();
            for (id in rows) {
                if (rows.hasOwnProperty(id)) {
                    html += "<li class='gis-type gis-type-" + id + " " +
                        (this._openedType && this._openedType === id ? 'selected' : '') + "' data-type-id='" + id + "'><span>" + Gis.Widget.Scheme.TYPE_NAMES[id] + "</span>" +
                        "<ul>";
                    for (i = 0, len = rows[id].length; i < len; i += 1) {
                        row = rows[id][i];
                        html += "<li class='gis-row-layer " + (selected && selected.getId() === row.getId() ? 'selected' : '') + "' data-layer-id='" + row.getId() + "'>" +
                            (row.getName ? row.getName() : row.getId()) + "</li>";
                    }
                    html += "</ul></li>";
                }
            }
            $('#gis-list-filtered', this._$list).html(html);
        },
        _getFilterSelected: function (types) {
            var i, len;
            if (this._selectedType) {
                types = types || this._getTypeValues();
                for (i = 0, len = types.length; i < len; i += 1) {
                    if (types[i].val === this._selectedType) {
                        return this._selectedType;
                    }
                }
                this._selectedType = undefined;
            }
        },
        _createTypeList: function () {
            var types = this._getTypeValues(), typeDefault = this._getFilterSelected(types) || Gis.Widget.Scheme.TYPE_FILER_ALL;
            this._listTypes = Gis.HTML.listView({
                data: types,
                container: $('#gis-show-filter', this._$list)[0],
                callback: this.filterTypeSelected,
                context: this,
                defaultValue: {val: typeDefault, name: Gis.Widget.Scheme.TYPE_NAMES[typeDefault]}
            });
        },
        initHTML: function () {
            Gis.Widget.Base.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.Scheme.CLASS_NAME);
            this._$div.css({
                position: 'absolute'
            });
            this._$list = $(this._generateControlsHtml());
            this._$div.append(this._$list);
            this._createTypeList();
        },
        setBounds: function () {
            var maxHeight, $_middle, $_header, $_footer, heightContainer;
            heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
            maxHeight = Math.min(heightContainer / 2, 300);
            $_middle = $('.gis-map-middle', this._$list);
            $_header = $('.gis-map-header', this._$list);
            $_footer = $('.gis-map-footer', this._$list);
            $_middle.css({
                height: (maxHeight - $_header.outerHeight(true) - $_footer.outerHeight(true) - this._$div.outerHeight(true) + this._$div.height())
            });
            this._$div.css({
                top: heightContainer - maxHeight
            });
        },
        _setTypeOpen: function (type) {
            if (!type) {
                $('.gis-type.selected', this._$list).removeClass('selected');
            } else {
                $('.gis-type.selected', this._$list).not($('.gis-type-' + type, this._$list)).removeClass('selected');
                if (this._openedType !== type) {
                    $('.gis-type-' + type, this._$list).addClass('selected');
                } else {
                    $('.gis-type-' + type, this._$list).removeClass('selected');
                    type = undefined;
                }
            }
            this._openedType = type;
        },
        _layerSelected: function (e) {
            var id = e.layer.getParentId() || e.layer.getId(), self = this;
            $('.gis-row-layer.selected', this._$list).removeClass('selected');
            $('.gis-row-layer', this._$list).each(function () {
                if (id === $(this).data('layer-id') && Gis.Widget.Scheme.TYPES.indexOf(e.layer.getType()) >= 0) {
                    if (e.layer.getType() !== self._openedType) {
                        self._setTypeOpen(e.layer.getType());
                    }
                    $(this).addClass('selected');
                }
            });
        },
        _layerUnSelected: function (e) {
            var $rows;
            $rows = $('.gis-row-layer.selected', this._$list);
            if ($rows.data('layer-id') === e.layer.getId()) {
                $rows.removeClass('selected');
            }
        },
        _deInitEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            map.off('layerremoved layeradded', this._recalculateList, this);
            this._$list.off('dblclick', '.gis-row-layer', this._layerClicked);
            this._$list.off('click', '.gis-type > span', this._typeClicked);
            this._$list.off('click', '#gis-show-all', this.filterTypeClear);
            this._$list.off('click', '#gis-save-all', this._saveAllClick);
            this._$list.off('change', '#gis-load-all > input', this._fileChange);
            this._$list.off('click', '#gis-clear-all', this.allClearClick);
            this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
            this._containerController.getUIAttached().getMap().off('layerselected', this._layerSelected, this);
            this._containerController.getUIAttached().getMap().off('layerunselected', this._layerUnSelected, this);
        },
        _recalculateList: function (e) {
            if (e && e.target && (Gis.Widget.Scheme.TYPES.indexOf(e.target.getType()) === -1 || !e.target.isControllableByServer())) {
                return;
            }
            this._createTypeList();
            this.filterTypeSelected(this._selectedType);
        },
        _initEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            map.on('layerremoved layeradded', this._recalculateList, this);
            this._$list.on('dblclick', '.gis-row-layer', this._layerClicked);
            this._$list.on('click', '.gis-type > span', this._typeClicked);
            this._$list.on('click', '#gis-save-all', this._saveAllClick);
            this._$list.on('change', '#gis-load-all > input', this._fileChange);
            this._$list.on('click', '#gis-clear-all', this.allClearClick);
            this._$list.on('click', '#gis-show-all', this.filterTypeClear);
            this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
            this._containerController.getUIAttached().getMap().on('layerselected', this._layerSelected, this);
            this._containerController.getUIAttached().getMap().on('layerunselected', this._layerUnSelected, this);
        }
});

Gis.Widget.Scheme.TYPE_FILER_ALL = "-1";
Gis.Widget.Scheme.TYPE_NAMES = {
    ellipse: 'Элипс',
    path: 'Маршрут',
    polygon: 'Полигон',
    sector: 'Сектор',
    image: 'Иконка',
    text: 'Маркер'
};
Gis.Widget.Scheme.TYPES = [
    'ellipse',
    'path',
    'polygon',
    'sector',
    'image',
    'text'
];
Gis.Widget.Scheme.CLASS_NAME = "gis-widget-scheme-container";
Gis.Widget.Scheme.TYPE_NAMES[Gis.Widget.Scheme.TYPE_FILER_ALL] = 'Все';
Gis.Widget.scheme = function (data) {
    return new Gis.Widget.Scheme(data);
};

"use strict";
/**
 * СЛайдер широт
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.SliderLatitude = Gis.Widget.Base.extend(
    /**
     * @lends Gis.Widget.SliderLatitude.prototype
     */
    {
    _type: 'sliderLatitude',
        /**
         * Допустимые параметры
         * @type {object}
         * @property {number} [step=0.01] щаг
         * @property {string} [position='right'] пока не стоит менять
         */
    options: {
        step: 0.01,
        position: "right",
        enabled: true
    },
    initialize: function (data) {
        var self = this;
        Gis.Widget.Base.prototype.initialize.call(this, data);
        this._latitudeDecrease = function () {
            var center, map = self._containerController.getUIAttached().getMap();
            center = map.getCenter();
            map.setCenter([center.lat - self.options.step, center.lng]);
        };
        this._latitudeIncrease = function () {
            var center, map = self._containerController.getUIAttached().getMap();
            center = map.getCenter();
            map.setCenter([center.lat + self.options.step, center.lng]);
        };
    },
    onAdd: function (container) {
        Gis.Widget.Base.prototype.onAdd.call(this, container);
        var map = this._containerController.getUIAttached().getMap(), bounds, self = this;
        bounds = map.getMaxBounds();
        if (bounds) {
            this.draw();
            this.setBounds();
            $("#scroll-bar", this._$div).slider({
                orientation: "vertical",
                step: this.options.step,
                start: function () {
                    self._slided = true;
                },
                stop: function () {
                    self._slided = false;
                },
                min: bounds.getSouthWest().lat,
                max: bounds.getNorthEast().lat,
                value: map.getCenter().lat,
                slide: function (event, ui) {
                    var center = map.getCenter();
                    map.setCenter([ui.value, center.lng], true);
                }
            });
        }
    },
    initHTML: function () {
        Gis.Widget.Base.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.SliderLatitude.CLASS_NAME);
        this._$div.append("<div><div class='gis-widget-button gis-latitude-previous'></div><div id='scroll-bar'></div><div class='gis-widget-button gis-latitude-next'></div></div>");
    },
    setBounds: function () {
        var heightContainer;
        heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
        this._$div.css({
            height: heightContainer
        });
        $('#scroll-bar', this._$div).css({
            height: this._$div.height() - ($('>div', this._$div).outerHeight(true) - $('>div', this._$div).height())
        });
    },
    _setValue: function () {
        if (!this._slided) {
            $("#scroll-bar", this._$div).slider('value', this._containerController.getUIAttached().getMap().getCenter().lat);
        }
    },
    _deInitEvents: function () {
        var map = this._containerController.getUIAttached().getMap();
        map.off('moveend zoomend', this._setValue, this);
        this._$div.off('click', '.gis-latitude-previous', this._latitudeIncrease);
        this._$div.off('click', '.gis-latitude-next', this._latitudeDecrease);
        this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
    },
    _initEvents: function () {
        var map = this._containerController.getUIAttached().getMap();
        this._$div.on('click', '.gis-latitude-previous', this._latitudeIncrease);
        this._$div.on('click', '.gis-latitude-next', this._latitudeDecrease);
        if (map.getMaxBounds()) {
            map.on('moveend zoomend', this._setValue, this);
            this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
        }
    }
});

Gis.Widget.SliderLatitude.CLASS_NAME = "gis-widget-sliderLatitude-container";
Gis.Widget.sliderLatitude = function (data) {
    return new Gis.Widget.SliderLatitude(data);
};

"use strict";
/**
* слайдер долготы
* @class
* @extends Gis.Widget.Base
*/
Gis.Widget.SliderLongitude = Gis.Widget.Base.extend(
/**
 * @lends Gis.Widget.SliderLongitude.prototype
 */
{
_type: 'sliderLongitude',
    /**
     * Допустимые параметры
     * @type {object}
     * @property {number} [step=0.01] щаг
     * @property {string} [position='bottom'] пока не стоит менять
     */
options: {
    step: 0.01,
    position: "bottom",
    enabled: true
},
initialize: function (data) {
    var self = this;
    Gis.Widget.Base.prototype.initialize.call(this, data);
    this._longitudeDecrease = function () {
        var center, map = self._containerController.getUIAttached().getMap();
        center = map.getCenter();
        map.setCenter([center.lat, center.lng - self.options.step]);
    };
    this._longitudeIncrease = function () {
        var center, map = self._containerController.getUIAttached().getMap();
        center = map.getCenter();
        map.setCenter([center.lat, center.lng + self.options.step]);
    };
},
onAdd: function (container) {
    Gis.Widget.Base.prototype.onAdd.call(this, container);
    var map = this._containerController.getUIAttached().getMap(), bounds, self = this;
    bounds = map.getMaxBounds();
    if (bounds) {
        this.draw();
        this.setBounds();
        $("#scroll-bar-h").slider({
            orientation: "horizontal",
            step: self.options.step,
            min: bounds.getSouthWest().lng,
            max: bounds.getNorthEast().lng,
            value: map.getCenter().lng,
            start: function () {
                self._slided = true;
            },
            stop: function () {
                self._slided = false;
            },
            slide: function (event, ui) {
                var center = map.getCenter();
                map.setCenter([center.lat, ui.value], true);
            }
        });
    }
},
initHTML: function () {
    Gis.Widget.Base.prototype.initHTML.call(this);
    this._$div.addClass(Gis.Widget.SliderLongitude.CLASS_NAME);
    this._$div.append("<div><div class='gis-widget-button gis-longitude-previous'></div><div id='scroll-bar-h'></div><div class='gis-widget-button gis-longitude-next'></div></div>");
},
_setValue: function () {
    if (!this._slided) {
        $("#scroll-bar-h", this._$div).slider('value', this._containerController.getUIAttached().getMap().getCenter().lng);
    }
},
setBounds: function () {
    var width;
    width = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).width;
    this._$div.css({
        width: width
    });
    $('#scroll-bar', this._$div).css({
        width: this._$div.width()
    });
},
_deInitEvents: function () {
    var map = this._containerController.getUIAttached().getMap();
    map.off('moveend zoomend', this._setValue, this);
    this._$div.off('click', '.gis-longitude-previous', this._longitudeDecrease);
    this._$div.off('click', '.gis-longitude-next', this._longitudeIncrease);
    this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
},
_initEvents: function () {
    var map = this._containerController.getUIAttached().getMap();
    this._$div.on('click', '.gis-longitude-previous', this._longitudeDecrease);
    this._$div.on('click', '.gis-longitude-next', this._longitudeIncrease);
    if (map.getMaxBounds()) {
        map.on('moveend zoomend', this._setValue, this);
        this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
    }
}
});

Gis.Widget.SliderLongitude.CLASS_NAME = "gis-widget-sliderLongitude-container";
Gis.Widget.sliderLongitude = function (data) {
return new Gis.Widget.SliderLongitude(data);
};

"use strict";

/**
 * Базовый класс виджета настроек
 * @requires jQuery
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.Propertys = Gis.Widget.Base.extend(
    /** @lends Gis.Widget.Propertys.prototype */
    {
        _type: 'propertys',
        _defaultColor: '#FFFFFF',
        _defaultStyle: {
            color: '#AF2D51',
            border: 'white',
            selectedBorder: 'rgb(75, 84, 255)',
            thickness: 2,
            icon: {type: 'circle', color: '#AF2D51'}
        },
        _dialogOptions: {
            dialogClass: "no-title-bar",
            autoOpen: false,
            modal: true,
            width: 280,
            closeOnEscape: true,
            minHeight: 10,
            draggable: true
        },
        options: {
            position: "right_inner",
            enabled: true,
            dataBinded: undefined
        },
        chechNumeric: function ($row) {
            var error = false;
            if (!$.isNumeric($row.val())) {
                error = true;
                $row.addClass('error');
            } else {
                $row.removeClass('error');
            }
            return error;
        },
        checkCoordinate: function ($row) {
            var error = false;
            if ($row.val() === '' || !$.isNumeric(this.templateToCoordinate($row.val()))) {
                error = true;
                $row.addClass('error');
            } else {
                $row.removeClass('error');
            }
            return error;
        },
        _rowChanged: function (row) {
            row = $(row);
            return row.val() !== (row.data('old-val') + "");
        },
        _setValue: function ($row, val) {
            $row.val(val);
            $row.data('old-val', val);
        },
        bindData: function (data) {
            this.options.dataBinded = data;
            this._update();
        },
        _generateKeyPressFunction: function (returnKeyCode, callback) {
            return function (e) {
                if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                    callback();
                }
                e.stopPropagation();
            };
        },
        generateEskeyFunction: function (callback) {
            var escKeyKode = 27;
            return this._generateKeyPressFunction(escKeyKode, callback);
        },
        generateEnteredFunction: function (callback) {
            var returnKeyCode = 13;
            return this._generateKeyPressFunction(returnKeyCode, callback);
        },
        initialize: function (data) {
            var self = this;
            Gis.Widget.Base.prototype.initialize.call(this, data);
            this._paramClickFunction = this._paramClickFunction || function () {
                var $this = $(this);
                if (!$this.hasClass('selected')) {
                    $('.gis-param-selector.selected', $this.parent()).not($this).removeClass('selected');
                    $this.addClass('selected');
                    self._updateState();
                }
            };
            this._CustomColorChanged = this._CustomColorChanged || function (hsb, hex, rgb, el) {
                var $this = $(el);
                $('.gis-param-selector.selected', $this.parent()).not($this).removeClass('selected');
                $this.addClass('selected');
                $this.data('color', rgb);
                $('span', $this).css('background', rgb);
                self._updateState();
            };
        },
        initHTML: function () {
            Gis.Widget.Base.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.Propertys.CLASS_NAME);
            this._$div.append(this.initDataBlock());
            this._$div.append(this.initButtonsBlock());
        },
        onRemove: function () {
            Gis.Widget.Base.prototype.onRemove.call(this);
        },
        onAdd: function (container) {
            Gis.Widget.Base.prototype.onAdd.call(this, container);
            this.draw();
            this.setBounds();
        },
        initDataBlock: function () {
            Gis.extendError();
        },
        initButtonsBlock: function () {
            Gis.extendError();
        },
        _mapClicked: function () {
            Gis.extendError();
        },
        _initDialogClose: function (data) {
            var $dialog, id, callback, context;
            id = data.id || 'gis-remove-dialog';
            callback = data.callback || function () {};
            context = data.context || this;
            $dialog = $('#' + id);
            if (!$dialog.length) {
                $dialog = $('<div id="' + id + '"/>');
                $dialog.appendTo($(document.body));
            }
            $dialog.dialog($.extend(this._dialogOptions, {
                buttons: [
                    {
                        text: 'OK',
                        click: function () {
                            callback.call(context);
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: 'Отменить',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            }));
            return $dialog;
        },
        _deleteLayerConfirm: function (data) {
            if (this.options.dataBinded) {
                this._$dialogRemove = this._$dialogRemove || this._initDialogClose(data);
                this._$dialogRemove.html(data.title || '');
                this._$dialogRemove.dialog('open');
            }
        },
        _HTMLcolorSelector: function (drawSelected, currentColor) {
            var li, ul, notNeedAddCurrentColor = false;
            li = "";
            currentColor = currentColor || (this.options.dataBinded && this.options.dataBinded.getBackColor && this.options.dataBinded.getBackColor());
            this.options.color.forEach(function (color) {
                notNeedAddCurrentColor = notNeedAddCurrentColor || color === currentColor;
                li += "<li class='gis-propertys-button gis-color-button" + (drawSelected && color === currentColor ? " selected" : '') + " gis-param-selector' data-color='" + color + "'>" +
                    "<span style='background: " + color + ";'></span></li>";
            });
            if (drawSelected && !notNeedAddCurrentColor && currentColor) {
                li += "<li class='gis-propertys-button gis-color-button gis-param-selector selected' data-color='" + currentColor + "'><span style='background: " + currentColor + ";'></span></li>";
            }
            if ($(document.body).ColorPicker) {
                li += "<li class='gis-propertys-button gis-color-button gis-param-selector gis-color-custom' data-color='" + this._defaultColor + "' value='" + this._defaultColor + "'><span style='background: " + this._defaultColor + ";'></span></li>";
            }
            return "<ul class='gis-color-list '>" + li + "</ul>";
        },
        _HTMLtypeSelector: function (drawSelected, currentType) {
            var li, ul, notNeedAddCurrentType = false;
            li = "";
            currentType = currentType || (this.options.dataBinded && this.options.dataBinded.getImageType && this.options.dataBinded.getImageType());
            this.options.types.forEach(function (type) {
                notNeedAddCurrentType = notNeedAddCurrentType || type === currentType;
                li += "<li class='gis-propertys-button gis-image-type-button" + (drawSelected && type === currentType ? " selected" : '') + " gis-param-selector gis-image-type-" + type + "' data-type='" + type + "'>" +
                    "<span></span></li>";
            });
            if (drawSelected && !notNeedAddCurrentType && currentType) {
                li += "<li class='gis-propertys-button gis-image-type-button gis-param-selector selected' data-type='" + currentType + " gis-image-type-" + currentType + "' ><span></span></li>";
            }
            return "<ul class='gis-image-type-list '>" + li + "</ul>";
        },
        _deleteKeyFire: function () {
        },
        _revertTextData: function (row) {
            row = $(row);
            row.val(row.data('old-val'));
        },
        setBounds: function () {
            var maxHeight, heightContainer, $wrapper, $wrParent;
            heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
            maxHeight = heightContainer - Math.min(heightContainer / 2, 300);
            $wrapper = $('#points-selector', this._$div);
            $wrParent = $wrapper.parent();
            $('.gis-widget-propertys-wraper, .gis-widget-propertys-buttons-wraper', this._$div)
                .not($wrParent)
                .each(function () {
                    maxHeight -= $(this).outerHeight(true);
                });
            maxHeight -= $wrapper.outerHeight(true) - $wrapper.height() + $wrParent.outerHeight(true) - $wrParent.height() + $('.gis-widget-propertys-title', $wrParent).outerHeight(true) - this._$div.outerHeight(true) + this._$div.height();
            $wrapper.css({
                maxHeight: Math.max(maxHeight, 40)
            });
        },
        _initEvents: function () {
            var self = this;
            this._mapKeyUp = this._mapKeyUp || function (e) {
                var backSpaceCode = 8,
                    deleteCode = 46,
                    keyCode = e.keyCode || parseInt(e.charCode, 10);
                if (keyCode === backSpaceCode || keyCode === deleteCode) {
                    self._deleteKeyFire(e);
                }
            };
            this._mapKeyPress = this._mapKeyPress || function (e) {
                var backSpaceCode = 8,
                    keyCode = e.keyCode || parseInt(e.charCode, 10);
                if ((e.srcElement || e.target).type !== 'text' && keyCode === backSpaceCode) {
                    e.preventDefault();
                    return false;
                }
            };
            this._containerController.getUIAttached().getMap().on('click', this._mapClicked, this);
            document.body.addEventListener('keydown', this._mapKeyPress);
            document.body.addEventListener('keyup', this._mapKeyUp);
            $(this._$div).on('click', '.gis-param-selector', this._paramClickFunction);
            this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
            if ($(document.body).ColorPicker && $('.gis-color-custom', this._$div).length) {
                $('.gis-color-custom', this._$div).ColorPicker({
                    onSubmit: this._CustomColorChanged
                })
            }
        },
        _deInitEvents: function () {
            this._containerController.getUIAttached().getMap().off('click', this._mapClicked, this);
            document.body.removeEventListener('keydown', this._mapKeyPress);
            document.body.removeEventListener('keyup', this._mapKeyUp);
            this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
            $(this._$div).off('click', '.gis-param-selector', this._paramClickFunction);
        },
        activate: function () {
            this._initEvents();
        },
        deactivate: function () {
            this._deInitEvents();
        },
        draw: function () {
            $(this.container).prepend(this._$div);
        },
        _update: function () {
            Gis.extendError();
        },
        keyPressPreventDefault: function (e) {
            e.stopPropagation();
        },
        _buttonHTML: function (className, text, enabled) {
            text = text || "";
            return "<button class='" + Gis.Widget.Propertys.BUTTON_CLASS_NAME + " " + className + (text ? ' gis-button-with-text' : '') + "' " + (!enabled ? "disabled='disabled'" : "") + ">" +
                "<span class='gis-button-icon'></span>" +
                "<span class='gis-button-text'>" + text + "</span></button>";
        }
    }
);

Gis.Widget.Propertys.CLASS_NAME = 'gis-widget-propertys';
Gis.Widget.Propertys.DATA_WRAPER_CLASS = 'gis-widget-propertys-wraper';
Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS = 'gis-widget-propertys-buttons-wraper';
Gis.Widget.Propertys.DATA_BLOCK_CLASS = 'gis-widget-propertys-data';
Gis.Widget.Propertys.DATA_TITLE_CLASS = 'gis-widget-propertys-title';
Gis.Widget.Propertys.BUTTON_CLASS_NAME = 'gis-propertys-button';
Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME = 'gis-propertys-button-delete';
Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME = 'gis-propertys-button-deselect';
Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME = 'gis-propertys-button-return';
Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME = 'gis-propertys-button-revert';
Gis.Widget.propertys = function (data) {
    return new Gis.Widget.Propertys(data);
};

"use strict";
/**
 * Настройки эллипса
 * @requires jQuery
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.EllipseProperty = Gis.Widget.Propertys.extend(
    /** @lends Gis.Widget.EllipseProperty.prototype */
    {
        _history: [],
        /**
         * Допустимые опции
         * @type {object}
         * @property {string[]} [types=[]]
         * @property {string[]} [colors=["#FF3911","#1632FF","#808080","#FFD800","#0094FF"]]
         * @property {string} [position='right_inner']
         * @property {boolean} [enabled=true]
         * @property {Gis.Objects.Ellipse} [dataBinded=undefined]
         */
        options: {
            types: undefined,
            colors: undefined
        },
        initialize: function (data) {
            Gis.Widget.Propertys.prototype.initialize.call(this, data);
            this.options.types = this.options.types || [
            ];
            this.options.color = this.options.color || [
                "#FF3911",
                "#1632FF",
                "#808080",
                "#FFD800",
                "#0094FF"
            ];

            if (this.options.dataBinded) {
                this.options.dataBinded.on('change', this.updateData, this);
            }
        },
        _updateHistory: function (data) {
            this._updateState();
        },
        back: function () {
            var dataHistory;
            if (!this._isStateChanged()) {
                dataHistory = this._history.pop();
                if (dataHistory) {
                    this._setData(dataHistory.text, dataHistory.center, dataHistory.color);
                }
            } else {
                this._$Xrow.val(this._$Xrow.data('old-val'));
                this._$Yrow.val(this._$Yrow.data('old-val'));
                this._$R1row.val(this._$R1row.data('old-val'));
                this._$R2row.val(this._$R2row.data('old-val'));
                this._$AngleRow.val(this._$AngleRow.data('old-val'));
                if (this.options.dataBinded) {
                    this._newColor = this.options.dataBinded.getColor();
                }
            }
            this.updateData();
        },
        _setData: function (text, center, color) {
            var r1 = (this.options.dataBinded && this.options.dataBinded.getAlpha()) || "",
                r2 = (this.options.dataBinded && this.options.dataBinded.getBetta()) || "",
                angle = (this.options.dataBinded && this.options.dataBinded.getGamma()) || 0;
            center = center || (this.options.dataBinded && this.options.dataBinded.getLatLng());

            this._setValue(this._$Xrow, (center && this.coordinateToTemplate(center[1], true)) || "");
            this._setValue(this._$Yrow, (center && this.coordinateToTemplate(center[0])) || "");
            this._setValue(this._$R1row, r1);
            this._setValue(this._$R2row, r2);
            this._setValue(this._$AngleRow, angle);
        },
        _updateColor: function () {
            $('.gis-color-list', this._$div).replaceWith(this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()));
        },
        _hilightErrors: function () {
            var error = false;
            error = error || this.checkCoordinate(this._$Xrow);
            error = error || this.checkCoordinate(this._$Yrow);
            error = error || this.chechNumeric(this._$R1row);
            error = error || this.chechNumeric(this._$R2row);
            error = error || this.chechNumeric(this._$AngleRow);
            if (!$('.gis-color-button.selected', this._$div).data('color')) {
                error = true;
            }
            return error;
        },
        _updateCoordanatesState: function () {
            if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
                this._$Xrow.attr('disabled', 'disabled');
                this._$Yrow.attr('disabled', 'disabled');
            } else {
                this._$Xrow.removeAttr('disabled');
                this._$Yrow.removeAttr('disabled');
            }
        },
        _updateState: function () {
            this._updateButtonState();
            this._updateCoordanatesState();
            this._hilightErrors();
        },
        updateData: function () {
            this._setData();
            if (!this._pressed) {
                this._updateColor();
            }
            this._updateState();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.EllipseProperty.CLASS_NAME);
            this._$Xrow = $('#ellipse-x', this._$div);
            this._$Yrow = $('#ellipse-y', this._$div);
            this._$R1row = $('#ellipse-r1', this._$div);
            this._$R2row = $('#ellipse-r2', this._$div);
            this._$AngleRow = $('#ellipse-angle', this._$div);
        },
        initDataBlock: function () {
            var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
                r1 = (this.options.dataBinded && this.options.dataBinded.getAlpha()) || "",
                r2 = (this.options.dataBinded && this.options.dataBinded.getBetta()) || "",
                angle = (this.options.dataBinded && this.options.dataBinded.getGamma()) || "",
                centerX = (center && center[1]) || '',
                centerY = (center && center[0]) || '';
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Координаты</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ul id='center-selector'>\n" +
                "<li class='data-coll'><span>X</span><input type='text' data-old-val='" + this.coordinateToTemplate(centerX, true) + "' id='ellipse-x' class='ellipse-input' value='" + this.coordinateToTemplate(centerX, true) + "'/></li>\n" +
                "<li class='data-coll'><span>Y</span><input type='text' data-old-val='" + this.coordinateToTemplate(centerY) + "' id='ellipse-y' class='ellipse-input' value='" + this.coordinateToTemplate(centerY) + "'/></li>\n" +
                "</ul>\n" +
                "<div>\n" +
                "<ul>\n" +
                    "<li class='data-row'><span>Радиус 1:</span>" +
                        "<input type='text' data-old-val='" + r1 + "' id='ellipse-r1' class='ellipse-input' value='" + r1 + "'/>" +
                    "</li>\n" +
                    "<li class='data-row'><span>Радиус 2:</span>" +
                        "<input type='text' data-old-val='" + r2 + "' id='ellipse-r2' class='ellipse-input' value='" + r2 + "'/>" +
                    "</li>\n" +
                    "<li class='data-row'><span>Угол поворота:</span>" +
                        "<input type='text' data-old-val='" + angle + "' id='ellipse-angle' class='ellipse-input' value='" + angle + "'/>" +
                    "</li>\n" +
                "</ul>\n" +
                "</div>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()) +
                "</div>" +
                "</div>\n" +
                "</div>\n";
        },
        _onMouseDown: function (e) {
            this._cleared = true;
            this._pressed = true;
            if (this.options.dataBinded) {
                this._cleared = false;
                this._containerController.getUIAttached().getMap().unselectLayer(this.options.dataBinded);
            }
            this._startPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
        },
        _drawFromDrag: function (circle, skipServerMessage) {
            var r1, r2;
            if (this._cleared && this._currentPoint && this._startPoint) {
                r1 = this._startPoint.distanceTo(Gis.latLng(this._startPoint.lat,  this._currentPoint.lng));
                r2 = this._startPoint.distanceTo(Gis.latLng(this._currentPoint.lat,  this._startPoint.lng));
                if (circle) {
                    r1 = r2 = Math.max(r1, r2);
                }
                this._saveData({x: this._startPoint.lng, y: this._startPoint.lat, r1: r1, r2: r2, angle: 0, skipServerMessage: skipServerMessage});
                this.updateData();
            }
        },
        _onMouseMove: function (e) {
            if (this._pressed && this._cleared) {
                this._moved = true;
                this._currentPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
                this._drawFromDrag(e.originalEvent.shiftKey, true);
            }
        },
        _finishDrawFromDrag: function () {
            this._cleared = false;
            this._startPoint = undefined;
            this._currentPoint = undefined;
        },
        fireServerEvent: function () {
            if (this.options.dataBinded) {
                this.options.dataBinded.fire('change', {
                    target: this.options.dataBinded,
                    rows: ['alpha', 'betta', 'gamma', 'latitude', 'longitude', 'fill']
                });
            }
        },
        _onMouseUp: function (e) {
            if (this._pressed && this._cleared) {
                this.fireServerEvent();
            }
            this._moved = false;
            this._pressed = false;
            this._finishDrawFromDrag();
        },
        _onMouseOut: function () {
            this._moved = false;
            this._pressed = false;
            this._finishDrawFromDrag();
        },
        initButtonsBlock: function () {
            return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                "<ul class='gis-property-buttons-list'>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новый', !this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "</ul>\n" +
                "</div>\n";
        },
        getSelectedColor: function () {
            return $('.gis-color-button.selected', this._$div).data('color');
        },
        getSelectedType: function () {
            return $('.gis-image-type-button.selected', this._$div).data('type');
        },
        _isStateChanged: function () {
            var changed;
            changed = this._rowChanged(this._$Xrow) ||
                this._rowChanged(this._$Yrow) ||
                this._rowChanged(this._$R1row) ||
                this._rowChanged(this._$R2row) ||
                this._rowChanged(this._$AngleRow) ||
                (this.options.dataBinded && (this.options.dataBinded.getColor() !== this.getSelectedColor()));
            return changed;
        },
        _updateButtonState: function () {
            var buttonSaveText;
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            function switchButtonState(button, enable) {
                if (enable) {
                    button.removeAttr('disabled');
                } else {
                    button.attr('disabled', 'disabled');
                }
            }
            buttonSaveText = this.options.dataBinded && this._isStateChanged() ? "Подтвердить" : !this.options.dataBinded ? "Новый" : "Подтвердить";
            $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
            switchButtonState(this._$buttonNew, (!this.options.dataBinded || this._isStateChanged()) && !this._hilightErrors());
            switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            switchButtonState(this._$buttonDelete, this.options.dataBinded);
            switchButtonState(this._$buttonRevert, this._isStateChanged());

        },
        _deinitDialogs: function () {
            this._$dialogRemove.dialog('destroy');
            $(document.body).remove(this._$dialogRemove);
            this._$dialogRemove = undefined;
        },
        /**
         * @param {Object} params {x, y, r1, r2, color, angle, forceNew, skipServerMessage}
         * */
        _saveData: function (params) {
            var newLayer, data, fillStyle, lineStyle, x, y, r1, r2, color, angle, style;
            params = params || {};
            x = params.x || this.templateToCoordinate(this._$Xrow.val());
            y = params.y || this.templateToCoordinate(this._$Yrow.val());
            r1 = params.r1 || this._$R1row.val();
            r2 = params.r2 || this._$R2row.val();
            color = params.color || $('.gis-color-button.selected', this._$div).data('color') || (this.options.dataBinded && this.options.dataBinded.getColor());
            angle = params.angle !== undefined && $.isNumeric(params.angle) ? params.angle : this._$AngleRow.val();
            fillStyle = {color: this.getSelectedColor()};
            if (x && y && color && angle !== undefined && r2 && r1) {
                data = {
                    alpha: r1,
                    betta: r2,
                    gamma: angle,
                    latitude: y,
                    longitude: x,
                    fill: fillStyle
                };
                if (!params.forceNew && this.options.dataBinded) {
                    this.options.dataBinded.setData(data, null, params.skipServerMessage);
                } else {
                    style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('ellipse'));
                    lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
                    newLayer = Gis.ellipse(Gis.Util.extend({}, data, {draggable: true, selectable: true, line: lineStyle}));
                    newLayer.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
                    newLayer.addTo(this._containerController.getUIAttached().getMap());
                    this._containerController.getUIAttached().getMap().selectLayer(newLayer);
                }
                this._update();
            } else {
                this._updateState();
            }
        },
        _deleteKeyFire: function (e) {
            if (e.srcElement.type !== 'text') {
                this._deleteLayerConfirm({
                    title: 'Вы действительно хотите удалить эллипс?',
                    callback: function () {
                        this._containerController.getUIAttached().getMap().removeLayer(this.options.dataBinded);
                    },
                    context: this,
                    id: 'ellipse-remove-dialog'
                });
            }
        },
        _mapClicked: function (e) {
        },
        _deInitEvents: function () {
            $('.data-row input', this._$div).off({
                change: this._textRowChange,
                keyup: this._textRowChange
            });
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            });
            if (this.options.dataBinded) {
                this.options.dataBinded.off('change', this.updateData, this);
            }
            $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            });
            this._containerController.getUIAttached().getMap().off('mouseup', this._onMouseUp, this);
            this._containerController.getUIAttached().getMap().off('mousedown', this._onMouseDown, this);
            this._containerController.getUIAttached().getMap().off('mousemove', this._onMouseMove, this);
            this._containerController.getUIAttached().getMap().off('mouseout', this._onMouseOut, this);
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
        },
        _initEvents: function () {
            var self = this;
            function generateEnteredFunction(callback) {
                return function (e) {
                    var returnKeyCode = 13;
                    if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                        callback();
                    }
                };
            }
            this._returnFunction = this._returnFunction || function () {
                self._saveData();
            };
            this._deleteFunction = this._deleteFunction || function () {
                self._deleteKeyFire();
            };
            this._textRowChange = this._textRowChange || function (e) {
                self._updateState();
                e.stopPropagation();
            };
            this._textRowKeyPress = this._textRowKeyPress || function () {
                self._updateState();
            };
            this._revertFunction = this._revertFunction || function () {
                self.back();
            };
            this._deselectFunction = this._deselectFunction || function () {
                self._containerController.getUIAttached().getMap().unselectLayer(self.options.dataBinded);
            };
            this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
            this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
            this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || generateEnteredFunction(self._deselectFunction);
            this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
            $('.data-coll input, .data-row input', this._$div).on({
                change: this._textRowChange,
                keyup: this._textRowChange,
                keydown: this.keyPressPreventDefault
            });
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            });
            this._containerController.getUIAttached().getMap().on('mouseup', this._onMouseUp, this);
            this._containerController.getUIAttached().getMap().on('mousedown', this._onMouseDown, this);
            this._containerController.getUIAttached().getMap().on('mousemove', this._onMouseMove, this);
            this._containerController.getUIAttached().getMap().on('mouseout', this._onMouseOut, this);
            Gis.Widget.Propertys.prototype._initEvents.call(this);
        },
        _update: function () {
            this.updateData();
        },
        bindData: function (data) {
            if (!data && !this._cleared) {
                this._cleared = true;
            }
            if (data !== this.options.dataBinded) {
                this._newColor = undefined;
                if (this.options.dataBinded) {
                    this.options.dataBinded.off('change', this.updateData, this);
                }
                if (data) {
                    data.on('change', this.updateData, this);
                }
                Gis.Widget.Propertys.prototype.bindData.call(this, data);
                this.updateData();
            }
        }
    }
);

Gis.Widget.EllipseProperty.CLASS_NAME = "gis-widget-propertys-ellipse";
Gis.Widget.EllipseProperty.CENTER_CHANGED = 1;
Gis.Widget.EllipseProperty.TEXT_CHANGED = 3;
Gis.Widget.EllipseProperty.BOTH_CHANGED = 2;
Gis.Widget.EllipseProperty.NOT_CHANGED = 0;
Gis.Widget.ellipseProperty = function (data) {
    return new Gis.Widget.EllipseProperty(data);
};

"use strict";
/**
 * Свойства маркера
 * @class
 * @extedns Gis.Widget.Propertys
 */
Gis.Widget.MarkerProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.MarkerProperty.prototype
     */
    {
    _history: [],
    _defaultStyle: {
        foreColor: '#ffffff',
        position: 'centerright',
        drawPoint: true
    },
    _options: {
        colors: undefined
    },
    initialize: function (data) {
        Gis.Widget.Propertys.prototype.initialize.call(this, data);
        this.options.color = this.options.color || [
            "#FF3911",
            "#1632FF",
            "#808080",
            "#FFD800",
            "#0094FF"
        ];

        if (this.options.dataBinded) {
            this.options.dataBinded.on('change', this.updateData, this);
        }
    },
    _updateHistory: function (data) {
        this._updateState();
    },
    back: function () {
        var dataHistory;
        if (!this._isStateChanged()) {
            dataHistory = this._history.pop();
            if (dataHistory) {
                this._setData(dataHistory.text, dataHistory.center, dataHistory.color);
            }
        } else {
            this._$Xrow.val(this._$Xrow.data('old-val'));
            this._$Yrow.val(this._$Yrow.data('old-val'));
            this._$TEXTrow.val(this._$TEXTrow.data('old-val'));
            if (this.options.dataBinded) {
                this._newColor = this.options.dataBinded.getBackColor();
            }
        }
        this.updateData();
    },
    _setData: function (text, center, color) {
        center = center || (this.options.dataBinded && this.options.dataBinded.getLatLng());
        text = (text || (this.options.dataBinded && this.options.dataBinded.getText())) || '';
        this._setValue(this._$Xrow, (center && this.coordinateToTemplate(center[1])) || "");
        this._setValue(this._$Yrow, (center && this.coordinateToTemplate(center[0])) || "");
        this._setValue(this._$TEXTrow, text);
    },
    _updateColor: function () {
        $('.gis-color-list', this._$div).replaceWith(this._HTMLcolorSelector(true));
    },
    _hilightErrors: function () {
        var error = false;
        error = error || this.checkCoordinate(this._$Xrow);
        error = error || this.checkCoordinate(this._$Yrow);
        if (this._$TEXTrow.val() === '') {
            error = true;
            this._$TEXTrow.addClass('error');
        } else {
            this._$TEXTrow.removeClass('error');
        }
        return error;
    },
    _updateCoordanatesState: function () {
        if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
            this._$Xrow.attr('disabled', 'disabled');
            this._$Yrow.attr('disabled', 'disabled');
        } else {
            this._$Xrow.removeAttr('disabled');
            this._$Yrow.removeAttr('disabled');
        }
    },
    _updateState: function () {
        this._updateButtonState();
        this._updateCoordanatesState();
        this._hilightErrors();
    },
    updateData: function () {
        this._setData();
        this._updateColor();
        this._updateState();
    },
    draw: function () {
        Gis.Widget.Propertys.prototype.draw.call(this);
        var selected = this._containerController.getUIAttached().getMap().getSelected(),
            keys = Object.keys(selected);
        if (keys.length > 1) {
            this.options.dataBinded = undefined;
        } else if (keys.length && selected[keys[0]].getType() === Gis.UI.Action.Marker.type) {
            this.options.dataBinded = selected[keys[0]];
        }
        this.updateData();
    },
    initHTML: function () {
        Gis.Widget.Propertys.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.MarkerProperty.CLASS_NAME);
        this._$Xrow = $('#marker-x', this._$div);
        this._$Yrow = $('#marker-y', this._$div);
        this._$TEXTrow = $('#marker-text', this._$div);
    },
    initDataBlock: function () {
        var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
            text = (this.options.dataBinded && this.options.dataBinded.getText()) || "",
            centerX = (center && this.coordinateToTemplate(center[1])) || '',
            centerY = (center && this.coordinateToTemplate(center[0])) || '';
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Метка</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
            "<ul id='center-selector'>\n" +
            "<li class='data-coll'><span>X</span><input type='text' data-old-val='" + centerX + "' id='marker-x' class='marker-input' value='" + centerX + "'/></li>\n" +
            "<li class='data-coll'><span>Y</span><input type='text' data-old-val='" + centerY + "' id='marker-y' class='marker-input' value='" + centerY + "'/></li>\n" +
            "</ul>\n" +
            "<div>\n" +
            "<ul>\n" +
            "<li class='data-row data-title'><span>Текст:</span></li>\n" +
            "<li class='data-row'><input type='text' data-old-val='" + text + "' id='marker-text' class='marker-input' value='" + text + "'/></li>\n" +
            "</ul>\n" +
            "</div>\n" +
            "</div>\n" +
            "</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
            this._HTMLcolorSelector(true) +
            "</div>\n" +
            "</div>\n" +
            "</div>\n";
    },
    initButtonsBlock: function () {
        return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
            "<ul class='gis-property-buttons-list'>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новая', !this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "</ul>\n" +
            "</div>\n";
    },
    _isStateChanged: function () {
        var changed;
        changed = this._rowChanged(this._$Xrow) ||
            this._rowChanged(this._$Yrow) ||
            this._rowChanged(this._$TEXTrow) ||
            (this._newColor && this.options.dataBinded && (this.options.dataBinded.getBackColor() !== this._newColor));
        return changed;
    },
    _updateButtonState: function () {
        var buttonSaveText;
        this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
        this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
        this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
        this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
        function switchButtonState(button, enable) {
            if (enable) {
                button.removeAttr('disabled');
            } else {
                button.attr('disabled', 'disabled');
            }
        }
        buttonSaveText = this.options.dataBinded && this._isStateChanged() ? "Подтвердить" : !this.options.dataBinded ? "Новая" : "Подтвердить";
        $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
        switchButtonState(this._$buttonNew, (!this.options.dataBinded || this._isStateChanged()) && !this._hilightErrors());
        switchButtonState(this._$buttonDeselect, this.options.dataBinded);
        switchButtonState(this._$buttonDelete, this.options.dataBinded);
        switchButtonState(this._$buttonRevert, this._isStateChanged());

    },
    _initDialogClose: function () {
        var self = this, $dialog;
        $dialog = $('#marker-remove-dialog');
        if (!$dialog.length) {
            $dialog = $('<div id="marker-remove-dialog"/>');
            $dialog.appendTo($(document.body));
        }
        $dialog.dialog($.extend(this._dialogOptions, {
            buttons: [
                {
                    text: 'OK',
                    click: function () {
                        self._containerController.getUIAttached().getMap().removeLayer(self.options.dataBinded);
                        $(this).dialog("close");
                    }
                },
                {
                    text: 'Отменить',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        }));
        $dialog.dialog($.extend(this._dialogOptions, {
            buttons: [
                {
                    text: 'OK',
                    click: function () {
                        self._containerController.getUIAttached().getMap().removeLayer(self.options.dataBinded);
                        $(this).dialog("close");
                    }
                },
                {
                    text: 'Отменить',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        }));
        return $dialog;
    },
    _initDialogNew: function () {
        var self = this, $dialog;
        $dialog = $('#marker-new-dialog');
        if (!$dialog.length) {
            $dialog = $('<div id="marker-new-dialog"/>');
            $dialog.append("<div><span class='dialog-label'>Цвет метки</span>" + this._HTMLcolorSelector(false) + "</div>");
            $dialog.append("<div><span class='dialog-label'>Текст метки</span>" +
                "<input type='text' id='dialog-new-marker-text'/>" +
                "</div>");
            $dialog.appendTo($(document.body));
            $($dialog).on('click', '.gis-color-button', function () {
                var $this = $(this);
                if (!$this.hasClass('selected')) {
                    $('.gis-color-button.selected', $dialog).removeClass('selected');
                    $this.addClass('selected');
                }
            });
            $($dialog).on('dialogclose', function () {
                var $this = $(this);
                $('.gis-color-button.selected', $this).removeClass('selected');
                $('#dialog-new-marker-text', $this).val('');
            });
        }
        $dialog.dialog($.extend(this._dialogOptions, {
            buttons: [
                {
                    text: 'OK',
                    click: function () {
                        var color, text, $this;
                        $this = $(this);
                        color = $('.gis-color-button.selected', $this).data('color');
                        text = $('#dialog-new-marker-text', $this).val();
                        if (color && text !== '') {
                            self._saveData($dialog.latlng.lng, $dialog.latlng.lat, text, color, true);
                            $(this).dialog("close");
                        }
                    }
                },
                {
                    text: 'Отменить',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        }));
        return $dialog;
    },
    _deinitDialogs: function () {
        this._$dialogRemove.dialog('destroy');
        $(document.body).remove(this._$dialogRemove);
        this._$dialogRemove = undefined;
    },
    _opedDialogNewLabel: function (latlng) {
        this._$dialogNew = this._$dialogNew || this._initDialogNew();
        this._$dialogNew.latlng = latlng;
        this._$dialogNew.dialog('open');
    },
    _saveData: function (x, y, text, color, forceNew) {
        var newLayer, style;
        x = x || this.templateToCoordinate(this._$Xrow.val());
        y = y || this.templateToCoordinate(this._$Yrow.val());
        text = text || this._$TEXTrow.val();
        if (x && y && text !== '') {
            color = color || this._newColor || this.options.dataBinded.getBackColor();
            if (!forceNew && this.options.dataBinded) {
                this.options.dataBinded.setData({
                    backColor: color,
                    text: text,
                    latitude: y,
                    longitude: x
                });
            } else {
                style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('marker'));
                newLayer = Gis.textLabel({className: 'gis-ui-marker', foreColor: style.foreColor, position: style.position,drawPoint: style.drawPoint, text: text, latitude: y, longitude: x,
                    backColor: color, draggable: true, selectable: true});
                newLayer.addTo(this._containerController.getUIAttached().getMap());
                this._containerController.getUIAttached().getMap().selectLayer(newLayer);
            }
            this._update();
        } else {
            this._updateState();
        }
    },
    _mapClicked: function (e) {
        this._opedDialogNewLabel(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
    },
    _deleteKeyFire: function (e) {
        if ((e.srcElement || e.target).type !== 'text') {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить метку?',
                callback: function () {
                    this._containerController.getUIAttached().getMap().removeLayer(this.options.dataBinded);
                },
                context: this,
                id: 'marker-remove-dialog'
            });
        }
    },
    _deInitEvents: function () {
        $(this._$div).off('click', '.gis-color-button', this._colorClickFunction);
        $('.data-row input', this._$div).off({
            change: this._textRowChange,
            keyup: this._textRowChange
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        if (this.options.dataBinded) {
            this.options.dataBinded.off('change', this.updateData, this);
        }
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._deInitEvents.call(this);
    },
    _initEvents: function () {
        var self = this;
        function generateEnteredFunction(callback) {
            return function (e) {
                var returnKeyCode = 13;
                if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                    callback();
                }
            };
        }
        this._returnFunction = this._returnFunction || function () {
            self._saveData();
        };
        this._deleteFunction = this._deleteFunction || function () {
            self._deleteKeyFire();
        };
        this._textRowChange = this._textRowChange || function (e) {
            self._updateState();
            e.stopPropagation();
        };
        this._textRowKeyPress = this._textRowKeyPress || function () {
            self._updateState();
        };
        this._revertFunction = this._revertFunction || function () {
            self.back();
        };
        this._deselectFunction = this._deselectFunction || function () {
            self._containerController.getUIAttached().getMap().unselectLayer(self.options.dataBinded);
        };
        this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
        this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
        this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || generateEnteredFunction(self._deselectFunction);
        this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
        this._colorClickFunction = this._colorClickFunction || function () {
            var $this = $(this);
            if (!$this.hasClass('selected')) {
                $('.gis-color-button.selected', self._$div).removeClass('selected');
                $this.addClass('selected');
                self._newColor = $this.data('color');
                self._updateState();
            }
        };
        this._$div.on('click', '.gis-color-button', this._colorClickFunction);
        $('.data-coll input, .data-row input', this._$div).on({
            change: this._textRowChange,
            keyup: this._textRowChange,
            keydown: this.keyPressPreventDefault
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._initEvents.call(this);
    },
    _update: function () {
        this.updateData();
    },
    bindData: function (data) {
        if (data !== this.options.dataBinded) {
            this._newColor = undefined;
            if (this.options.dataBinded) {
                this.options.dataBinded.off('change', this.updateData, this);
            }
            if (data) {
                this._newColor = data.getBackColor();
                data.on('change', this.updateData, this);
            }
            Gis.Widget.Propertys.prototype.bindData.call(this, data);
            this.updateData();
        }
    }
});

Gis.Widget.MarkerProperty.CLASS_NAME = "gis-widget-propertys-marker";
Gis.Widget.MarkerProperty.CENTER_CHANGED = 1;
Gis.Widget.MarkerProperty.TEXT_CHANGED = 3;
Gis.Widget.MarkerProperty.BOTH_CHANGED = 2;
Gis.Widget.MarkerProperty.NOT_CHANGED = 0;
Gis.Widget.markerProperty = function (data) {
    return new Gis.Widget.MarkerProperty(data);
};
"use strict";
/**
 * @extends Gis.Widget.Propertys
 * @class
 */
Gis.Widget.MeasureProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.MeasureProperty.prototype
     */
    {
    _history: [],
    _historyValues: [],
    _path: undefined,
    _defaultStyle: {
        color: 'black',
        border: 'white',
        thickness: 'white',
        icon: {width: 10, type: 'circle'}
    },
    _options: {
        colors: undefined
    },
    _updateHistory: function () {
        var $rows, self = this;
        this._history = [];
        this._historyValues = [];
        $rows = $('#points-selector li', this._$div);
        $rows.each(function () {
            self._history.push(this);
            self._historyValues.push({
                x:  $('.marker-x', $(this)).val(),
                y:  $('.marker-y', $(this)).val()
            });
        });
    },
    back: function () {
        var self = this;
        if (this._isStateChanged()) {
            if (!this._history || this._history.length < 2) {
                $('#points-selector li', this._$div).filter(function (index) {
                    if (index < 2) {
                        self._setValue($('.marker-x', $(this)), self._historyValues[index] ? self._historyValues[index].x : '');
                        self._setValue($('.marker-y', $(this)), self._historyValues[index] ? self._historyValues[index].y : '');
                        return false;
                    }
                    return true;
                }).remove();
            } else {
                $('#points-selector li', this._$div).not(this._history).remove();
                this._history.forEach(function (row) {
                    $('#points-selector ol', self._$div).append($(row));
                });
            }
        }
        this._updateState();
    },
    _clearInfo: function () {
        this._$infoContainer.remove();
        this._$infoContainer = undefined;
    },
    _clearMeasure: function () {
        var self = this;
        this._containerController.getUIAttached().getMap().removeLayer(this._path);
        this._deInitPathEvents();
        $('#points-selector li', this._$div).not(function (i) {
            if (i < 2) {
                self._setValue($('.marker-x', $(this)), "");
                self._setValue($('.marker-y', $(this)), "");
                return this;
            }
            return false;
        }).remove();
        this._updateHistory();
        this._clearInfo();
        this._updateState();
    },
    _setData: function (text, center, color) {
        //todo reset data
    },
    _hilightErrors: function () {
        var error = false, $rows, $Xrow, $Yrow, self = this;
        $rows = $('#points-selector li', this._$div);
        this._pointsCalculated = [];
        $rows.each(function () {
            $Xrow = $('.marker-x', $(this));
            $Yrow = $('.marker-y', $(this));
            error = error || self.checkCoordinate($Xrow);
            error = error || self.checkCoordinate($Yrow);
        });
        return error;
    },
    _updateState: function () {
        //TODO update state func
        this._updateButtonState();
        this._hilightErrors();
    },
    updateData: function () {
        this._setData();
        this._updateState();
    },
    draw: function () {
        Gis.Widget.Propertys.prototype.draw.call(this);
        this.updateData();
    },
    initHTML: function () {
        Gis.Widget.Propertys.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.MeasureProperty.CLASS_NAME);
    },
    setBounds: function () {
        var maxHeight, heightContainer, $wrapper, $wrParent, $info, pointsHeight, infoPadding;
        heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
        maxHeight = heightContainer - Math.min(heightContainer / 2, 300);
        $wrapper = $('#points-selector', this._$div);
        $info = $('#info-data', this._$div);
        $wrParent = $wrapper.parent();
        $('.gis-widget-propertys-buttons-wraper', this._$div)
            .each(function () {
                maxHeight -= $(this).outerHeight(true);
            });
        maxHeight -= $wrapper.outerHeight(true) - $wrapper.height() + $wrParent.outerHeight(true) - $wrParent.height() + $('.gis-widget-propertys-title', $wrParent).outerHeight(true) - this._$div.outerHeight(true) + this._$div.height();
        infoPadding = $info.parent().outerHeight(true) - $info.height();
        pointsHeight = ((maxHeight / 2 - infoPadding));
        $wrapper.css({
            maxHeight: Math.max(pointsHeight, 40)
        });
        $info.css({
            maxHeight: maxHeight - $wrapper.height() - infoPadding
        });
    },
    _xyRowHTML: function () {
        return "<li class='data-row'>\n" +
                "<span>X</span><input type='text' data-old-val='' class='marker-input marker-x' value=''/>\n" +
                "<span>Y</span><input type='text' data-old-val='' class='marker-input marker-y' value=''/>\n" +
                "<span class='gis-widget-ico gis-widget-ico-up'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-down'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-remove'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-add'></span>\n" +
            "</li>\n";
    },
    initDataBlock: function () {
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='points-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Точки</div>\n" +
                "<div id='points-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<ol>\n" +
                        this._xyRowHTML() +
                        this._xyRowHTML() +
                    "</ol>\n" +
                    "<div class='gis-widget-add-to-end'><span class='gis-widget-ico gis-widget-ico-add'></span></div>" +
                "</div>\n" +
            "</div>\n";
    },
    initButtonsBlock: function () {
        return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
            "<ul class='gis-property-buttons-list'>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME) + "</li>\n" +
            "</ul>\n" +
            "</div>\n";
    },
    _isStateChanged: function () {
        var changed = false, $rows, self = this;

        $rows = $('#points-selector li', this._$div);
        if (self._history.length && self._history.length !== $rows.length) {
            return true;
        }
        $rows.each(function (index) {
            var $row = $(this), $markerX = $('.marker-x', $row), $markerY = $('.marker-y', $row);
            changed = changed || self._rowChanged($markerX) || self._rowChanged($markerY) || (self._history[index] && this !== self._history[index]);
        });
        return changed;
    },
    _updateButtonState: function () {
        this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
        this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
        this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
        this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
        function switchButtonState(button, enable) {
            if (enable) {
                button.removeAttr('disabled');
            } else {
                button.attr('disabled', 'disabled');
            }
        }
        switchButtonState(this._$buttonNew, this._isStateChanged() && !this._hilightErrors());
        switchButtonState(this._$buttonDeselect, this._isStateChanged());
        switchButtonState(this._$buttonDelete, this._path && this._containerController.getUIAttached().getMap().getLayer(this._path.getId()));
        switchButtonState(this._$buttonRevert, this._isStateChanged());
        //Хак для файрфокса
        $($('button', this._$div).not('[disabled=disabled]')[0]).focus();

    },
    _getLastClearPoint: function () {
        var $rows, i, $x, $y, $clearRow;
        $rows = $('#points-selector li', this._$div);
        for (i = $rows.length - 1; i >= 0; i -= 1) {
            $x = $('.marker-x', $rows[i]);
            $y = $('.marker-y', $rows[i]);
            if ($x.val() !== '' || $y.val() !== '') {
                break;
            } else if ($x.val() === '' && $y.val() === '') {
                $clearRow = $rows[i];
            }
        }
        if (!$clearRow) {
            $clearRow = $(this._xyRowHTML());
            $('#points-selector ol', this._$div).append($clearRow);
        }
        return $clearRow;
    },
    _insertNewPoint: function (latLng) {
        var $row = this._getLastClearPoint();
        this._setValue($('.marker-x', $row), this.coordinateToTemplate(latLng.lng, true));
        this._setValue($('.marker-y', $row), this.coordinateToTemplate(latLng.lat));
    },
    _mapClicked: function (e) {
        this._insertNewPoint(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
        this._calculateMeasuring(this._history.length === $('#points-selector li', this._$div).length && this._path && this._containerController.getUIAttached().getMap().hasLayer(this._path));
        this._updateState();
    },
    _calculatePointData: function (row1, row2) {
        var point1, point2;
        if (row1 && row2) {
            point1 = Gis.latLng(this.templateToCoordinate($('.marker-y', $(row1)).val()), this.templateToCoordinate($('.marker-x', $(row1)).val()));
            point2 = Gis.latLng(this.templateToCoordinate($('.marker-y', $(row2)).val()), this.templateToCoordinate($('.marker-x', $(row2)).val()));
            return {
                distance: point1.distanceTo(point2),
                angle: Gis.Projection.calculateAsimuth(point1, point2)
            };
        }
    },
    _informationHTML: function () {
        var htmlRows = "", allLength = 0;
        if (this._pointsCalculated && this._pointsCalculated.length) {
            this._pointsCalculated.forEach(function (val, key) {
                allLength += val.distance;
                htmlRows += "<li class='gis-widget-info-row gis-widget-measure-info-row'>" +
                    "<span class='title'>Длина " + (key + 1) + "-" + (key + 2) + ":</span><span class='value'>" + val.distance.toFixed(2) + "</span></li>" +
                    "<li class='gis-widget-info-row gis-widget-measure-info-row'>" +
                    "<span class='title'>Угол " + (key + 1) + "-" + (key + 2) + ":</span><span class='value'>" + val.angle.toFixed(2) + "</span></li>";
            });
        }
        return htmlRows && "<ul class='gis-widget-info gis-widget-measure-info'>" +
                "<li class='gis-widget-info-row gis-widget-measure-info-row'>" +
                    "<span class='title'>Общая длина:</span><span class='value'>" + allLength.toFixed(2) + "</span></li>" +
                htmlRows +
            "</ul>";
    },
    _infoContainerHTML: function (htmlRows) {
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='info-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Информация</div>\n" +
                "<div id='info-data' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    htmlRows +
                "</div>\n" +
            "</div>\n";
    },
    _drawResultCalculation: function () {
        var $infoContainer, htmlRows;
        htmlRows = this._informationHTML();
        if (htmlRows) {
            $infoContainer = $('.gis-widget-measure-info', this._$div);
            if ($infoContainer.length) {
                $infoContainer.replaceWith($(htmlRows));
            } else {
                this._$infoContainer = $(this._infoContainerHTML(htmlRows));
                this._$infoContainer.insertAfter($('.' + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS, this._$div));
            }
            this.setBounds();
        }
    },
    _updateDataFromPath: function () {
        var latlngs = this._path.getLatLngs(),
            callback,
            $rows,
            self = this;
        if (latlngs) {
            $rows = $('#points-selector li', this._$div);
            callback = function (value, index) {
                if ($rows[index]) {
                    self._setValue($('.marker-y', $($rows[index])), self.coordinateToTemplate(value[0]));
                    self._setValue($('.marker-x', $($rows[index])), self.coordinateToTemplate(value[1], true));
                }
            };
            latlngs.forEach(callback);
            this._calculateMeasuring(this._history.length === $rows.length && true);
        }
    },
    _initPathEvents: function () {
        if (this._path && !this._pathEventsInitialized) {
            this._pathEventsInitialized = true;
            this._path.on('change', this._updateDataFromPath, this);
            this._path.on('selected', this._layerSelected, this);
            this._path.on('unselected', this._layerUnSelected, this);
        }
    },
    _deInitPathEvents: function () {
        if (this._path && this._pathEventsInitialized) {
            this._pathEventsInitialized = false;
            this._path.off('change', this._updateDataFromPath, this);
            this._path.off('selected', this._layerSelected, this);
            this._path.off('unselected', this._layerUnSelected, this);
        }
    },
    _drawPath: function () {
        var lineStyle, style;
        if (!this._path) {
            style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('measure'));
            lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
            this._path = Gis.path(Gis.Util.extend({tacticObjectType: 'measurer', line: lineStyle, draggable: true, selectable: true, className: 'gis-measure-marker', orthodrome: true, icon: style.icon}, this._pathPoints));
            this._path.setControllableByServer(false);
            this._path.setSelectedStyle(undefined);
        } else {
            this._path.setData(Gis.Util.extend({}, this._pathPoints));
        }
        if (!this._containerController.getUIAttached().getMap().hasLayer(this._path)) {
            this._path.addTo(this._containerController.getUIAttached().getMap());
        }
        this._initPathEvents();
    },
    _calculateMeasuring: function (skipPathRedraw) {
        var $rows, self;
        self = this;
        if (!this._hilightErrors()) {
            $rows = $('#points-selector li', this._$div);
            this._pointsCalculated = [];
            this._pathPoints = {latitudes: [], longitudes: []};
            $rows.each(function (position) {
                var $nextRow, $markerY = $('.marker-y', $(this)), $markerX = $('.marker-x', $(this));
                $nextRow = $rows[position + 1];
                if ($markerY.val() !== '' && $markerX.val() !== '') {
                    self._setValue($markerX, $markerX.val());
                    self._setValue($markerY, $markerY.val());
                    self._pathPoints.latitudes.push(self.templateToCoordinate($markerY.val()));
                    self._pathPoints.longitudes.push(self.templateToCoordinate($markerX.val()));
                    if ($nextRow) {
                        self._pointsCalculated.push(self._calculatePointData($(this), $nextRow));
                    }
                }
            });
            if (!skipPathRedraw && self._pathPoints.longitudes.length >= 2) {
                this._drawPath();
            }
            if (self._pathPoints.longitudes.length >= 2) {
                this._drawResultCalculation();
            }
            this._updateHistory();
        }
        this._updateState();
    },
    _layerSelected: function (e) {
        var markerKey = e.additional && e.additional.markerKey,
            row,
            $rows;
        if (markerKey !== undefined) {
            $rows = $('#points-selector .data-row', this._$div);
            row = $rows[markerKey];
            $rows.not(row).removeClass('selected');
            if (row) {
                $(row).addClass('selected');
            }
        }
    },
    _layerUnSelected: function () {
        var $rows;
        $rows = $('#points-selector .data-row', this._$div);
        $rows.removeClass('selected');
    },
    onRemove: function () {
        Gis.Widget.Propertys.prototype.onRemove.call(this);
        this._containerController.getUIAttached().getMap().removeLayer(this._path);
    },
    _deInitEvents: function () {
        this._deInitPathEvents();
        this._$div.off('click', '.gis-widget-ico-up', this._icoUpClick);
        this._$div.off('click', '.gis-widget-ico-down', this._icoDownClick);
        this._$div.off('click', '.gis-widget-ico-remove', this._icoDeleteClick);
        this._$div.off('click', '.gis-widget-ico-add', this._icoPlusClick);

        this._$div.off('change', '.data-row input, .data-row input', this._textRowChange);
        this._$div.off('keyup', '.data-row input, .data-row input', this._textRowChange);
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._deInitEvents.call(this);
    },
    _removeRow: function ($row) {
        var $list = $row.parent();
        if ($('.data-row', $list).length > 2) {
            $row.remove();
        }
    },
    _deleteKeyFire: function (e) {
        if ((e.srcElement || e.target).type !== 'text') {
            if ($('#points-selector .data-row.selected', this._$div).length) {
                this._removeRow($('#points-selector .data-row.selected', this._$div));
                this._updateState();
                e.preventDefault();
                return false;
            }
        }
    },
    _initEvents: function () {
        var self = this;
        this._initPathEvents();
        this._containerController.getUIAttached().getMap().on('layerselected', this._layerSelected, this);
        this._containerController.getUIAttached().getMap().on('layerunselected', this._layerUnSelected, this);
        function generateEnteredFunction(callback) {
            return function (e) {
                var returnKeyCode = 13;
                if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                    callback();
                }
                e.stopPropagation();
            };
        }
        this._returnFunction = this._returnFunction || function () {
            self._calculateMeasuring();
        };
        this._icoUpClick = this._icoUpClick || function () {
            var $listRow = $(this).parent(), $prev;
            $prev = $listRow.prev();
            if ($prev.length) {
                $listRow.insertBefore($prev);
            }
            self._updateState();
        };
        this._icoDownClick = this._icoDownClick || function () {
            var $listRow = $(this).parent(), $next;
            $next = $listRow.next();
            if ($next.length) {
                $next.insertBefore($listRow);
            }
            self._updateState();
        };
        this._icoDeleteClick = this._icoDeleteClick || function () {
            var $row = $(this).parent();
            self._removeRow($row);
            self._updateState();
        };
        this._icoPlusClick = this._icoPlusClick || function () {
            var $listRow = $(this).parent();
            if ($listRow[0].tagName.toLowerCase() === 'li') {
                $(self._xyRowHTML()).insertBefore($listRow);
            } else {
                $(self._xyRowHTML()).appendTo($('ol', $listRow.parent()));
            }
            self._updateState();
        };
        this._deleteFunction = this._deleteFunction || function () {
            self._clearMeasure();
        };
        this._textRowChange = this._textRowChange || function () {
            self._updateState();
        };
        this._textRowKeyPress = this._textRowKeyPress || function () {
            self._updateState();
        };
        this._revertFunction = this._revertFunction || function () {
            self.back();
        };
        this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
        this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
        this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);

        this._$div.on('click', '.gis-widget-ico-up', this._icoUpClick);
        this._$div.on('click', '.gis-widget-ico-down', this._icoDownClick);
        this._$div.on('click', '.gis-widget-ico-remove', this._icoDeleteClick);
        this._$div.on('click', '.gis-widget-ico-add', this._icoPlusClick);
        this._$div.on('change', '.data-row input, .data-row input', this._textRowChange);
        this._$div.on('keyup', '.data-row input, .data-row input', this._textRowChange);
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction,
            keydown: this.keyPressPreventDefault
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._initEvents.call(this);
    },
    _update: function () {
        this.updateData();
        //Хак для файрфокса
        $($('button', this._$div).not('[disabled=disabled]')[0]).focus();
    },
    bindData: function (data) {
    }
});

Gis.Widget.MeasureProperty.CLASS_NAME = "gis-widget-propertys-measure";
Gis.Widget.MeasureProperty.CENTER_CHANGED = 1;
Gis.Widget.MeasureProperty.TEXT_CHANGED = 3;
Gis.Widget.MeasureProperty.BOTH_CHANGED = 2;
Gis.Widget.MeasureProperty.NOT_CHANGED = 0;
Gis.Widget.measureProperty = function (data) {
    return new Gis.Widget.MeasureProperty(data);
};
"use strict";
/**
 *
 * Параметры объекта
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.ObjectProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.ObjectProperty.prototype
     */
    {
    _history: [],
        /**
         * Допустимые параметры
         * @type {object}
         * @property {string[]} [colors=["#FF3911", "#1632FF", "#808080", "#FFD800", "#0094FF"]]
         * @property {string[]} [types=["target", "danger", "circle", "storm", "simple"]]
         */
    _options: {
        types: undefined,
        colors: undefined
    },
    initialize: function (data) {
        Gis.Widget.Propertys.prototype.initialize.call(this, data);
        this.options.types = this.options.types || [
            "target",
            "danger",
            "circle",
            "storm",
            "simple"
        ];
        this.options.color = this.options.color || [
            "#FF3911",
            "#1632FF",
            "#808080",
            "#FFD800",
            "#0094FF"
        ];

        if (this.options.dataBinded) {
            this.options.dataBinded.on('change', this.updateData, this);
        }
    },
    _updateHistory: function () {
        this._updateState();
    },
    back: function () {
        var dataHistory;
        if (!this._isStateChanged()) {
            dataHistory = this._history.pop();
            if (dataHistory) {
                this._setData(dataHistory.text, dataHistory.center, dataHistory.color);
            }
        } else {
            this._$Xrow.val(this._$Xrow.data('old-val'));
            this._$Yrow.val(this._$Yrow.data('old-val'));
            this._$TEXTrow.val(this._$TEXTrow.data('old-val'));
            if (this.options.dataBinded) {
                this._newColor = this.options.dataBinded.getImageColor();
            }
        }
        this.updateData();
    },
    _setData: function (text, center) {
        center = center || (this.options.dataBinded && this.options.dataBinded.getLatLng());
        text = (text || (this.options.dataBinded && this.options.dataBinded.getPopup())) || '';
        this._setValue(this._$Xrow, (center && this.coordinateToTemplate(center[1], true)) || "");
        this._setValue(this._$Yrow, (center && this.coordinateToTemplate(center[0])) || "");
        this._setValue(this._$TEXTrow, text);
    },
    _updateColor: function () {
        $('.gis-color-list', this._$div).replaceWith(this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getImageColor()));
    },
    _updateType: function () {
        $('.gis-image-type-list', this._$div).replaceWith(this._HTMLtypeSelector(true, this.options.dataBinded && this.options.dataBinded.getImageType()));
    },
    _hilightErrors: function () {
        var error = false;
        error = error || this.checkCoordinate(this._$Xrow);
        error = error || this.checkCoordinate(this._$Yrow);
        if (!$('.gis-color-button.selected', this._$div).data('color')) {
            error = true;
        }
        return error;
    },
    _updateCoordanatesState: function () {
        if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
            this._$Xrow.attr('disabled', 'disabled');
            this._$Yrow.attr('disabled', 'disabled');
        } else {
            this._$Xrow.removeAttr('disabled');
            this._$Yrow.removeAttr('disabled');
        }
    },
    _updateState: function () {
        this._updateButtonState();
        this._updateCoordanatesState();
        this._hilightErrors();
    },
    updateData: function () {
        this._setData();
        this._updateColor();
        this._updateType();
        this._updateState();
    },
    draw: function () {
        Gis.Widget.Propertys.prototype.draw.call(this);
        var selected = this._containerController.getUIAttached().getMap().getSelected(),
            keys = Object.keys(selected);
        if (keys.length > 1) {
            this.options.dataBinded = undefined;
        } else if (keys.length && selected[keys[0]].getType() === 'text') {
            this.options.dataBinded = selected[keys[0]];
        }
        this.updateData();
    },
    initHTML: function () {
        Gis.Widget.Propertys.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.ObjectProperty.CLASS_NAME);
        this._$Xrow = $('#object-x', this._$div);
        this._$Yrow = $('#object-y', this._$div);
        this._$TEXTrow = $('#object-text', this._$div);
    },
    initDataBlock: function () {
        var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
            text = (this.options.dataBinded && this.options.dataBinded.getPopup()) || "",
            centerX = (center && center[1]) || '',
            centerY = (center && center[0]) || '';
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Объект</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
            "<ul id='center-selector'>\n" +
            "<li class='data-coll'><span>X</span><input type='text' data-old-val='" + centerX + "' id='object-x' class='object-input' value='" + centerX + "'/></li>\n" +
            "<li class='data-coll'><span>Y</span><input type='text' data-old-val='" + centerY + "' id='object-y' class='object-input' value='" + centerY + "'/></li>\n" +
            "</ul>\n" +
            "<div>\n" +
            "<ul>\n" +
            "<li class='data-row data-title'><span>Комментарий:</span></li>\n" +
            "<li class='data-row'><input type='text' data-old-val='" + text + "' id='object-text' class='object-input' value='" + text + "'/></li>\n" +
            "</ul>\n" +
            "</div>\n" +
            "</div>\n" +
            "</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Пиктограмма</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "  gis-color-container'>" +
            this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getImageColor()) +
            this._HTMLtypeSelector(true, this.options.dataBinded && this.options.dataBinded.getImageType()) +
            "</div>" +
            "</div>\n" +
            "</div>\n";
    },
    initButtonsBlock: function () {
        return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
            "<ul class='gis-property-buttons-list'>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новая', !this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "</ul>\n" +
            "</div>\n";
    },
    getSelectedColor: function () {
        return $('.gis-color-button.selected', this._$div).data('color');
    },
    getSelectedType: function () {
        return $('.gis-image-type-button.selected', this._$div).data('type');
    },
    _isStateChanged: function () {
        var changed;
        changed = (this._rowChanged(this._$Xrow)) ||
            (this._rowChanged(this._$Yrow)) ||
            (this._rowChanged(this._$TEXTrow)) ||
            (this.options.dataBinded && (this.options.dataBinded.getImageColor() !== this.getSelectedColor() || this.options.dataBinded.getImageType() !== this.getSelectedType()));
        return changed;
    },
    _updateButtonState: function () {
        var buttonSaveText;
        this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
        this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
        this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
        this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
        function switchButtonState(button, enable) {
            if (enable) {
                button.removeAttr('disabled');
            } else {
                button.attr('disabled', 'disabled');
            }
        }
        buttonSaveText = this.options.dataBinded && this._isStateChanged() ? "Подтвердить" : !this.options.dataBinded ? "Новая" : "Подтвердить";
        $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
        switchButtonState(this._$buttonNew, (!this.options.dataBinded || this._isStateChanged()) && !this._hilightErrors());
        switchButtonState(this._$buttonDeselect, this.options.dataBinded);
        switchButtonState(this._$buttonDelete, this.options.dataBinded);
        switchButtonState(this._$buttonRevert, this._isStateChanged());

    },
    _initDialogNew: function () {
        var self = this, $dialog;
        $dialog = $('#object-new-dialog');
        if (!$dialog.length) {
            $dialog = $('<div id="object-new-dialog"/>');
            $dialog.append("<div><span class='dialog-label'>Пиктограмма</span>" + this._HTMLtypeSelector(false, this.options.dataBinded && this.options.dataBinded.getImageType()) + "</div>");
            $dialog.append("<div><span class='dialog-label'>Цвет объекта</span>" + this._HTMLcolorSelector(false, this.options.dataBinded && this.options.dataBinded.getImageColor()) + "</div>");
            $dialog.append("<div><span class='dialog-label'>Комментарий</span>" +
                "<input type='text' id='dialog-new-object-text'/>" +
                "</div>");
            $dialog.appendTo($(document.body));
            $($dialog).on('click', '.gis-param-selector', function () {
                var $this = $(this);
                if (!$this.hasClass('selected')) {
                    $('.gis-param-selector.selected', $this.parent()).removeClass('selected');
                    $this.addClass('selected');
                }
            });
            $($dialog).on('dialogclose', function () {
                var $this = $(this);
                $('.gis-param-selector.selected', $this).removeClass('selected');
                $('#dialog-new-object-text', $this).val('');
            });
        }
        $dialog.dialog({
            dialogClass: "no-title-bar",
            autoOpen: false,
            closeOnEscape: true,
            minHeight: 10,
            minWidth: 210,
            draggable: true,
            modal: true,
            buttons: [
                {
                    text: 'OK',
                    click: function () {
                        var color, text, type, $this;
                        $this = $(this);
                        color = $('.gis-color-button.selected', $this).data('color');
                        type = $('.gis-image-type-button.selected', $this).data('type');
                        text = $('#dialog-new-object-text', $this).val();
                        if (color && type) {
                            self._saveData($dialog.latlng.lng, $dialog.latlng.lat, text, color, type, true);
                            $(this).dialog("close");
                        }
                    }
                },
                {
                    text: 'Отменить',
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });
        return $dialog;
    },
    _deinitDialogs: function () {
        this._$dialogRemove.dialog('destroy');
        $(document.body).remove(this._$dialogRemove);
        this._$dialogRemove = undefined;
    },
    _opedDialogNewLabel: function (latlng) {
        this._$dialogNew = this._$dialogNew || this._initDialogNew();
        this._$dialogNew.latlng = latlng;
        this._$dialogNew.dialog('open');
    },
    _saveData: function (x, y, text, color, type, forceNew) {
        var newLayer;
        x = x || this.templateToCoordinate(this._$Xrow.val());
        y = y || this.templateToCoordinate(this._$Yrow.val());
        text = text || this._$TEXTrow.val();
        color = color || $('.gis-color-button.selected', this._$div).data('color') || this.options.dataBinded.getImageColor();
        type = type || $('.gis-image-type-button.selected', this._$div).data('type') || this.options.dataBinded.getImageType();
        if (x && y && color && type) {
            if (!forceNew && this.options.dataBinded) {
                this.options.dataBinded.setData({
                    icon: Gis.icon({type: type, color: color}),
                    popup: text,
                    latitude: y,
                    longitude: x
                });
            } else {
                newLayer = Gis.imageLabel({popup: text, latitude: y, longitude: x,
                    icon: Gis.icon({type: type, color: color}), draggable: true, selectable: true});
                newLayer.addTo(this._containerController.getUIAttached().getMap());
                this._containerController.getUIAttached().getMap().selectLayer(newLayer);
            }
            this._update();
        } else {
            this._updateState();
        }
    },
    _deleteKeyFire: function (e) {
        if ((e.srcElement || e.target).type !== 'text') {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить объект?',
                callback: function () {
                    this._containerController.getUIAttached().getMap().removeLayer(this.options.dataBinded);
                },
                context: this,
                id: 'object-remove-dialog'
            });
        }
    },
    _mapClicked: function (e) {
        this._opedDialogNewLabel(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
    },
    _deInitEvents: function () {
        $('.data-row input', this._$div).off({
            change: this._textRowChange,
            keyup: this._textRowChange
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        if (this.options.dataBinded) {
            this.options.dataBinded.off('change', this.updateData, this);
        }
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._deInitEvents.call(this);
    },
    _initEvents: function () {
        var self = this;
        function generateEnteredFunction(callback) {
            return function (e) {
                var returnKeyCode = 13;
                if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                    callback();
                }
            };
        }
        this._returnFunction = this._returnFunction || function () {
            self._saveData();
        };
        this._deleteFunction = this._deleteFunction || function () {
            self._deleteKeyFire();
        };
        this._textRowChange = this._textRowChange || function (e) {
            self._updateState();
            e.stopPropagation();
        };
        this._textRowKeyPress = this._textRowKeyPress || function () {
            self._updateState();
        };
        this._revertFunction = this._revertFunction || function () {
            self.back();
        };
        this._deselectFunction = this._deselectFunction || function () {
            self._containerController.getUIAttached().getMap().unselectLayer(self.options.dataBinded);
        };
        this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
        this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
        this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || generateEnteredFunction(self._deselectFunction);
        this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
        $('.data-coll input, .data-row input', this._$div).on({
            change: this._textRowChange,
            keyup: this._textRowChange,
            keydown: this.keyPressPreventDefault
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._initEvents.call(this);
    },
    _update: function () {
        this.updateData();
    },
    bindData: function (data) {
        if (data !== this.options.dataBinded) {
            this._newColor = undefined;
            if (this.options.dataBinded) {
                this.options.dataBinded.off('change', this.updateData, this);
            }
            if (data) {
                data.on('change', this.updateData, this);
            }
            Gis.Widget.Propertys.prototype.bindData.call(this, data);
            this.updateData();
        }
    }
});

Gis.Widget.ObjectProperty.CLASS_NAME = "gis-widget-propertys-object";
Gis.Widget.ObjectProperty.CENTER_CHANGED = 1;
Gis.Widget.ObjectProperty.TEXT_CHANGED = 3;
Gis.Widget.ObjectProperty.BOTH_CHANGED = 2;
Gis.Widget.ObjectProperty.NOT_CHANGED = 0;
Gis.Widget.objectProperty = function (data) {
    return new Gis.Widget.ObjectProperty(data);
};
"use strict";
/**
 * НЕ использовать напрямую!! дает функционал для path и polygon
 * @class
 * @abstract
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.PolylineProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.PolylineProperty.prototype
     */
    {
    _history: [],
    _historyValues: [],
    _minimalPoints: 2,
        /**
         * Допустимые параметры
         * @type {object}
         * @property {string[]} [colors=["#FF3911", "#1632FF", "#808080", "#FFD800", "#0094FF"]]
         */
    _options: {
        colors: undefined
    },
    initialize: function (data) {
        Gis.Widget.Propertys.prototype.initialize.call(this, data);
        this.options.color = this.options.color || [
            "#FF3911",
            "#1632FF",
            "#808080",
            "#FFD800",
            "#0094FF"
        ];

        if (this.options.dataBinded) {
            this._initPolylineEvents();
        }
    },
    _updateHistory: function () {
        var $rows, self = this;
        this._history = [];
        this._historyValues = [];
        $rows = $('#points-selector li', this._$div);
        $rows.each(function () {
            self._history.push(this);
            self._historyValues.push({
                x:  $('.marker-x', $(this)).val(),
                y:  $('.marker-y', $(this)).val()
            });
        });
    },

    _updateColor: function () {
        $('.gis-color-list', this._$div).replaceWith(this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()));
    },
    back: function () {
        var self = this;
        if (this._isStateChanged()) {
            $('#points-selector li', this._$div).not(this._history).remove();
            this._history.forEach(function (row, index) {
                $('#points-selector ol', self._$div).append($(row));
                self._setValue($('.marker-x', $(row)), self._historyValues[index].x);
                self._setValue($('.marker-y', $(row)), self._historyValues[index].y);
            });
            this._updateColor();
        }
        this._updateState();
    },
    _clearInfo: function () {
        this._$infoContainer.remove();
        this._$infoContainer = undefined;
    },
    _clearPolyline: function () {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить маршрут?',
            callback: function () {
                this._containerController.getUIAttached().getMap().removeLayer(this.options.dataBinded);
            },
            context: this,
            id: 'polyline-remove-dialog'
        });
    },
    _setData: function () {
        this._updateDataFromPolyline();
        this._calculatePolyline(true);
    },
    _hilightErrors: function () {
        var error = false, $rows, $Xrow, $Yrow, self = this;
        $rows = $('#points-selector li', this._$div);
        $rows.each(function () {
            $Xrow = $('.marker-x', $(this));
            $Yrow = $('.marker-y', $(this));
            error = error || self.checkCoordinate($Xrow);
            error = error || self.checkCoordinate($Yrow);
        });
        error = error || !this.getSelectedColor();
        return error;
    },
    _updateCoordanatesState: function () {
        var $rows, func;
        if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
            func = function () {
                $('.marker-x', $(this)).attr('disabled', 'disabled');
                $('.marker-y', $(this)).attr('disabled', 'disabled');
            };
            $('.gis-widget-ico', this._$div).hide();
        } else {
            func = function () {
                $('.marker-x', $(this)).removeAttr('disabled');
                $('.marker-y', $(this)).removeAttr('disabled');
            };
            $('.gis-widget-ico', this._$div).show();
        }
        $rows = $('#points-selector li', this._$div);
        $rows.each(func);
    },
    _updateState: function () {
        this._updateButtonState();
        this._updateCoordanatesState();
        this._hilightErrors();
    },
    updateData: function () {
        this._setData();
        this._updateColor();
        this._updateState();
    },
    draw: function () {
        Gis.Widget.Propertys.prototype.draw.call(this);
        if (this.options.dataBinded) {
            this._initPolylineEvents();
        }
        this.updateData();
    },
    initHTML: function () {
        Gis.Widget.Propertys.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.PolylineProperty.CLASS_NAME);
    },
    _xyRowHTML: function () {
        return "<li class='data-row'>\n" +
                "<span>X</span><input type='text' data-old-val='' class='marker-input marker-x' value=''/>\n" +
                "<span>Y</span><input type='text' data-old-val='' class='marker-input marker-y' value=''/>\n" +
                "<span class='gis-widget-ico gis-widget-ico-up'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-down'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-remove'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-add'></span>\n" +
            "</li>\n";
    },
    initDataBlock: function () {
        var rows = "", i = 0;
        for (i; i < this._minimalPoints; i += 1) {
            rows += this._xyRowHTML();
        }
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='points-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>ППМ</div>\n" +
                "<div id='points-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<ol>\n" +
                        rows +
                    "</ol>\n" +
                    "<div class='gis-widget-add-to-end'><span class='gis-widget-ico gis-widget-ico-add'></span></div>" +
                "</div>\n" +
            "</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Цвет</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
            this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()) +
            "</div>\n" +
            "</div>\n";
    },
    initButtonsBlock: function () {
        return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
            "<ul class='gis-property-buttons-list'>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this.options.dataBinded ? 'Подтвердить' : 'Новый') + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME) + "</li>\n" +
            "</ul>\n" +
            "</div>\n";
    },
    _isStateChanged: function () {
        var changed = false, $rows, self = this;

        $rows = $('#points-selector li', this._$div);
        if (self._history.length !== $rows.length) {
            return true;
        }
        $rows.each(function (index) {
            var $row = $(this), $markerX = $('.marker-x', $row), $markerY = $('.marker-y', $row);
            changed = changed || self._rowChanged($markerX) || self._rowChanged($markerY) || (self._history[index] && this !== self._history[index]);
        });
        changed = changed || (this.options.dataBinded && this.options.dataBinded.getColor() !== this.getSelectedColor()) ||
            (!this.options.dataBinded && this.getSelectedColor());
        return changed;
    },
    _updateButtonState: function () {
        this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
        this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
        this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
        this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
        function switchButtonState(button, enable) {
            if (enable) {
                button.removeAttr('disabled');
            } else {
                button.attr('disabled', 'disabled');
            }
        }
        $('.gis-button-text', this._$buttonNew).html(this.options.dataBinded && this._isStateChanged() ?
                "Подтвердить" :
                !this.options.dataBinded ? "Новый" : "Подтвердить");
        switchButtonState(this._$buttonNew, this._isStateChanged() && !this._hilightErrors());
        switchButtonState(this._$buttonDeselect, this.options.dataBinded);
        switchButtonState(this._$buttonDelete, this.options.dataBinded && this._containerController.getUIAttached().getMap().getLayer(this.options.dataBinded.getId()));
        switchButtonState(this._$buttonRevert, this._isStateChanged());
        //Хак для файрфокса
        $($('button', this._$div).not('[disabled=disabled]')[0]).focus();

    },
    _newRowXY: function () {
        var $clearRow = $(this._xyRowHTML());
        $('#points-selector ol', this._$div).append($clearRow);
        return $clearRow;
    },
    _getLastClearPoint: function () {
        var $rows, i, $x, $y, $clearRow;
        $rows = $('#points-selector li', this._$div);
        for (i = $rows.length - 1; i >= 0; i -= 1) {
            $x = $('.marker-x', $rows[i]);
            $y = $('.marker-y', $rows[i]);
            if ($x.val() !== '' || $y.val() !== '') {
                break;
            } else if ($x.val() === '' && $y.val() === '') {
                $clearRow = $rows[i];
            }
        }
        if (!$clearRow) {
            $clearRow = this._newRowXY();
        }
        return $clearRow;
    },
    _insertNewPoint: function (latLng, select) {
        this._lastRow = this._getLastClearPoint();
        if (select) {
            this._selectRowInList($(this._lastRow));
        }
        $('.marker-x', this._lastRow).val(this.coordinateToTemplate(latLng.lng));
        $('.marker-y', this._lastRow).val(this.coordinateToTemplate(latLng.lat, true));
    },
    _mapClicked: function (e) {
        if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
            return;
        }
        this._insertNewPoint(Gis.latLng(e.latLng.latitude, e.latLng.longitude), true);
        if (this.options.dataBinded && this.options.dataBinded.getColor() === this.getSelectedColor()) {
            this._calculatePolyline(
                this._history.length === $('#points-selector li', this._$div).length &&
                    this._containerController.getUIAttached().getMap().hasLayer(this.options.dataBinded));
            this.options.dataBinded.setSelectedPoint($('#points-selector li', this._$div).index(this._lastRow), true);
        } else {
            this._updateState();
        }
    },
    _calculatePointData: function (row1) {
        var point1;
        if (row1) {
            point1 = Gis.latLng(this.templateToCoordinate($('.marker-y', $(row1)).val()), this.templateToCoordinate($('.marker-x', $(row1)).val()));
            this._pointsLatlng.push(point1);
        }
    },
    _informationHTML: function () {
        var htmlRows;
        this._distanceCalculated = this._distanceCalculated || 0;
        this._moving = this._moving || 0;
        htmlRows = "<li class='gis-widget-info-row gis-widget-polyline-info-row'>" +
            "<span class='title'>Путь :</span><span class='value'>" + this._distanceCalculated.toFixed(2) + "</span></li>" +
            "<li class='gis-widget-info-row gis-widget-polyline-info-row'>" +
            "<span class='title'>Перемещение:</span><span class='value'>" + this._moving.toFixed(2) + "</span></li>";
        return htmlRows && "<ul class='gis-widget-info  gis-widget-polyline-info'>" +
                htmlRows +
            "</ul>";
    },
    _infoContainerHTML: function (htmlRows) {
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='info-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Информация</div>\n" +
                "<div id='info-data' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    htmlRows +
                "</div>\n" +
            "</div>\n";
    },
    _drawResultCalculation: function () {
        var $infoContainer, htmlRows;
        htmlRows = this._informationHTML();
        if (htmlRows) {
            $infoContainer = $('.gis-widget-polyline-info', this._$div);
            if ($infoContainer.length) {
                $infoContainer.replaceWith($(htmlRows));
            } else {
                this._$infoContainer = $(this._infoContainerHTML(htmlRows));
                this._$infoContainer.insertAfter($('.' + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS, this._$div));
            }
        }
    },
    _updateDataFromPolyline: function () {
        var latlngs = this.options.dataBinded && this.options.dataBinded.getLatLngs(),
            callback,
            $rows,
            self = this,
            count = 0,
            i,
            len;
        $rows = $('#points-selector li', this._$div);
        if (latlngs) {
            callback = function (value, index) {
                var $row = $($rows[index]);
                if (!$row.length) {
                    $row = self._newRowXY();
                }
                self._setValue($('.marker-y', $row), self.coordinateToTemplate(value[0]));
                self._setValue($('.marker-x', $row), self.coordinateToTemplate(value[1], true));
                count = index;
            };
            latlngs.forEach(callback);
            if ($rows[count + 1]) {
                for (i = count + 1, len = $rows.length; i < len; i += 1) {
                    this._removeRow($($rows[i]));
                }
            }
            this._calculatePolyline(this._history.length === $rows.length && true);
        } else {
            $rows.each(function (idx) {
                if (idx < self._minimalPoints) {
                    self._setValue($('.marker-y', $(this)), "");
                    self._setValue($('.marker-x', $(this)), "");
                } else {
                    self._removeRow($(this));
                }
            });
        }
        this._updateHistory();
    },
    _initPolylineEvents: function () {
        if (this.options.dataBinded && !this.options.dataBindedEventsInitialized) {
            this.options.dataBindedEventsInitialized = true;
            this.options.dataBinded.on('change', this._updateDataFromPolyline, this);
            this.options.dataBinded.on('selected', this._layerSelected, this);
            this.options.dataBinded.on('unselected', this._layerUnSelected, this);
        }
    },
    _deInitPolylineEvents: function () {
        if (this.options.dataBinded && this.options.dataBindedEventsInitialized) {
            this.options.dataBindedEventsInitialized = false;
            this.options.dataBinded.off('change', this._updateDataFromPolyline, this);
            this.options.dataBinded.off('selected', this._layerSelected, this);
            this.options.dataBinded.off('unselected', this._layerUnSelected, this);
        }
    },
    getSelectedColor: function () {
        return $('.gis-color-button.selected', this._$div).data('color');
    },
    _drawPolyline: function () {
        Gis.extendError();
    },
    _calculatePolyline: function (skipPolylineRedraw) {
        var $rows, self;
        self = this;
        if (!this._hilightErrors()) {
            $rows = $('#points-selector li', this._$div);
            this._distanceCalculated = 0;
            this._pointsLatlng = [];
            this.options.dataBindedPoints = {latitudes: [], longitudes: []};
            $rows.each(function (position) {
                var $nextRow, $markerY = $('.marker-y', $(this)), $markerX = $('.marker-x', $(this));
                $nextRow = $rows[position + 1];
                if ($markerX.val() !== '' && $markerY.val() !== '') {
                    $markerX.data('old-val', $markerX.val());
                    $markerY.data('old-val', $markerY.val());
                    self.options.dataBindedPoints.latitudes.push(self.templateToCoordinate($markerY.val()));
                    self.options.dataBindedPoints.longitudes.push(self.templateToCoordinate($markerX.val()));
                    self._calculatePointData($(this), $nextRow);
                }
            });
            self._moving = self._calculatePointData($($rows[0]), $($rows[$rows.length - 1]), true);
            if (!skipPolylineRedraw) {
                this._drawPolyline();
            }
            this._updateHistory();
        } else {
            self._distanceCalculated = 0;
            self._moving = 0;
        }
        this._updateState();
    },
    _selectRowInList: function (row) {
        var $rows;
        $rows = $('#points-selector .data-row', this._$div);
        $rows.not(row).removeClass('selected');
        if (row) {
            $(row).addClass('selected');
        }
        return $rows;
    },
    _layerSelected: function (e) {
        var markerKey = e.additional && e.additional.markerKey,
            row,
            $rows;
        if (markerKey !== undefined) {
            $rows = $('#points-selector .data-row', this._$div);
            row = $rows[markerKey];
            this._selectRowInList(row);
        }
    },
    _layerUnSelected: function () {
        var $rows;
        $rows = $('#points-selector .data-row', this._$div);
        $rows.removeClass('selected');
    },
    _deInitEvents: function () {
        this._deInitPolylineEvents();
        this._$div.off('click', '.gis-widget-ico-up', this._icoUpClick);
        this._$div.off('click', '.gis-widget-ico-down', this._icoDownClick);
        this._$div.off('click', '.gis-widget-ico-remove', this._icoDeleteClick);
        this._$div.off('click', '.gis-widget-ico-add', this._icoPlusClick);

        this._$div.off('change', '.data-row input, .data-row input', this._textRowChange);
        this._$div.off('keyup', '.data-row input, .data-row input', this._textRowChange);
        this._$div.off('focus', '.data-row input, .data-row input', this._textRowFocus);
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._deInitEvents.call(this);
    },
    _removeRow: function ($row) {
        var $list = $row.parent();
        if ($('.data-row', $list).length > this._minimalPoints) {
            $row.remove();
        }
    },

    _deleteKeyFire: function (e) {
        if ($('#points-selector .data-row.selected', this._$div).length) {
            if ((e.srcElement || e.target).type !== 'text') {
                this._removeRow($('#points-selector .data-row.selected', this._$div));
                this._updateState();
                e.preventDefault();
                return false;
            }
        }
        return true;
    },
    _initEvents: function () {
        var self = this;
        this._initPolylineEvents();
        this._containerController.getUIAttached().getMap().on('layerselected', this._layerSelected, this);
        this._containerController.getUIAttached().getMap().on('layerunselected', this._layerUnSelected, this);

        this._returnFunction = this._returnFunction || function () {
            self._calculatePolyline();
        };
        this._icoUpClick = this._icoUpClick || function () {
            var $listRow = $(this).parent(), $prev;
            $prev = $listRow.prev();
            if ($prev.length) {
                $listRow.insertBefore($prev);
            }
            self._updateState();
        };
        this._icoDownClick = this._icoDownClick || function () {
            var $listRow = $(this).parent(), $next;
            $next = $listRow.next();
            if ($next.length) {
                $next.insertBefore($listRow);
            }
            self._updateState();
        };
        this._icoDeleteClick = this._icoDeleteClick || function () {
            var $row = $(this).parent();
            self._removeRow($row);
            self._updateState();
        };
        this._icoPlusClick = this._icoPlusClick || function () {
            var $listRow = $(this).parent();
            if ($listRow[0].tagName.toLowerCase() === 'li') {
                //noinspection JSCheckFunctionSignatures
                $(self._xyRowHTML()).insertBefore($listRow);
            } else {
                $(self._xyRowHTML()).appendTo($('ol', $listRow.parent()));
            }
            self._updateState();
        };
        this._deleteFunction = this._deleteFunction || function () {
            self._clearPolyline();
        };
        this._textRowChange = this._textRowChange || function () {
            self._updateState();
        };
        this._textRowFocus = this._textRowFocus || function () {
            if (self.options.dataBinded) {
                var $parentRow = $(this).parent();
                self._selectRowInList($parentRow);
                self.options.dataBinded.setSelectedPoint($('#points-selector li', this._$div).index($parentRow), true);
            }
        };
        this._textRowKeyPress = this._textRowKeyPress || function () {
            self._updateState();
        };
        this._revertFunction = this._revertFunction || function () {
            self.back();
        };
        this._deselectFunction = this._deselectFunction || function () {
            self._containerController.getUIAttached().getMap().clearSelected();
        };
        this._KeyUpReturnFunction = this._KeyUpReturnFunction || this.generateEnteredFunction(self._deleteFunction);
        this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || this.generateEnteredFunction(self._returnFunction);
        this._KeyUpRevertFunction = this._KeyUpRevertFunction || this.generateEnteredFunction(self._revertFunction);

        this._$div.on('click', '.gis-widget-ico-up', this._icoUpClick);
        this._$div.on('click', '.gis-widget-ico-down', this._icoDownClick);
        this._$div.on('click', '.gis-widget-ico-remove', this._icoDeleteClick);
        this._$div.on('click', '.gis-widget-ico-add', this._icoPlusClick);
        this._$div.on('change', '.data-row input, .data-row input', this._textRowChange);
        this._$div.on('focus', '.data-row input, .data-row input', this._textRowFocus);
        this._$div.on('keyup', '.data-row input, .data-row input', this._textRowChange);
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction,
            keydown: this.keyPressPreventDefault
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        Gis.Widget.Propertys.prototype._initEvents.call(this);
    },
    _update: function () {
        this.updateData();
    },
    bindData: function (data) {
        if (data !== this.options.dataBinded) {
            if (this.options.dataBinded) {
                this._deInitPolylineEvents();
            }
            Gis.Widget.Propertys.prototype.bindData.call(this, data);
            this._initPolylineEvents();
            this.updateData();
        }
    }
});

Gis.Widget.PolylineProperty.CLASS_NAME = "gis-widget-propertys-polyline";
Gis.Widget.PolylineProperty.CENTER_CHANGED = 1;
Gis.Widget.PolylineProperty.TEXT_CHANGED = 3;
Gis.Widget.PolylineProperty.BOTH_CHANGED = 2;
Gis.Widget.PolylineProperty.NOT_CHANGED = 0;
"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.SectorProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.SectorProperty.prototype
     */
    {
    _history: [],
    _defaultStyle: {
        color: '#AF2D51',
        border: 'white',
        thickness: 2,
        selectedBorder: 'rgb(75, 84, 255)',
        angleLineColor: '#272727',
        angleLineBorder: 'white',
        angleLineThickness: 2
    },
        /**
         * Допустимые параметры
         * @type {object}
         * @property {string[]} [colors=["#FF3911", "#1632FF", "#808080", "#FFD800", "#0094FF"]]
         * @property {string[]} [types=[]]
         */
    _options: {
        types: undefined,
        colors: undefined
    },
    initialize: function (data) {
        Gis.Widget.Propertys.prototype.initialize.call(this, data);
        this._createEventFunctions();
        this.options.types = this.options.types || [
        ];
        this.options.color = this.options.color || [
            "#FF3911",
            "#1632FF",
            "#808080",
            "#FFD800",
            "#0094FF"
        ];

        if (this.options.dataBinded) {
            this.options.dataBinded.on('change', this.updateData, this);
        }
    },
    _updateHistory: function () {
        this._updateState();
    },
    back: function () {
        if (this._isStateChanged()) {
            this._revertTextData(this._$Xrow);
            this._revertTextData(this._$Yrow);
            this._revertTextData(this._$RInnerRow);
            this._revertTextData(this._$ROutterRow);
            this._revertTextData(this._$Angle1Row);
            this._revertTextData(this._$Angle2Row);
            this._revertTextData(this._$DirectionRow);
            this._revertTextData(this._$SolutionRow);
            if (this.options.dataBinded) {
                this._newColor = this.options.dataBinded.getColor();
            }
        }
        this.updateData();
    },
    _getFinishAngle: function () {
        var angle = (this.options.dataBinded && (360 - (this.options.dataBinded.getStartAngle() || 360))) || 359;
        return (angle >= 0 ? angle : 360 + angle) % 360;
    },
    _getStartAngle: function () {
        var angle = (this.options.dataBinded && (this.options.dataBinded.getFinishAngle())) || 0;
        return angle >= 0 ? angle : 360 + angle;
    },
    _setData: function (text, center, color) {
        var r1 = (this.options.dataBinded && this.options.dataBinded.getRadius()) || 0,
            r2 = (this.options.dataBinded && this.options.dataBinded.getInnerRadius()) || 0,
            angle = this._getStartAngle() || 0,
            angle2 = this._getFinishAngle();
        center = center || (this.options.dataBinded && this.options.dataBinded.getLatLng());

        this._setValue(this._$Xrow, (center && this.coordinateToTemplate(center[1], true)) || "");
        this._setValue(this._$Yrow, (center && this.coordinateToTemplate(center[0])) || "");
        this._setValue(this._$RInnerRow, r2);
        this._setValue(this._$ROutterRow, r1);
        this._setValue(this._$Angle1Row, angle);
        this._setValue(this._$Angle2Row, angle2);
        this._setValue(this._$DirectionRow, this._calculateDirection(this.options.dataBinded));
        this._setValue(this._$SolutionRow, this._calculateSolution(this.options.dataBinded));
    },
    _updateColor: function () {
        $('.gis-color-list', this._$div).replaceWith(this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()));
    },
    _hilightErrors: function () {
        var error = false;
        error = error || this.checkCoordinate(this._$Xrow);
        error = error || this.checkCoordinate(this._$Yrow);
        error = error || this.chechNumeric(this._$RInnerRow);
        error = error || this.chechNumeric(this._$ROutterRow);
        error = error || this.chechNumeric(this._$Angle1Row);
        if (!$('.gis-color-button.selected', this._$div).data('color')) {
            error = true;
        }
        return error;
    },
    _updateCoordanatesState: function () {
        if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
            this._$Xrow.attr('disabled', 'disabled');
            this._$Yrow.attr('disabled', 'disabled');
        } else {
            this._$Xrow.removeAttr('disabled');
            this._$Yrow.removeAttr('disabled');
        }
    },
    _updateState: function () {
        this._updateButtonState();
        this._updateCoordanatesState();
        this._hilightErrors();
    },
    updateData: function () {
        this._setData();
        if (!this._pressed) {
            this._updateColor();
        }
        this._updateState();
    },
    draw: function () {
        Gis.Widget.Propertys.prototype.draw.call(this);
        var selected = this._containerController.getUIAttached().getMap().getSelected(),
            keys = Object.keys(selected);
        if (keys.length > 1) {
            this.options.dataBinded = undefined;
        } else if (keys.length && selected[keys[0]].getType() === 'sector') {
            this.options.dataBinded = selected[keys[0]];
        }
        this.updateData();
    },
    initHTML: function () {
        Gis.Widget.Propertys.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.SectorProperty.CLASS_NAME);
        this._$Xrow = $('#sector-x', this._$div);
        this._$Yrow = $('#sector-y', this._$div);
        this._$ROutterRow = $('#sector-r1', this._$div);
        this._$RInnerRow = $('#sector-r2', this._$div);
        this._$Angle1Row = $('#sector-angle1', this._$div);
        this._$Angle2Row = $('#sector-angle2', this._$div);
        this._$DirectionRow = $('#sector-direction', this._$div);
        this._$SolutionRow = $('#sector-solution', this._$div);
    },
    _getSolution: function () {
        return parseFloat(this._$SolutionRow.val()) % 360;
    },
    _getDirection: function () {
        return parseFloat(this._$DirectionRow.val()) % 360;
    },
    _anglesByDirection: function () {
        var direction, solution;
        direction = this._getDirection();
        solution = this._getSolution();
        return [(direction - solution / 2) % 360, (direction + solution / 2 % 360)];
    },
    _calculateDirection: function (dataBinded) {
        var startAngle;
        startAngle = dataBinded ? dataBinded.getStartAngle() : (parseFloat(this._$Angle1Row && this._$Angle1Row.val()) || 0);
        return (parseFloat(startAngle) + parseFloat(this._calculateSolution(dataBinded)) / 2) % 360;
    },
    _calculateSolution: function (dataBinded) {
        var startAngle, finishAngle, solution;
        startAngle = (dataBinded ? dataBinded.getStartAngle() : 360 - (parseFloat(this._$Angle2Row && this._$Angle2Row.val()) || 360));
        finishAngle = (dataBinded ? dataBinded.getFinishAngle() : (parseFloat(this._$Angle1Row && this._$Angle1Row.val()) || 359));
        solution = (finishAngle - startAngle) % 360;
        return solution >= 0 ? solution : 360 + solution;
    },
    initDataBlock: function () {
        var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
            r1 = (this.options.dataBinded && this.options.dataBinded.getRadius()) || "",
            r2 = (this.options.dataBinded && this.options.dataBinded.getInnerRadius()) || "",
            angle = this._getStartAngle() || "",
            angle2 = this._getFinishAngle() || "",
            direction = this._calculateDirection(this.options.dataBinded),
            solution = this._calculateSolution(this.options.dataBinded),
            centerX = (center && center[1]) || '',
            centerY = (center && center[0]) || '';
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Параметры</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
            "<ul id='center-selector'>\n" +
            "<li class='data-coll'><span>X</span><input type='text' data-old-val='" + this.coordinateToTemplate(centerX, true) + "' id='sector-x' class='sector-input' value='" + this.coordinateToTemplate(centerX, true) + "'/></li>\n" +
            "<li class='data-coll'><span>Y</span><input type='text' data-old-val='" + this.coordinateToTemplate(centerY) + "' id='sector-y' class='sector-input' value='" + this.coordinateToTemplate(centerY) + "'/></li>\n" +
            "</ul>\n" +
            "<div>\n" +
            "<ul>\n" +
                "<li class='data-row'><span>R внешний:</span>" +
                    "<input type='text' data-old-val='" + r1 + "' id='sector-r1' class='sector-input' value='" + r1 + "'/>" +
                "</li>\n" +
                "<li class='data-row'><span>R внутренний:</span>" +
                    "<input type='text' data-old-val='" + r2 + "' id='sector-r2' class='sector-input' value='" + r2 + "'/>" +
                "</li>\n" +
                "<li class='data-row'><span>Угол 1:</span>" +
                    "<input type='text' data-old-val='" + angle + "' id='sector-angle1' class='sector-input' value='" + angle + "'/>" +
                "</li>\n" +
                "<li class='data-row'><span>Угол 2:</span>" +
                    "<input type='text' data-old-val='" + angle2 + "' id='sector-angle2' class='sector-input' value='" + angle2 + "'/>" +
                "</li>\n" +
                "<li class='data-row'><span>Направление:</span>" +
                    "<input type='text' data-old-val='" + direction + "' id='sector-direction' class='sector-input' value='" + direction + "'/>" +
                "</li>\n" +
                "<li class='data-row'><span>Угол раствора:</span>" +
                    "<input type='text' data-old-val='" + solution + "' id='sector-solution' class='sector-input' value='" + solution + "'/>" +
                "</li>\n" +
            "</ul>\n" +
            "</div>\n" +
            "</div>\n" +
            "</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
            "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
            this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()) +
            "</div>" +
            "</div>\n" +
            "</div>\n";
    },
    _onMouseDown: function (e) {
        if (!this._anglePath) {
            this._cleared = true;
            this._pressed = true;
            if (this.options.dataBinded) {
                this._cleared = false;
                this._containerController.getUIAttached().getMap().unselectLayer(this.options.dataBinded);
            }
            this._startPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
        }
    },
    _drawFromDrag: function () {
        var r1, r2;
        if (this._cleared && this._currentPoint && this._startPoint) {
            r1 = this._startPoint.distanceTo(Gis.latLng(this._startPoint.lat,  this._currentPoint.lng));
            r2 = this._startPoint.distanceTo(Gis.latLng(this._currentPoint.lat,  this._startPoint.lng));
            r1 = Math.max(r1, r2);
            this._saveData({
                x: this._startPoint.lng,
                y: this._startPoint.lat,
                r1: r1,
                r2: 0,
                angle: this._$Angle1Row.val(),
                angle2:this._$Angle2Row.val(),
                notFireServerEvent: true
            });
        }
    },
    _updatePathAngle: function (latLng) {
        if (this._anglePath) {
            var dataToSet = {}, angle, latlng;
            latlng = this.options.dataBinded.getLatLng();
            angle = Gis.Projection.calculateLoxodromeAngle(Gis.latLng(latlng[0], latlng[1]), latLng);
            dataToSet[this._firstAngle ? 'finishAngle' : 'startAngle'] = angle % 360;
            this.options.dataBinded.setData(dataToSet, null, true);
            this._anglePath.setData({
                latitudes: [latlng[0], latLng.lat],
                longitudes: [latlng[1], latLng.lng]
            });
        }
    },
    _onMouseMove: function (e) {
        if (this._pressed && this._cleared && !this._anglePath) {
            this._moved = true;
            this._currentPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
            this._drawFromDrag();
        } else {
            this._updatePathAngle(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
        }
    },
    _finish: function () {
        this._deactivateAnglePath();
    },
    _deactivateAnglePath: function () {
        if (this._anglePath) {
            this.fireServerEvent(this._firstAngle ? 'finishAngle': 'startAngle');
            this._containerController.getUIAttached().getMap().removeLayer(this._anglePath);
            this._anglePath = undefined;
        }
    },
    fireServerEvent: function (rows) {
        if (this.options.dataBinded) {
            this.options.dataBinded.fire('change', {
                target: this.options.dataBinded,
                rows: rows || [
                    'innerRadius',
                    'radius',
                    'startAngle',
                    'finishAngle',
                    'latitude',
                    'longitude',
                    'fill'
                ]
            });
        }
    },
    _startAngleMove: function (mouselatlng) {
        var latlng, style;
        if (this.options.dataBinded) {
            this._firstAngle = true;
            this._deactivateAnglePath();
            latlng = this.options.dataBinded.getLatLng();
            style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('sector'));
            this._anglePath = Gis.path({
                latitudes: [latlng[0], mouselatlng.lat],
                longitudes: [latlng[1], mouselatlng.lng],
                draggable: false,
                line: {color: style.angleLineColor, border: style.angleLineBorder, thickness: style.angleLineThickness},
                selectable: false
            });
            this._anglePath.setControllableByServer(false);
            this._anglePath.addTo(this._containerController.getUIAttached().getMap());
        }
    },
    _finishDrawFromDrag: function (latlng) {
        this._cleared = false;
        this._startPoint = undefined;
        this._currentPoint = undefined;
        this.fireServerEvent();
        if (!this._anglePath) {
            this._startAngleMove(latlng);
        }
    },
    _onMouseUp: function (e) {
        var movedAndPressed = this._moved && this._pressed;
        this._moved = false;
        this._pressed = false;
        if (this._anglePath) {
            if (this._firstAngle) {
                this._firstAngle = false;
                this.fireServerEvent('finishAngle');
            } else {
                this._deactivateAnglePath();
            }
        } else if (movedAndPressed) {
            this._finishDrawFromDrag(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
        }
    },
    _onMouseOut: function () {
        if (this._moved && this._pressed) {
            this._finishDrawFromDrag();
        }
        this._moved = false;
        this._pressed = false;
    },
    initButtonsBlock: function () {
        return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
            "<ul class='gis-property-buttons-list'>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новый', !this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
            "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
            "</ul>\n" +
            "</div>\n";
    },
    getSelectedColor: function () {
        return $('.gis-color-button.selected', this._$div).data('color');
    },
    getSelectedType: function () {
        return $('.gis-image-type-button.selected', this._$div).data('type');
    },
    _isStateChanged: function () {
        var changed;
        changed = this._rowChanged(this._$Xrow) ||
            this._rowChanged(this._$Yrow) ||
            this._rowChanged(this._$RInnerRow) ||
            this._rowChanged(this._$ROutterRow) ||
            this._rowChanged(this._$Angle1Row) ||
            this._rowChanged(this._$Angle2Row) ||
            this._rowChanged(this._$DirectionRow) ||
            this._rowChanged(this._$SolutionRow) ||
            (this.options.dataBinded && (this.options.dataBinded.getColor() !== this.getSelectedColor()));
        return changed;
    },
    _updateButtonState: function () {
        var buttonSaveText;
        this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
        this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
        this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
        this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
        function switchButtonState(button, enable) {
            if (enable) {
                button.removeAttr('disabled');
            } else {
                button.attr('disabled', 'disabled');
            }
        }
        buttonSaveText = this.options.dataBinded && this._isStateChanged() ? "Подтвердить" : !this.options.dataBinded ? "Новый" : "Подтвердить";
        $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
        switchButtonState(this._$buttonNew, (!this.options.dataBinded || this._isStateChanged()) && !this._hilightErrors());
        switchButtonState(this._$buttonDeselect, this.options.dataBinded);
        switchButtonState(this._$buttonDelete, this.options.dataBinded);
        switchButtonState(this._$buttonRevert, this._isStateChanged());

    },
    _deinitDialogs: function () {
        this._$dialogRemove.dialog('destroy');
        $(document.body).remove(this._$dialogRemove);
        this._$dialogRemove = undefined;
    },
    _saveData: function (params) {
        function clearAngle(angle) {
            if (angle < 0) {
                angle = 360 + angle % 360;
            }
            return angle;
        }
        var newLayer, data, fillStyle, lineStyle, directionalAngles, map, x, y, r1, r2, color, angle, angle2, style;
        params = params || {};
        x = params.x || parseFloat(this.templateToCoordinate(this._$Xrow.val()));
        y = params.y || parseFloat(this.templateToCoordinate(this._$Yrow.val()));
        r2 = params.r2 || parseFloat((this._$RInnerRow.val()));
        r1 = params.r1 || parseFloat((this._$ROutterRow.val()));
        color = params.color || $('.gis-color-button.selected', this._$div).data('color') || (this.options.dataBinded && this.options.dataBinded.getColor());
        if (!params.angle && !params.angle2 && !this._rowChanged(this._$Angle1Row) && !this._rowChanged(this._$Angle2Row) &&
                (this._rowChanged(this._$DirectionRow) || this._rowChanged(this._$SolutionRow))) {
            directionalAngles = this._anglesByDirection();
            params.angle = directionalAngles[1];
            params.angle2 = -directionalAngles[0];
        }
        angle = params.angle !== undefined && $.isNumeric(params.angle) ? params.angle : parseFloat((this._$Angle1Row.val()));
        angle2 = -(params.angle2 !== undefined && $.isNumeric(params.angle2) ? params.angle2 : parseFloat((this._$Angle2Row.val())));

        angle2 = clearAngle(angle2);
        angle = clearAngle(angle);
        fillStyle = {color: this.getSelectedColor()};
        if (x && y && color && angle !== undefined && r1) {
            data = {
                innerRadius: r2,
                radius: r1,
                startAngle: angle2,
                finishAngle: angle,
                latitude: y,
                longitude: x,
                fill: fillStyle
            };
            if (!params.forceNew && this.options.dataBinded) {
                this.options.dataBinded.setData(data, null, params.notFireServerEvent);
            } else {
                style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('sector'));
                lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
                newLayer = Gis.sector(Gis.Util.extend({}, data, {draggable: true, selectable: true, line: lineStyle}));
                newLayer.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
                map = this._containerController.getUIAttached().getMap();
                newLayer.addTo(map);
                map.selectLayer(newLayer);
            }
            this._update();
        } else {
            this._updateState();
        }
    },
    _deleteKeyFire: function (e) {
        if ((e.srcElement || e.target).type !== 'text') {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить сектор?',
                callback: function () {
                    var binded = this.options.dataBinded;
                    this._containerController.getUIAttached().getMap().clearSelected();
                    this._containerController.getUIAttached().getMap().removeLayer(binded);
                },
                context: this,
                id: 'sector-remove-dialog'
            });
        }
    },
    _mapClicked: function (e) {
    },
    _deInitEvents: function () {
        var map = this._containerController.getUIAttached().getMap();
        $('.data-row input', this._$div).off({
            change: this._textRowChange,
            keyup: this._textRowChange
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        if (this.options.dataBinded) {
            this.options.dataBinded.off('change', this.updateData, this);
        }
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        $(document.body).off('keyup', this._KeyUpEscFunction);
        map.off('mouseup', this._onMouseUp, this);
        map.off('mousedown', this._onMouseDown, this);
        map.off('mousemove', this._onMouseMove, this);
        map.off('mouseout', this._onMouseOut, this);
        Gis.Widget.Propertys.prototype._deInitEvents.call(this);
    },
    _createEventFunctions: function () {
        var self = this;
        this._returnFunction = this._returnFunction || function () {
            self._saveData();
        };
        this._escFunction = this._escFunction || function () {
            self._finish();
        };
        this._deleteFunction = this._deleteFunction || function () {
            self._deleteKeyFire();
        };
        this._textRowChange = this._textRowChange || function (e) {
            self._updateState();
            e.stopPropagation();
        };
        this._textRowKeyPress = this._textRowKeyPress || function () {
            self._updateState();
        };
        this._revertFunction = this._revertFunction || function () {
            self.back();
        };
        this._deselectFunction = this._deselectFunction || function () {
            self._containerController.getUIAttached().getMap().unselectLayer(self.options.dataBinded);
        };
        this._KeyUpReturnFunction = this._KeyUpReturnFunction || this.generateEnteredFunction(self._deleteFunction);
        this._KeyUpEscFunction = this._KeyUpEscFunction || this.generateEskeyFunction(self._escFunction);
        this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || this.generateEnteredFunction(self._returnFunction);
        this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || this.generateEnteredFunction(self._deselectFunction);
        this._KeyUpRevertFunction = this._KeyUpRevertFunction || this.generateEnteredFunction(self._revertFunction);
    },
    _initEvents: function () {
        var map = this._containerController.getUIAttached().getMap();
        $(document.body).on('keyup', this._KeyUpEscFunction);
        $('.data-coll input, .data-row input', this._$div).on({
            change: this._textRowChange,
            keyup: this._textRowChange,
            keydown: this.keyPressPreventDefault
        });
        $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
            click: this._returnFunction,
            keyup: this._KeyUpReturnFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
            click: this._revertFunction,
            keyup: this._KeyUpRevertFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
            click: this._deselectFunction,
            keyup: this._KeyUpDeselectFunction
        });
        $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
            click: this._deleteFunction,
            keyup: this._KeyUpDeleteFunction
        });
        map.on('mouseup', this._onMouseUp, this);
        map.on('mousedown', this._onMouseDown, this);
        map.on('mousemove', this._onMouseMove, this);
        map.on('mouseout', this._onMouseOut, this);
        Gis.Widget.Propertys.prototype._initEvents.call(this);
    },
    _update: function () {
        this.updateData();
    },
    bindData: function (data) {
        if (!data && !this._cleared) {
            this._cleared = true;
        }
        if (data !== this.options.dataBinded) {
            this._deactivateAnglePath();
            this._newColor = undefined;
            if (this.options.dataBinded) {
                this.options.dataBinded.off('change', this.updateData, this);
            }
            if (data) {
                data.on('change', this.updateData, this);
            }
            Gis.Widget.Propertys.prototype.bindData.call(this, data);
            this.updateData();
        }
    }
});

Gis.Widget.SectorProperty.CLASS_NAME = "gis-widget-propertys-sector";
Gis.Widget.sectorProperty = function (data) {
    return new Gis.Widget.SectorProperty(data);
};
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
    includes: Gis.Widget.ZoomBehavior,
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
                map.setZoom(dataHistory.zoom);
                map.setCenter(dataHistory.center);
                this._setData(dataHistory.zoom, dataHistory.center);
            }
        } else {
            this._$Xrow.val(this._$Xrow.data('old-val'));
            this._$Yrow.val(this._$Yrow.data('old-val'));
            this._list.setValueSelected(map.getZoom());
            this._newZoom = map.getZoom();
        }
        this._updateButtonState();
    },
    _updateCenter: function () {
        var x, y, latlng, map;
        x = this.templateToCoordinate(this._$Xrow.val());
        y = this.templateToCoordinate(this._$Yrow.val());
        if (x && y) {
            latlng =  Gis.latLng(y, x);
            this._$Xrow.data('old-val', x);
            this._$Yrow.data('old-val', y);
            map = this._containerController.getUIAttached().getMap();
            this._updateHistory({center: map.getCenter(), zoom: map.getZoom()});
            map.setCenter(latlng);
            if (this._newZoom !== undefined) {
                map.setZoom(this._newZoom);
            }
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
        center = center || this._containerController.getUIAttached().getMap().getCenter();
        zoom = zoom || this._containerController.getUIAttached().getMap().getZoom();
        this._newZoom = zoom;
        this._list.setValueSelected(zoom);
        this._setValue(this._$Xrow, this.coordinateToTemplate(center.lng, true));
        this._setValue(this._$Yrow, this.coordinateToTemplate(center.lat));
    },
    updateData: function () {
        this._setData();
        this._updateButtonState();
    },
    initHTML: function () {
        var defZoom;
        Gis.Widget.Propertys.prototype.initHTML.call(this);
        this._$div.addClass(Gis.Widget.ZoomProperty.CLASS_NAME);
        this._$Xrow = $('#zoom-x', this._$div);
        this._$Yrow = $('#zoom-y', this._$div);
        defZoom = this.getConvertedZoom();
        this._list = Gis.HTML.listView({
            data: this._getZoomValues(),
            container: $('#zoom-selector', this._$div)[0],
            callback: this.zoomSelected,
            context: this,
            defaultValue: {val: this._containerController.getUIAttached().getMap().getZoom(), name: defZoom}
        });
    },
    initDataBlock: function () {
        var center = this._containerController.getUIAttached().getMap().getCenter(),
            longitude = this.coordinateToTemplate(center.lng, true),
            latitude = this.coordinateToTemplate(center.lat);
        return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
            "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Текущие координаты центра</div>\n" +
            "<div id='center-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
            "<ul>\n" +
            "<li class='data-row'><span>X</span><input type='text' data-old-val='" + longitude + "' id='zoom-x' class='zoom-input' value='" + longitude + "'/></li>\n" +
            "<li class='data-row'><span>Y</span><input type='text' data-old-val='" + latitude + "' id='zoom-y' class='zoom-input' value='" + latitude + "'/></li>\n" +
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
    _isStateChanged: function () {
        var xRowChanged, yRowChanged, changed;
        xRowChanged = this._rowChanged(this._$Xrow);
        yRowChanged = this._rowChanged(this._$Yrow);
        changed = (xRowChanged || yRowChanged) ?  Gis.Widget.ZoomProperty.CENTER_CHANGED : Gis.Widget.ZoomProperty.NOT_CHANGED;
        changed = this._containerController.getUIAttached().getMap().getZoom() !== this._newZoom ?
                changed ? Gis.Widget.ZoomProperty.BOTH_CHANGED : Gis.Widget.ZoomProperty.ZOOM_CHANGED :
                changed;
        return changed;
    },
    _updateButtonState: function () {
        var isStateChanged = this._isStateChanged();
        if (!this._history.length && !isStateChanged) {
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).attr('disabled', 'disabled');
        } else {
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).removeAttr('disabled');
        }
        if (isStateChanged) {
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).removeAttr('disabled');
        } else {
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).attr('disabled', 'disabled');
        }
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
        this._containerController.getUIAttached().getMap().off('zoomend moveend', this._update, this);
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
        var self = this;
        this._updateStateFunc = this._updateStateFunc || function () {
            self._updateCenter();
        };
        this._inputChange = this._inputChange || function () {
            self._updateButtonState();
        };
        this._revertFunc = this._revertFunc || function () {
            self.back();
        };
        this._keyupUpdateFunction = this._keyupUpdateFunction || function (e) {
            var returnKeyCode = 13;
            if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                self._updateStateFunc();
            } else {
                self._updateButtonState();
            }
            e.stopPropagation();
        };
        this._keyupRevertFunction = this._keyupRevertFunction || function (e) {
            var returnKeyCode = 13;
            if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                self.back();
            }
        };
        this._containerController.getUIAttached().getMap().on('zoomend moveend', this.updateData, this);
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
"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.PolylineProperty
 */
Gis.Widget.PathProperty = Gis.Widget.PolylineProperty.extend(
    /**
     * @lends Gis.Widget.PathProperty.prototype
     */
    {
    _type: 'path',
    _removePolyline: function (e) {
        var layer = e.target;
        layer.off('remove', this._removePolyline, this);
    },

    _clearPolyline: function () {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить маршрут?',
            callback: function () {
                this._containerController.getUIAttached().getMap().removeLayer(this.options.dataBinded);
            },
            context: this,
            id: 'path-remove-dialog'
        });
    },
    _calculatePointData: function (row1, row2) {
        var point1, point2, distance = 0;
        if (row1) {
            point1 = Gis.latLng(this.templateToCoordinate($('.marker-y', $(row1)).val()), this.templateToCoordinate($('.marker-x', $(row1)).val()));
            this._pointsLatlng.push(point1);
            if (row2) {
                point2 = Gis.latLng(this.templateToCoordinate($('.marker-y', $(row2)).val()), this.templateToCoordinate($('.marker-x', $(row2)).val()));
                distance = point1.distanceTo(point2);
            }
        }
        return distance;
    },
    _drawPolyline: function () {
        var lineStyle, style;
        style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('path'));
        lineStyle = {color: this.getSelectedColor(), border: style.border, thickness: style.thickness};
        if (!this.options.dataBinded) {
            this.options.dataBinded = Gis.path(Gis.Util.extend({line: lineStyle, draggable: true, selectable: true, icon: style.icon}, this.options.dataBindedPoints));
            this.options.dataBinded.setCourseEnable(true);
            this.options.dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
        } else {
            this.options.dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
            this.options.dataBinded.setData(Gis.Util.extend({}, {line: lineStyle}, this.options.dataBindedPoints));
        }
        if (!this._containerController.getUIAttached().getMap().hasLayer(this.options.dataBinded)) {
            this.options.dataBinded.addTo(this._containerController.getUIAttached().getMap());
            this._containerController.getUIAttached().getMap().selectLayer(this.options.dataBinded);
        }
        this._initPolylineEvents();
    },
    _calculatePolyline: function (skipPolylineRedraw) {
        var $rows, self;
        self = this;
        if (!this._hilightErrors()) {
            $rows = $('#points-selector li', this._$div);
            this._distanceCalculated = 0;
            this._pointsLatlng = [];
            this.options.dataBindedPoints = {latitudes: [], longitudes: []};
            $rows.each(function (position) {
                var $nextRow, $markerY = $('.marker-y', $(this)), $markerX = $('.marker-x', $(this));
                $nextRow = $rows[position + 1];
                self._setValue($markerX, $markerX.val());
                self._setValue($markerY, $markerY.val());
                self.options.dataBindedPoints.latitudes.push(self.templateToCoordinate($markerY.val()));
                self.options.dataBindedPoints.longitudes.push(self.templateToCoordinate($markerX.val()));
                self._distanceCalculated += self._calculatePointData($(this), $nextRow);
            });
            self._moving = self._calculatePointData($($rows[0]), $($rows[$rows.length - 1]), true);
            if (!skipPolylineRedraw) {
                this._drawPolyline();
            }
            this._updateHistory();
        } else {
            self._distanceCalculated = 0;
            self._moving = 0;
        }
        this._drawResultCalculation();
        this._updateState();
    },
    _deInitEvents: function () {
        Gis.Widget.PolylineProperty.prototype._deInitEvents.call(this);
        if (this.options.dataBinded) {
            this.options.dataBinded.on('remove', this._removePolyline, this);
        }
    },
    _initEvents: function () {
        if (this.options.dataBinded) {
            this.options.dataBinded.off('remove', this._removePolyline, this);
        }
        Gis.Widget.PolylineProperty.prototype._initEvents.call(this);
    }
});

Gis.Widget.pathProperty = function (data) {
    return new Gis.Widget.PathProperty(data);
};
"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.PolylineProperty
 */
Gis.Widget.PolygonProperty = Gis.Widget.PolylineProperty.extend(
    /**
     * @lends Gis.Widget.PolygonProperty.prototype
     */
    {
    _type: 'polygon',
    _minimalPoints: 3,

    _clearPolyline: function () {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить многоугольник?',
            callback: function () {
                this._containerController.getUIAttached().getMap().removeLayer(this.options.dataBinded);
            },
            context: this,
            id: 'polygon-remove-dialog'
        });
    },
    _drawPolyline: function () {
        var lineStyle, fillStyle, style;
        style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('polygon'));
        lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
        fillStyle = {color: this.getSelectedColor()};
        if (!this.options.dataBinded) {
            this.options.dataBinded = Gis.polygon(Gis.Util.extend({fill: fillStyle, line: lineStyle, draggable: true, selectable: true, icon: style.icon}, this.options.dataBindedPoints));
            this.options.dataBinded._gis_widget_markers = [];
            this.options.dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
        } else {
            this.options.dataBinded.setSelectedStyle(Gis.Util.extend({},
                {color: this.options.dataBinded.getLineColor(), border: style.selectedBorder, thickness: lineStyle.thickness}));
            this.options.dataBinded.setData(Gis.Util.extend({}, {fill: fillStyle}, this.options.dataBindedPoints));
        }
        if (!this._containerController.getUIAttached().getMap().hasLayer(this.options.dataBinded)) {
            this.options.dataBinded.addTo(this._containerController.getUIAttached().getMap());
            this._containerController.getUIAttached().getMap().selectLayer(this.options.dataBinded);
        }
        this._initPolylineEvents();
    }
});

Gis.Widget.polygonProperty = function (data) {
    return new Gis.Widget.PolygonProperty(data);
};