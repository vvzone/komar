(function () {
    "use strict";
    var buttons;

    buttons = {
        select: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-select', title: 'Выбрать объект', action: Gis.UI.Action.select(ui)});
        },
        move: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-move', title: 'Переместить карту', action: Gis.UI.Action.move(ui)});
        },
        zoom: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-zoom', title: 'Масштабировать карту', action: Gis.UI.Action.zoom(ui)});
        },
        measure: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-measure', title: 'Измерить', action: Gis.UI.Action.measure(ui)});
        },
        layers: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-layers', title: 'Настроить слои объектов', action: Gis.UI.Action.layers(ui)});
        },
        relief: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-relief hide', title: 'Линейный рельеф', action: Gis.UI.Action.relief(ui)});
        },
        visibility: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-visibility hide', title: 'Область видимости', action: Gis.UI.Action.visibility(ui)});
        },
        'areal-relief': function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-areal-relief hide', title: 'Площадной рельеф', action: Gis.UI.Action['areal-relief'](ui)});
        },
        geo: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-geo', title: 'Геокодирование', action: Gis.UI.Action.geo(ui)});
        },
        'geo-path': function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-geo-path', title: 'Построение маршрутов', action: Gis.UI.Action['geo-path'](ui)});
        },
        marker: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-marker', title: 'Добавить/редактировать маркер', action: Gis.UI.Action.marker(ui)});
        },
        object: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-object', title: 'Добавить/редактировать объект', action: Gis.UI.Action.object(ui)});
        },
        path: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-path', title: 'Добавить/редактировать путь', action: Gis.UI.Action.path(ui)});
        },
        polygon: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-polygon', title: 'Добавить/редактировать полигон', action: Gis.UI.Action.polygon(ui)});
        },
        ellipse: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-ellipse', title: 'Добавить/редактировать эллипс', action: Gis.UI.Action.ellipse(ui)});
        },
        sector: function (ui) {
            return new Gis.Widget.Button({tag: 'li', className: 'gis-instruments-button-sector', title: 'Добавить/редактировать сектор', action: Gis.UI.Action.sector(ui)});
        }
    };
    var timeout;
    function hideSubMenu() {
        var $show = $('.show-submenu');
        $show.off('click', 'li', mouseRelesed);
        $show.removeClass('show-submenu');
        $(document.body).off('click', hideSubMenu);
    }

    function mouseRelesed(e) {
        $('.show-submenu').off('click', 'li', mouseRelesed);
        $(this.parentNode).off('click', 'li', mouseRelesedFalse);
        $(this.parentNode).off('click', 'li', mouseRelesed);
        if (timeout) {
            clearTimeout(timeout);
        } else {
            if (!Gis.UI.Action.DO_NOT_EXECUTE_ONCE) {
                $(this).trigger('click');
            }
            return false;
        }
    }
    function mouseRelesedFalse(e) {
        Gis.UI.Action.DO_NOT_EXECUTE_ONCE = false;
        $(this.parentNode).off('click', 'li', mouseRelesedFalse);
        $(this.parentNode).off('click', 'li', mouseRelesed);
        return false;

    }
    function initLongPressSubMenu(htmlButton) {

        function showSubMenu() {
            timeout = false;
            Gis.UI.Action.DO_NOT_EXECUTE_ONCE = true;
            $(htmlButton).on('click', 'li', mouseRelesedFalse);
            $(document.body).on('click', hideSubMenu);
            htmlButton.classList.add('show-submenu');
        }

        function mousePressed(e) {
            $(htmlButton).on('click', 'li', mouseRelesed);
            if (e.altKey || (e.offsetX > 10 && e.offsetY > 13)) {
                if (!$('.show-submenu').length) {
                    $(this).off('click', 'li', mouseRelesedFalse);
                    showSubMenu();
                    return false;
                }
            } else {
                timeout = setTimeout(showSubMenu, 500);
            }
        }


        $(htmlButton).on('mousedown', 'li:first-child', mousePressed);
    }
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
             * @property {Array.<string>} [instruments='select move zoom measure layers relief separator marker object path polygon ellipse sector'] активные кнопки
             */
            options: {
                instruments: ['select',
                    'move',
                    'zoom',
                    'measure',
                    'layers',
                    ['relief',
                        'areal-relief'],
                    'visibility',
                    'geo',
                    'geo-path',
                    'separator',
                    'marker',
                    'object',
                    'path',
                    'polygon',
                    'ellipse',
                    'sector'],
                position: "left",
                enabled: true
            },
            initialize: function () {
                Gis.Widget.Base.prototype.initialize.apply(this, arguments);
                Gis.Widget.Instruments.instance = this;
            },
            _newActionExecuted: function (event) {
                var id, actionExecuted, actionId;
                hideSubMenu();
                actionExecuted = event.action;
                actionId = actionExecuted.getId();
                for (id in this._buttons) {
                    if (this._buttons.hasOwnProperty(id) && this._buttons[id].getId() !== actionId) {
                        this._buttons[id].getAction().closeAction();
                    }
                }
            },
            getNeedSize: function () {
                var height = 0;
                $('>li', $(this._list)).each(function () {
                    height += $(this).outerHeight(true);
                });
                return [$(this._list).outerWidth(true), height + this._$div.outerHeight(true) - this._$div.height()]
            },
            createButton: function (data, container) {
                var button = data.getAction ? data : new Gis.Widget.Button({tag: 'li', className: data.className, title: data.title, action: Gis.UI.Action.custom(this._containerController.getUIAttached())});
                button.getAction().on('newactionexecuted', this._newActionExecuted, this);
                this._buttons[button.getId()] = button;
                var button2 = button.getButton(this._list);
                return {button: button, htmlButton: button2};
            },
            /**
             * Добавить кнопку к инструментам
             * @param data
             * @returns {*}
             */
            addButton: function (data, container) {
                var __ret = this.createButton(data, container);
                var gisButton = __ret.button;
                var htmlButton = __ret.htmlButton;
                (container || this._list).appendChild(htmlButton);
                if (!container && this._buttonSumbenu) {
                    $(htmlButton).insertBefore(this._buttonSumbenu);
                } else {
                    (container || this._list).appendChild(htmlButton);
                }
                return gisButton;
            },
            addSingleButton: function (value, availableButtons, firstAction, subbattons, container) {
                var button, liTemp, ulTemp, ulTemp2, __ret, gisButton;
                if ((!value && subbattons) || (this.isControlAvailable(value) && availableButtons.hasOwnProperty(value) && Gis.UI.ActionController.getAction(value))) {
                    if (subbattons) {
                        ulTemp = document.createElement('ul');
                        ulTemp2 = document.createElement('ul');
                        __ret = this.addSingleButton(subbattons[0], availableButtons, null, null, ulTemp);
                        for (var i = 0, len = subbattons.length; i < len; i += 1) {
                            __ret = this.addSingleButton(subbattons[i], availableButtons, null, null, ulTemp2);
                        }
                        ulTemp.classList.add('with-childs');
                        liTemp = document.createElement('li');
                        liTemp.appendChild(ulTemp2);
                        ulTemp.appendChild(liTemp);
                        liTemp = document.createElement('li');
                        liTemp.appendChild(ulTemp);
                        this._list.appendChild(liTemp);
                        initLongPressSubMenu(ulTemp);
                    } else {
                        button = availableButtons[value](this._containerController.getUIAttached());
                        gisButton = this.addButton(button, container);
                        if (container) {
                            gisButton.getAction().on('newactionexecuted', function () {
                                var $button = $(this);
                                var $first = $('>:first-child', $($button.parents('.with-childs')[0]));
                                if ($first[0].className !== $button[0].className) {
                                    $first[0].className = $button[0].className;
                                }
                            }, gisButton.getButton());
                        }
                    }
                    firstAction = firstAction || value;
                }
                if (value === 'separator') {
                    liTemp = document.createElement('li');
                    liTemp.className = Gis.Widget.Button.BUTTON_CLASS_NAME + ' gis-instruments-button-separator';
                    this._list.appendChild(liTemp);
                }
                return firstAction;
            },
            onAdd: function (container) {
                var self, instruments, availableButtons, liTemp, button, firstAction;
                Gis.Widget.Base.prototype.onAdd.call(this, container);
                self = this;
                instruments = this.options.instruments;
                availableButtons = buttons;
                instruments.forEach(function (value) {
                    if (Gis.Util.isArray(value)) {
                        firstAction = self.addSingleButton(null, availableButtons, firstAction, value);
                    } else {
                        firstAction = self.addSingleButton(value, availableButtons, firstAction);
                    }
                });

                liTemp = document.createElement('li');
                var tempSpan = document.createElement('span');
                liTemp.appendChild(tempSpan);
                liTemp.className = Gis.Widget.Button.BUTTON_CLASS_NAME + ' gis-instruments-button-submenu';
                tempSpan.title = 'Дополнительные действия';
                self._list.appendChild(liTemp);

                this._buttonSumbenu = $(liTemp);
                this.draw();
                firstAction = firstAction || Gis.UI.ActionController.getFirstAction();
                if (firstAction) {
                    Gis.UI.ActionController.getAction(firstAction).execute();
                }
                this.afterUpdate();
            },
            mapListChanged: function () {
                var map = this._containerController.getUIAttached().getMap(),
                    method = (map.getFirstTMS() ? 'removeClass' : 'addClass');
                $('.gis-instruments-button-relief', this._list)[ method]('hide');
                $('.gis-instruments-button-visibility', this._list)[method]('hide');
                $('.gis-instruments-button-areal-relief', this._list)[method]('hide');
            },
            _deInitEvents: function () {
                this._containerController.getUIAttached().off('sizerecalculated', this.setWidth, this);
                this._containerController.getUIAttached().getMap().off('maplistchanged', this.mapListChanged, this);
                $(this._list).off('click', '.gis-instruments-button-submenu', this._subMenuClick);
                $(document.body).off('click', this._bodyClick);
                this._$div.tooltip('destroy');
            },
            _initEvents: function () {
                var self = this;
                this._containerController.getUIAttached().on('sizerecalculated', this.setWidth, this);
                this._containerController.getUIAttached().getMap().on('maplistchanged', this.mapListChanged, this);
                this._subMenuClick = function () {
                    self._$menuContainer.toggleClass('show');
                    self._buttonSumbenu[self._$menuContainer.hasClass('show') ? 'addClass' : 'removeClass']('selected');
                    return false;
                };
                this._bodyClick = function () {
                    self._$menuContainer.removeClass('show');
                    self._buttonSumbenu.removeClass('selected');
                };
                $(this._list).on('click', '.gis-instruments-button-submenu', this._subMenuClick);
                $(document.body).on('click', this._bodyClick);
                this._$div.tooltip({
                    items: ".gis-instruments-button > span[title]",
                    track: true
                });
            },
            setWidth: function () {
                var self = this,
                    height = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height,
                    $listElements,
                    liHeight,
                    current,
                    $menu = this._$menu,
                    i,
                    len,
                    $firstInHide;
                this._$div.css({
                    width: this._containerController.getWidth(),
                    height: height
                });
                var list = this._list;
                height = $(list).height();
                if (list) {
                    var $hidedElements = $('li', $menu);
                    var countHidedElements = $hidedElements.length;
                    if (countHidedElements) {
                        $firstInHide = $hidedElements[0];
                    }

                    $listElements = Array.prototype.slice.call($('>li', list).not(self._buttonSumbenu));
                    liHeight = $($listElements[0]).outerHeight(true);
                    current = liHeight;
                    var appendAll = false;
                    for (i = 0, len = $listElements.length; i < len; i += 1) {
                        current += liHeight;
                        if (appendAll || ((height - current) < 0)) {
                            appendAll = true;
                            if ($firstInHide) {
                                $($listElements[i]).insertBefore($firstInHide);
                            } else {
                                $menu.append($listElements[i]);
                            }
                        }
                    }
                    current = liHeight * $('li', list).length - 1;
                    $hidedElements = Array.prototype.slice.call($('li', $menu));
                    countHidedElements = $hidedElements.length;
                    var needSpace;
                    if (!appendAll && countHidedElements) {
                        if (height - current > liHeight) {
                            for (i = 0, len = $hidedElements.length; i < len; i += 1) {
                                needSpace = ((countHidedElements - i) === 1) ? 0 : liHeight;
                                if ((height - current) >= needSpace) {
                                    $($hidedElements[i]).insertBefore(this._buttonSumbenu);
                                }
                                current += liHeight;
                            }
                        }
                    }
                    var $liHided = $('li', $menu);
                    if ($liHided.length) {
                        this._$menuContainer.css({
                            width: $($liHided[0]).outerWidth(true) * Math.ceil($liHided.length * liHeight / $menu.height())
                        });
                        this._buttonSumbenu.addClass('show');
                    } else {
                        this._buttonSumbenu.removeClass('show');
                        this._bodyClick();
                    }
                }
            },
            initHTML: function () {
                Gis.Widget.Base.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.Instruments.CLASS_NAME);
                this.setWidth();
                this._list = document.createElement('ul');
                this._list.className = "instruments-list";
                this._$div[0].appendChild(this._list);
                this._$menuContainer = $('<div class="instruments-submenu-container"><ul class="instruments-submenu"></ul></div>');
                this._$div.append(this._$menuContainer);
                this._$menu = $('ul', this._$menuContainer);
            },
            draw: function () {
                Gis.Widget.Base.prototype.draw.call(this);
            },
            afterUpdate: function () {
                Gis.Widget.Base.prototype.afterUpdate.call(this);
                this.mapListChanged();
            }
        });

    Gis.Widget.Instruments.CLASS_NAME = 'gis-widget-instruments';
    Gis.Widget.instruments = function (data) {
        return Gis.Widget.Instruments.instance || new Gis.Widget.Instruments(data);
    };

}());