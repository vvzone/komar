(function () {
    'use strict';
    var contextMenuElements = {};
    /**
     *
     * @namespace Gis.Objects
     */
    Gis.Objects = Gis.Objects || {};

    /**
     * @abstract
     * @class
     * @classdesc
     * Base class for all map objects
     * @param {Object} options
     * @param {string} [options.parentId] GUID родителя
     * @param {boolean} [options.forcePaint=false] игнорировать фильтр слоев
     * @param {string} [options.tacticObjectType] тип как правило уже указан в классах
     * @param {string} [options.name] имя. выводится в топосхеме
     * @param {string} [options.caption] подпись
     * @param {string} [options.caption] всплывающая подсказка
     * @param {string[]} [options.customActions] дополнительные действия. будут в контекстном меню
     * @extends Gis.BaseClass
     */
    Gis.Objects.Base = Gis.BaseClass.extend(
        /** @lends Gis.Objects.Base# */
        {
            _isControllableByServer: 1,
            _isControllable: true,
            _isCountable: true,

            _isMetaData: false,
            /**
             * Для лифлет
             * @ignore
             */
            _isCached: false,
            /**
             * Для Gis
             * @ignore
             */
            _isCachedGis: false,
            options: {
                tacticObjectType: 'base',
                parentId: undefined,
                forcePaint: undefined,
                customActions: undefined,
                name: undefined,
                caption: undefined,
                tooltip: undefined
            },
            /**
             * Содержит ли объект метаданные (как-то пеленги, позицияя) или сам является метаданными
             * @returns {boolean}
             */
            isMetaData: function () {
                return this._isMetaData;
            },
            /**
             * Начальная точка
             * @returns {Array.<number>}
             */
            getStartPoint: function () {
                return this.getCenter();
            },
            /**
             * Отправить на перерисовку
             * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
             */
            redraw: function () {
                this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE, new Gis.Objects.Base.NEED_REDRAW_EVENT(this));
            },
            /**
             * Очистить мета-данные
             * @ignore
             */
            clearMeta: function () {
                Gis.extendError();
            },
            /**
             * @ignore
             */
            hideMeta: function () {
                Gis.extendError();
            },
            /**
             *  Вызывается перед добавлением объекта.
             * @param {Gis.Map} map
             * @returns {boolean} нужно или нет добавлять
             */
            preAdd: function (map) {
                return true;
            },
            /**
             * Описательное имя объекта
             * @param tacticObjectType
             * @return {*|string}
             */
            getTypeName: function (tacticObjectType) {
                tacticObjectType = tacticObjectType || this.getType();
                return (Gis.Objects.Base.TYPE_NAMES[tacticObjectType] || tacticObjectType);
            },

            /**
             * Имя объекта
             * @return {*}
             */
            getName: function () {
                return this.options.name;
            },
            /**
             * Получить GUID родителя, если объект нарисовн другим объектом
             * @returns {GUID}
             */
            getParentId: function () {
                return this.options.parentId;
            },
            /**
             * @ignore
             */
            initialize: function (data) {
                this._contextMenuElements = {};
                this._originalType = this.options.tacticObjectType;
                if (data && data.hasOwnProperty('tacticObjectType')) {
                    data.tacticObjectType = data.tacticObjectType.toLocaleLowerCase();
                }
                Gis.BaseClass.prototype.initialize.call(this, data);
            },
            /**
             * возвращает список кастомных действий
             * @returns {Array}
             */
            getCustomActions: function () {
                return this.options.customActions && this.options.customActions.slice();
            },
            /**
             *
             * @param {string} action
             * @returns {boolean}
             */
            hasCustomAction: function (action) {
                return this.options.customActions && this.options.customActions.indexOf(action) > -1;
            },
            /**
             * Выполнить дополнительное действие
             * @param action
             * @fires Gis.Objects.Base#customaction
             */
            fireCustomAction: function (action) {
                if (this.hasCustomAction(action)) {
                    this.fire('customaction', {target: this, action: action});
                } else {
                    Gis.EventBus.fire('contextmenu', {target: this, action: action});
                }
                return this;
            },
            /**
             * Получить описательную строку по параметру оъекта
             * @param title
             * @param value
             * @ignore
             * @protected
             */
            _getFormatedRow: function (title, value) {
                if (value && title) {
                    return '<p><span class="desc-title">' + title + ': </span><span>' + value + '</span></p>';
                }
                return '';
            },
            /**
             * Получить описание объекта
             * @returns {string|object} строка html
             */
            getFormatedDescription: function () {
                if (this.options.tooltip) {
                    return this.options.tooltip;
                }
                var html = "";
                html += this._getFormatedRow('Имя объекта', this.options.name);
                return html;
            },
            /**
             * Убрать связь с картой
             * @param [map]
             * @ignore
             * @private
             */
            detachFromMap: function (map) {
                this._attachedToMap = false;
                delete this._mapRender;
                delete this._lowLevelObject;
                return this;
            },
            /**
             * Выполнять ли какие либо действия с объектом
             * @ignore
             * @returns {boolean}
             */
            isThisEventable: function (event) {
                if (event && event.type === 'contextmenu') {
                    return true;
                }
                var parent = this.options.parentId && this._map.getLayer(this.options.parentId);
                return !!(this._map.isFilterable(this.options.tacticObjectType) || (parent && this._map.isFilterable(parent.getType())));
            },
            /**
             * Очистить данные предыдущие
             * @ignore
             * @protected
             */
            _clearData: function () {
                Gis.extend(this.options, {
                    parentId: undefined,
                    name: undefined,
                    caption: undefined,
                    tooltip: undefined
                });
            },
            /**
             * Очистить и закешировать
             * @ignore
             * @public
             */
            pushToCache: function () {
                this._clearData();
                Gis.ObjectFactory.cache(this);
            },
            /**
             * Проброс событий от провайдера выше по цепочке
             * @param event
             * @ignore
             * @private
             */
            fireEventsFromLowLevel: function (event) {
                if (this.isThisEventable(event)) {
                    this.fire(event.type, event);
                } else {
//                this._map.fire(event.type, event);
                }
                return this;
            },
            /**
             * Добавить слой к карте
             * @param {Gis.Map} gis
             * @returns {Gis.Objects.Base}
             */
            addTo: function (gis) {
                gis.addLayer(this);
                return this;
            },
            /**
             * Связать с картой
             * @private
             * @param {Gis.Map} map
             * @returns {Gis.Objects.Base}
             */
            attachToMap: function (map) {
                /**
                 *
                 * @type {Gis.Map}
                 * @protected
                 * @ignore
                 */
                this._map = map;
                this._attachedToMap = true;
                return this;
            },
            getAdditionalActionsList: function () {
                return Gis.Util.createMenuList(Gis.extend({}, Gis.Objects.Base.getGlobalContextMenuElements(), this.getContextMenuElements(), {
                    'Дополнительные действия': this.getCustomActions()
                }));
            },
            getContextMenuElements: function () {
                return Gis.extend({}, this._contextMenuElements);
            },
            addContextMenuElement: function (key, val) {
                this._contextMenuElements[key] = val;
            },
            removeContextMenuElement: function (key) {
                delete this._contextMenuElements[key];
            },
            /**
             *
             * @ignore
             * @private
             */
            _actionChangedOnMenuShown: function () {
                if (this._additionalActionsList) {
                    this._additionalActionsList.innerHTML = this.getAdditionalActionsList().innerHTML;
                    this.setMenuStyle();
                }
            },
            /**
             *
             * @ignore
             * @param additionalActionsList
             * @private
             */
            _deInitMenuEvents: function (additionalActionsList) {
                if (Modernizr.touch) {
                    document.body.removeEventListener('touch', this._onContextMenuClose);
                    additionalActionsList.removeEventListener('touch', this._onContextMenuSelect);
                } else {
                    document.body.removeEventListener('click', this._onContextMenuClose);
                    additionalActionsList.removeEventListener('click', this._onContextMenuSelect);
                }
                document.body.removeEventListener('contextmenu', this._onContextMenuClose);
                this.off('change', this._actionChangedOnMenuShown, this);
                ((this._map && this._map.getMapContainer()) || additionalActionsList.parentNode).removeEventListener('contextmenu', this._onContextMenuClose);
            },
            /**
             *
             * @ignore
             */
            closeContextMenu: function () {
                if (this._additionalActionsList) {
                    this._deInitMenuEvents(this._additionalActionsList);
                    this._additionalActionsList.parentNode.removeChild(this._additionalActionsList);
                    this._additionalActionsList = null;
                }
            },
            /**
             *
             * @ignore
             * @param additionalActionsList
             * @private
             */
            _initMenuEvent: function (additionalActionsList) {
                var self = this;
                this._onContextMenuClose = this._onContextMenuClose || function () {
                    self.closeContextMenu();
                };
                this._onContextMenuSelect = this._onContextMenuSelect || function (event) {
                    var target = event.target || event.srcElement;
                    self.closeContextMenu();
                    self.fireCustomAction(target.parentNode.attributes['data-action'].value);
                    event.preventDefault();
                    event.stopPropagation();
                };
                if (Modernizr.touch) {
                    document.body.addEventListener('touch', this._onContextMenuClose);
                    additionalActionsList.addEventListener('touch', this._onContextMenuSelect);
                } else {
                    document.body.addEventListener('click', this._onContextMenuClose);
                    additionalActionsList.addEventListener('click', this._onContextMenuSelect);
                }
                this.on('change', this._actionChangedOnMenuShown, this);
                document.body.addEventListener('contextmenu', this._onContextMenuClose);
                ((this._map && this._map.getMapContainer()) || additionalActionsList.parentNode).addEventListener('contextmenu', this._onContextMenuClose);
            },
            /**
             *
             * @ignore
             * @param left
             * @param top
             */
            setMenuStyle: function (left, top) {
                var domUtil = Gis.DomUtil,
                    clientWidth = document.width,
                    clientHeight = document.height,
                    listHeight,
                    listWidth,
                    position = (!left || !top) && domUtil.getPosition(this._additionalActionsList);

                if (this._additionalActionsList) {
                    left = left || position.left;
                    top = top || position.top;
                    listHeight = this._additionalActionsList.clientHeight;
                    listWidth = this._additionalActionsList.clientWidth;
                    if (listHeight > clientHeight) {
                        listHeight = clientHeight;
                        this._additionalActionsList.style.height = clientHeight + 'px';
                    }
                    if (listWidth > clientWidth) {
                        listWidth = clientWidth;
                        this._additionalActionsList.style.width = clientWidth + 'px';
                    }
                    if ((left + listWidth) > clientWidth) {
                        left = clientWidth - listWidth;
                    }
                    if ((top + listHeight) > clientHeight) {
                        top = clientHeight - listHeight;
                    }
                    if (domUtil.isCssTransform()) {
                        this._additionalActionsList.style[domUtil.prefixes('transform')] = domUtil.isCssTransform3d() ?
                            'translate3d(' + left + 'px, ' + top + 'px, 0)' :
                            'translate(' + left + 'px, ' + top + 'px)';
                    } else {
                        this._additionalActionsList.style.top = top + 'px';
                        this._additionalActionsList.style.left = left + 'px';
                    }
                }
            },
            /**
             *
             * @ignore
             * @param e
             */
            onContextMenu: function (e) {
                var originalEvent = e.originalEvent;
                this.closeContextMenu();
                this._additionalActionsList = this.getAdditionalActionsList();
                if (this._additionalActionsList) {
                    this._initMenuEvent(this._additionalActionsList);
                    this._map.getMapContainer().appendChild(this._additionalActionsList);
                    this.setMenuStyle(originalEvent.clientX, originalEvent.clientY);
                    Gis.DomUtil.attachValue(this._additionalActionsList,'left', originalEvent.clientX);
                    Gis.DomUtil.attachValue(this._additionalActionsList,'top', originalEvent.clientY);
                    originalEvent.preventDefault();
                    originalEvent.stopPropagation();
                }
            },
            /**
             * Метод вызывается автоматически при добавлении на карту
             * @protected
             * @param {Gis.Map} map
             * @fires Gis.Objects.Base#added
             */
            onAdd: function (map) {
                this.attachToMap(map);
                this.setTag(Gis.Objects.Base.CREATOR_TAG_NAME, map.getSetting('creator'));
//            map.on('closed', this.reinit, this);
                this.on('remove', this.onDelete, this);
                this.on('contextmenu', this.onContextMenu, this);
                this.fire('added', {target: this});
                return this;
            },
            /**
             * Список слоев, занимаемых объектом
             * @returns {Array.<string>}
             */
            getLayers: function () {
                return this.getTag('layers');
            },
            /**
             * Метод выполняется автоматически при удалении
             * @param e
             * @fires Gis.Objects.Base#deleted
             * @private
             */
            onDelete: function (e) {
                if (this._map) {
//                this._map.off('closed', this.reinit, this);
                }
                this.closeContextMenu();
                this.off('remove', this.onDelete, this);
                this.off('contextmenu', this.onContextMenu, this);
                this.detachFromMap(e.from);
//            delete this._map;
                this.fire('deleted', {target: this});
                return this;
            },
            /**
             * Создан ли объект на клиенте
             * @returns {boolean}
             */
            isEditableByUser: function () {
                var map = this._map || Gis.Map.CURRENT_MAP;
                return this.getTag(Gis.Objects.Base.CREATOR_TAG_NAME) === map.getSetting('creator');
            },
            /**
             * Метод будет вызываться автоматически при смене провайдера карт
             * думаю не понадобится. смена провайдеров не лучший метод
             *
             * @ignore
             * @private
             */
            reinit: function () {
                this._lowLevelObject = false;
            },
            /**
             *  подключен ли объект к карте
             *  @private
             * @ignore
             * @returns {boolean}
             */
            isAttached: function () {
                return !!this._attachedToMap;
            },
            /**
             * Можно ли выполнять рисование
             * @protected
             * @returns {boolean}
             */
            preDraw: function () {
                return this.isAttached();
            },
            /**
             *
             * @returns {String} GUID
             */
            getId: function () {
                return this.options.id;
            },
            /**
             * @private
             * @ignore
             * @fires Gis.Objects.Base#change
             */
            _update: function () {
                this.fire('change', {target: this});
            },

            /**
             * функция рисования объекта
             * @public
             * @ignore
             * @param {Gis.Maps.Base} map объект обертка над нижним слоем карты
             * @param {Gis.ObjectVisibilityController} visibilityController
             * */
            draw: function (map, visibilityController) {
                this._pushedToRender = false;
                this._mapRender = map;
            },

            /**
             * кэшировать ли объект для последующего использования
             * @ignore
             * @public
             * */
            isCached: function () {
                return this._isCached;
            },
            /**
             * кэшировать ли объект для последующего использования в Gis
             * @ignore
             * @public
             * */
            isCachedGis: function () {
                return this._isCachedGis;
            },
            /**
             * Тип объекта// тип может отличаться от базового
             * @returns {string}
             */
            getType: function () {
                return this.options.tacticObjectType;
            },
            /**
             * Тип объекта// тип не может отличаться от базового
             * @returns {string}
             */
            getOriginalType: function () {
                return this._originalType;
            },
            /** Внимание!!! зависит от конкретной реализации карты, не делать прямых вызовов, использовать только для
             *  передачи в функцию рисования
             * @ignore
             *  @protected
             * @returns {Object} возвращает кэшированный объект рисования.
             * */
            getLowLevelObject: function () {
                return this._lowLevelObject;
            },
            setLowLevelObject: function (lo) {
                this._lowLevelObject = lo;
            },
            /**
             * returns array of lat and lng
             * @returns {Array} [latitude, longitude]
             * */
            getLatLng: function () {
                Gis.extendError();
            },
            /**
             * Управлять ли объектом из {@link Gis.ObjectController}
             * @returns {boolean}
             */
            isControllable: function () {
                return this._isControllable;
            },
            /**
             * Учитывать в счетчике объектов слоя
             * @returns {boolean}
             */
            isCountable: function () {
                return this._isCountable;
            },
            setCountable: function (contable) {
                this._isCountable = contable;
                return this;
            },
            /**
             * Уведомлять ли сервер о событиях с этим объектом
             * @returns {boolean}
             */
            isControllableByServer: function () {
                return this._isControllableByServer;
            },
            /**
             * Установить флаг работы с сервером
             * @param {boolean} controllable
             * @returns {Gis.Objects.Base}
             */
            setControllableByServer: function (controllable) {
                if (!this.isAttached()) {
                    this._isControllableByServer = controllable;
                }
                return this;
            },
            /**
             * returns array of lat and lng bounds
             * @returns {Gis.LatLngBounds}
             * */
            getLatLngBounds: function () {
                return Gis.latLngBounds(this.getLatLng(), this.getLatLng());
            },
            /**
             * возврващает координаты центральной точки
             * */
            getCenter: function () {
                return this.getLatLng();
            },
            /**
             * Объект выделяемый
             * @return {boolean}
             */
            isSelectable: function () {
                return false;
            },
            /**
             * returns array of lat and lng bounds (depends of zoom)
             * @returns {Gis.LatLngBounds}
             * */
            getCurrentLatLngBounds: function () {
                return this.getLatLngBounds();
            },
            /**
             * возвращает список типов объектов, рисованием которых он занимается, для них {@link Gis.ObjectController} ничего не будет делать
             * @private
             * */
            selfDraw: function () {
                return this._selfDraw;
            },
            /**
             * Отлючить рисование вложенного слоя
             * @private
             * @ignore
             * @param {string} val
             */
            disableDraw: function (val) {
                if (this._selfDraw) {
                    this._selfDraw[val] = false;
                }
            },
            /**
             * Включить рисование вложенного слоя
             * @private
             * @ignore
             * @param {string} val
             */
            enableDraw: function (val) {
                if (this._selfDraw) {
                    this._selfDraw[val] = true;
                }
            }
        }
    );
    /**
     * Добавить действие для всех объектов
     * @returns {Object} ассоциативный объект, где ключ это заголовок, значение это либо бросаемое действие, либо массив действий
     */
    Gis.Objects.Base.getGlobalContextMenuElements = function () {
        return Gis.extend({}, contextMenuElements);
    };
    /**
     *
     * @param key
     * @param val
     */
    Gis.Objects.Base.addGlobalContextMenuElement = function (key, val) {
        contextMenuElements[key] = val;
    };
    /**
     *
     * @param key
     */
    Gis.Objects.Base.removeGlobalContextMenuElement = function (key) {
        delete contextMenuElements[key];
    };
    Gis.Objects.Base.CREATOR_TAG_NAME = 'creator';
    /**
     * @class
     * @classdesc Событие добавления объекта
     * @event
     * @property {Gis.Objects.Base} target
     * @property {string} type Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE
     */
    Gis.Objects.Base.NEED_REDRAW_EVENT = function (target) {
        this.target = target;
        this.type = Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE;
    };
    Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE = 'needredraw';
    /**
     * @class
     * @classdesc Событие локального изменения. О таких событиях сервер не уведомляется
     * @event
     * @property {Gis.Objects.Base} target
     * @property {string} type Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE
     */
    Gis.Objects.Base.LOCAL_CHANGE_EVENT = function (target) {
        this.target = target;
        this.type = Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE;
    };
    Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE = 'localchange';

    /**
     * Объект не отображать в гуи и не слать на сервер
     * @type {boolean}
     */
    Gis.FULL_LOCAL = false;
    /**
     * Объект отображать в гуи но не слать на сервер
     * @type {number}
     */
    Gis.NETWORK_LOCAL = -1;
    Gis.Objects.Base.TYPE_NAMES = {
        overlay: 'Оверлей',
        source: 'Объект',
        post: 'Пост',
        ellipse: 'Элипс',
        path: 'Маршрут',
        polygon: 'Полигон',
        sector: 'Сектор',
        image: 'Иконка',
        text: 'Маркер'
    };
}());