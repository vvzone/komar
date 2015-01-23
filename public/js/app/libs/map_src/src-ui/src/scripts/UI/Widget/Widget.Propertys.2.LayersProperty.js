"use strict";
(function (){
    /**
     * @param {string} a
     * @param {string} b
     * @returns {number}
     * @function
     * @constant
     */
    var FUNCTION_COMPARATOR = function (a, b) {
            var blower = b.toLowerCase(), alower = a.toLowerCase();
            return alower > blower ? 1 : alower < blower ? -1 : 0;
        },
        /**
         * @constant
         */
            DATA_LAYER_KEY = 'layer',
            CHECKED_CLASS = 'checked',
            INVISIBLE_ROW_CLASS = 'invisible';
    /**
     * @extends Gis.Widget.Propertys
     * @class
     */
    Gis.Widget.LayersProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.LayersProperty.prototype
         */
        {
            options: {
                needCheckLayers: false
            },
            _type: 'layers',
            /**
             * @type {Gis.ObjectVisibilityController}
             * @private
             */
            _getVisibilityController: function () {
                if (!this._visibilityController) {
                    this._visibilityController = this._containerController.getUIAttached().getMap().getRenderer().getVisibilityController();
                }
                return this._visibilityController;
            },
            onAdd: function () {
                this._eventsChanged = [];
                this._eventsListChanged = {
                    added: [],
                    removed: []
                };
                Gis.Widget.Propertys.prototype.onAdd.apply(this, arguments);
                this._getVisibilityController();
            },
            _setData: function (text, center, color) {
                //todo reset data
            },
            updateData: function () {
                this._updateState();
            },
            draw: function () {
                Gis.Widget.Propertys.prototype.draw.call(this);
                this.updateData();
            },
            initHTML: function () {
                Gis.Widget.Propertys.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.LayersProperty.CLASS_NAME);
                this._$layerList = $('.layers-menu', this._$div);
                this.setSwitchContainer(this._$div, this._$layerList);

            },
            setBounds: function () {
                var maxHeight, heightContainer;
                heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
                maxHeight = heightContainer - Gis.Widget.Scheme.needHeight(heightContainer);
                maxHeight -= $('.gis-widget-propertys-data', this._$div).outerHeight(true) - $('.gis-widget-propertys-data', this._$div).height();
                $('.gis-widget-propertys-buttons-wraper', this._$div)
                    .each(function () {
                        maxHeight -= $(this).outerHeight(true);
                    });
                maxHeight -= this._$div.outerHeight(true) - this._$div.height();
                this._$layerList.css('maxHeight', maxHeight - $('#layers-title', this._$div).outerHeight(true));
            },
            /**
             *
             * @param {string} aLayer
             * @param {number} count
             * @returns {string}
             * @private
             */
            _constructLayerElement: function (aLayer, count) {
                var checkedClass = (this._getVisibilityController().isLayerVisible(aLayer) ? CHECKED_CLASS : '');
                return '<li data-' + DATA_LAYER_KEY + '="' + aLayer + '" class=' + (count < 1 ? INVISIBLE_ROW_CLASS : '') + '>' +
                    '<span class="checkbox ' + checkedClass + '"></span>' +
                    '<span class="name">' + (aLayer || Gis.ObjectVisibilityController.BASE_LAYER_NAME) + '</span><span class="count" data-count="' + count + '">' + count + '</span></li>';
            },
            _layersList: function () {
                var layers = this._getVisibilityController().getLayers(), i, len, buffer = '', aLayer, counts;
                if (layers) {
                    counts = this._calculateCountObjects();
                    layers.sort(FUNCTION_COMPARATOR);
                    for (i = 0, len = layers.length; i < len; i += 1) {
                        aLayer = layers[i];
                        buffer += this._constructLayerElement(aLayer, counts[aLayer]);
                    }
                }
                return buffer;
            },
            _mapClicked: function () {

            },
            /**
             * @param {Array.<Gis.Objects.Base>} [layers]
             * @returns {Object}
             * @private
             */
            _calculateCountObjects: function (layers) {
                var map = this._containerController.getUIAttached().getMap(),
                    i,
                    len,
                    i2,
                    len2,
                    /**
                     * @type {Gis.Objects.Base}
                     */
                        currentProcessingObject,
                    visibilityLayers,
                    result = {};
                layers = layers || map.getRenderer().getLayers();
                for (i = 0, len = layers.length; i < len; i += 1) {
                    currentProcessingObject = layers[i];
                    if (currentProcessingObject.isCountable()) {
                        visibilityLayers = this._visibilityController.getLayersFromObject(currentProcessingObject);
                        for (i2 = 0, len2 = visibilityLayers.length; i2 < len2; i2 += 1) {
                            if (!result[visibilityLayers[i2]]) {
                                result[visibilityLayers[i2]] = 0;
                            }
                            result[visibilityLayers[i2]] += 1;
                        }
                    }
                }
                return result;
            },
            /**
             *
             * @param {string} layerName
             * @returns {jQuery}
             * @private
             */
            _getExistsRow: function (layerName) {
                return $('[data-layer="' + layerName + '"]', this._$layerList);
            },
            /**
             * @param {string} elementToRemove
             * @private
             */
            _removeRow: function (elementToRemove) {
                this._getExistsRow(elementToRemove).remove();
            },
            /**
             * @param {string} rowToAdd
             * @param {number} [count]
             * @param {Array.<string>} [layers]
             * @private
             */
            _addRow: function (rowToAdd, count, layers) {
                var indexInsertion, existsRow;
                count = Gis.Util.isDefine(count) ? count : this._calculateCountObjects()[rowToAdd];
                layers = layers || this._visibilityController.getLayers().sort(FUNCTION_COMPARATOR);
                indexInsertion = layers.indexOf(rowToAdd);
                if (indexInsertion > 0) {
                    existsRow = this._getExistsRow(layers[indexInsertion - 1]);
                    if (existsRow) {
                        $(this._constructLayerElement(rowToAdd, count)).insertAfter(existsRow);
                    } else {
                        this._$layerList.append(this._constructLayerElement(rowToAdd, count));
                    }
                } else {
                    this._$layerList.prepend(this._constructLayerElement(rowToAdd, count));
                }
            },
            /**
             * @param {Gis.ObjectVisibilityController.LIST_CHANGE_EVENT} event
             * @private
             */
            _onListChanged: function (event) {
                var self = this, i, len, index;

                function doFill(from, to, toClean) {
                    if (from) {
                        len = from.length;
                        if (len) {
                            for (i = 0; i < len; i += 1) {
                                index = toClean.indexOf(from[i]);
                                if (index > -1) {
                                    toClean.splice(index, 1);
                                } else if (to.indexOf(from[i]) < 0) {
                                    to.push(from[i])
                                }
                            }
                        }
                    }
                }

                doFill(event.removed, this._eventsListChanged.removed, this._eventsListChanged.added);
                doFill(event.added, this._eventsListChanged.added, this._eventsListChanged.removed);
                if (!this._listChangeTimeout) {
                    this._listChangeTimeout = setTimeout(function () {
                        var i, len, counts, added = self._eventsListChanged.added, removed = self._eventsListChanged.removed;
                        self._listChangeTimeout = undefined;
                        self._eventsListChanged.added = [];
                        self._eventsListChanged.removed = [];
                        if (removed) {
                            len = removed.length;
                            if (len) {
                                for (i = 0; i < len; i += 1) {
                                    self._removeRow(removed[i]);
                                }
                            }
                        }
                        if (added) {
                            len = added.length;
                            if (len) {
                                counts = self._calculateCountObjects();
                                for (i = 0; i < len; i += 1) {
                                    self._addRow(added[i], counts[added[i]]);
                                }
                            }
                        }
                        if (removed && removed.length) {
                            self._updateButtonState();
                        }
                    }, 1500);
                }
            },
            initDataBlock: function () {
                return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + " layer-list-container'>\n" +
                    "<div id='layers-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Слои</div>\n" +
                    '<div class="' + Gis.Widget.Propertys.DATA_BLOCK_CLASS + '">' +
                    "<div id='layers-selector'>" +
                    "<ul class='layers-menu data-list element-hover'>\n" +
                    this._layersList() +
                    "</ul>\n" +
                    "</div>\n" +
                    "</div>\n" +
                    "</div>\n";
            },
            initButtonsBlock: function () {
                return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                    "<ul class='gis-property-buttons-list'>\n" +
                    this.switcherHtml('li') +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Применить') + "</li>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n";
            },
            _isChecked: function ($aRow) {
                return this._getCheckBox($aRow).hasClass(CHECKED_CLASS);
            },
            _getCheckBox: function ($row) {
                return $('.checkbox', $row);
            },
            _setChecked: function ($row, checked) {
                this._getCheckBox($row)[checked ? 'addClass' : 'removeClass'](CHECKED_CLASS);
            },
            _isStateChanged: function () {
                var $rows = $('li', this._$layerList), i = 0, len = $rows.length, $aRow;
                for (i; i < len; i += 1) {
                    $aRow = $($rows[i]);
                    if (this._getVisibilityController().isLayerVisible($aRow.data(DATA_LAYER_KEY)) !== this._isChecked($aRow)) {
                        return true;
                    }
                }
                return false;
            },
            _updateButtonState: function () {
                this._updateCheckedState()
                var isStateChanged = this._isStateChanged();
                this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
                this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
                this.switchButtonState(this._$buttonNew, isStateChanged);
                this.switchButtonState(this._$buttonRevert, isStateChanged);
            },
            /**
             * @returns {Array.<Gis.ObjectVisibilityController.VisibilityData>}
             */
            getLayers: function () {
                var list = [], self = this;
                $('li', self._$layerList).each(function () {
                    var $this = $(this);
                    list.push(new Gis.ObjectVisibilityController.VisibilityData($this.data(DATA_LAYER_KEY), self._isChecked($this)))
                });
                return list;
            },
            _deInitEvents: function () {
                var renderer = this._containerController.getUIAttached().getMap().getRenderer();
                Gis.Widget.Propertys.prototype._deInitEvents.call(this);
                this._$layerList.off('click', 'li', this._rowClicked);
                this._$div.off('mouseenter', this._mouseEnter);
                this._$div.off('click', '.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._okClicked);
                this._$div.off('click', '.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._revertClicked);
                this._visibilityController.off(Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE, this._onListChanged, this);
                renderer.off(Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE, this._objectChanged, this);
                renderer.off(Gis.ObjectController.LAYER_ADD_EVENT.TYPE, this._objectChanged, this);
                renderer.off(Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE, this._objectChanged, this);
                this.deInitSwitcherEvents();
            },
            _initEvents: function () {
                var self = this,
                    renderer = this._containerController.getUIAttached().getMap().getRenderer();
                this._okClicked = function () {
                    self._getVisibilityController().setLayersVisible(self.getLayers());
                    self._updateButtonState();
                    return false;
                };
                this._revertClicked = function () {
                    $('li', self._$layerList).each(function () {
                        var $this = $(this);
                        self._setChecked($this, self._getVisibilityController().isLayerVisible($this.data(DATA_LAYER_KEY)));
                    });
                    self._updateButtonState();
                    return false;
                };
                this._rowClicked = function () {
                    var $aRow = $(this);
                    self._setChecked($aRow, !self._isChecked($aRow));
                    self._updateButtonState();
                    return false;
                };
                this._mouseEnter = function () {
                    self._$layerList.css('height', self._$layerList.height());
                    self._$div.on('mouseleave', self._mouseLeave);
                };
                this._mouseLeave = function () {
                    self._$layerList.css('height', 'auto');
                    self._$div.off('mouseleave', self._mouseLeave);
                };

                function updateRowVisivility($row, count) {
                    $row[count ? 'removeClass' : 'addClass'](INVISIBLE_ROW_CLASS);
                }
                function setRowCount($countContainer, count) {
                    $countContainer.data('count', count);
                    $countContainer.text(count);
                }

                /**
                 *
                 * @param {Gis.ObjectController.LAYER_CHANGED_EVENT} event
                 * @private
                 */
                this._objectChanged = function (event) {
                    if (self._eventsChanged.indexOf(event.target) === -1) {
                        self._eventsChanged.push(event.target);
                        if (!self.changedTimeout) {
                            self.changedTimeout = setTimeout(function () {
                                var layers = self._visibilityController.getLayersFromObject(self._eventsChanged[0]),
                                    counts = self._calculateCountObjects(),
                                    i,
                                    len,
                                    i2,
                                    len2,
                                    $row,
                                    $count,
                                    layerInProgress,
                                    countInProgress,
                                    changed;
                                for (i = 1, len = self._eventsChanged.length; i < len; i += 1) {
                                    changed = self._visibilityController.getLayersFromObject(self._eventsChanged[i])
                                    for (i2 = 0, len2 = changed.length; i2 < len2; i2 += 1) {
                                        if (layers.indexOf(changed[i2]) === -1) {
                                            layers.push(changed[i2]);
                                        }
                                    }
                                }
                                self._eventsChanged = [];
                                for (i = 0, len = layers.length; i < len; i += 1) {
                                    layerInProgress = layers[i];
                                    countInProgress = counts[layerInProgress];
                                    $row = self._getExistsRow(layerInProgress);
                                    $count = $('span.count', $row);
                                    if ($count.data('count') !== countInProgress) {
                                        setRowCount($count, countInProgress);
                                    }
                                }
                                self.changedTimeout = undefined;
                            }, 2000);
                        }
                    }
                };
                this._$layerList.on('click', 'li', this._rowClicked);
                this._$div.on('mouseenter', this._mouseEnter);
                this._$div.on('click', '.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._okClicked);
                this._$div.on('click', '.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._revertClicked);
                this._visibilityController.on(Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE, this._onListChanged, this);
                renderer.on(Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE, this._objectChanged, this);
                renderer.on(Gis.ObjectController.LAYER_ADD_EVENT.TYPE, this._objectChanged, this);
                renderer.on(Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE, this._objectChanged, this);
                this.initSwitcherEvents();
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

    Gis.Widget.LayersProperty.include(Gis.checkAll);
    Gis.Widget.LayersProperty.CLASS_NAME = "gis-widget-propertys-layers";
    Gis.Widget.layersProperty = function (data) {
        return new Gis.Widget.LayersProperty(data);
    };
}());