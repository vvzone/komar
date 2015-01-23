(function(global) {
    "use strict";
    var RECALCULATE_DELAY = 3000,
        CURRENT_FILTER_TYPE,
        CURRENT_FILTER_FUNCTION,
        TYPE_SELECTED_CLASS = 'selected-type',
        $filterAllButton,
        SELECTED_CLASS = 'selected',
        HIDED_CLASS = 'hided',
        FOCUSED_CLASS = 'focused',
        singleton,
        openedType,
        ESC_CODE = 27,
        IS_COLLAPSED = 'is-scheme-collapsed';
    function falseFn () {
        return false;
    }

    function generateObjectName(object) {
        return object.getName() || object.getTypeName(object.getType()) || 'Неизвестный объект';
    }
    function getFilterCriteria () {
        return $filterAllButton.hasClass(SELECTED_CLASS) ? getFilterCriteriaReal() : undefined;
    }
    function getFilterCriteriaReal () {
        return $('input', $filterAllButton).val().toLowerCase();
    }
    function isNeddDrawUncollapsedRows () {
        openedType || getFilterCriteria();
    }
    function selectRow (row, select) {
        var scrollList,
            $row = $(row),
            rowTop,
            listHeight,
            listOffset,
            dScroll,
            rowHeight,
            boundingClientRect;
        if (row) {
            var layerId = $row.data('layer-id'), layer;
            layer = this._containerController.getUIAttached().getMap().getLayer(layerId);
            this._containerController.getUIAttached().fire('selectlayer', {layer: layer});
            $row[select ? 'addClass' : 'removeClass']('selected');
            if (select) {
                boundingClientRect = row.getBoundingClientRect();
                rowHeight = boundingClientRect.height;
                listOffset = this._filteredList[0].getBoundingClientRect().top;
                scrollList = this._filteredList.scrollTop();
                listHeight = this._filteredList.height();
                rowTop = boundingClientRect.top;
                if (rowTop < listOffset || (rowTop + rowHeight) >= (listOffset + listHeight)){
                    dScroll = listOffset + listHeight / 2 - rowTop - rowHeight / 2;
                    this._filteredList.scrollTop(scrollList - dScroll);
                }
            }
        }
    }
    function unSelectRows (rowExclude) {
        var self = this;
        $('.gis-row-layer', this._$list).not($(rowExclude)).each(function () {
            var layerId = $(this).data('layer-id'), layer;
            layer = self._containerController.getUIAttached().getMap().getLayer(layerId);
            self._containerController.getUIAttached().fire('unselectlayer', {layer: layer});
        });
        $('.gis-row-layer', this._$list).not($(rowExclude)).removeClass('selected');
    }

    function isLayerVisible(layer, filterFunction, type, filterCriteria) {
        return type === layer.getType() && filterFunction(layer) && (!filterCriteria || generateObjectName(layer).toLowerCase().indexOf(filterCriteria) > -1);
    }

    function filter() {
        singleton._fillList();
    }
    function focusChange(e) {
        if (e.type === 'focusin') {
            $filterAllButton[0].classList.add(FOCUSED_CLASS);
        } else {
            $filterAllButton[0].classList.remove(FOCUSED_CLASS);
        }
    }
    function inputKeyUp(e) {
        if (e.keyCode === ESC_CODE) {
            $filterAllButton[0].classList.remove(SELECTED_CLASS);
            checkFilterState();
        }
        return false;
    }

    function checkFilterState() {
        if (getFilterCriteriaReal()) {
            singleton._fillList();
        }
        if ($filterAllButton[0].classList.contains(SELECTED_CLASS)) {
            $('input', $filterAllButton)[0].focus();
        } else {
            $('input', $filterAllButton)[0].blur();
        }
    }

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
            selectRow: selectRow,
            unSelectRows: unSelectRows,
            getNeedSize: function () {
                return [this._$div.outerWidth(true), 200];
            },
            initialize: function (data) {
                var self = this;
                singleton = this;
                if (Gis.UI.isNeedUseZeroClipboard()) {
                    Gis.UI.loadZeroClipboard(function (ZeroClipboard) {
                        ZeroClipboard.config({
                            swfPath: Gis.config('relativePath') + "libs/ui/ZeroClipboard.swf"
                        });
                    });
                }
                Gis.Widget.Base.prototype.initialize.call(this, data);
                this._layerDblClicked = function (e) {
                    var layerId = $(this).data('layer-id'), layer, center, bounds;
                    layer = self._containerController.getUIAttached().getMap().getLayer(layerId);
                    if (layer) {
                        /**
                         * @type {Gis.LatLngBounds}
                         */
                        bounds = layer.getLatLngBounds && layer.getLatLngBounds();
                        if (bounds) {
                            self._containerController.getUIAttached().getMap().setMapBounds(bounds);
                        } else {
                            center = layer.getCenter();
                            if (center) {
                                self._containerController.getUIAttached().getMap().setCenter(center);
                            }
                        }
                    }
                    return false;
                };
                this._layerClicked = function (e) {
                    var layerId = $(this).data('layer-id'), layer;
                    layer = self._containerController.getUIAttached().getMap().getLayer(layerId);
                    if (layer) {
                        self.unSelectRows(this);
                        self.selectRow(this, true);
                        if (layer.isSelectable()) {
                            layer.fire('select', {force: true});
                        }
                    }
                    return false;
                };
                this._actionClicked = function (e) {
                    var data = $(this).data(), layerId = $(this).parent().parent().data('layer-id'), layer;
                    layer = self._containerController.getUIAttached().getMap().getLayer(layerId);
                    switch (data.action) {
                        case "attach":
                            Gis.Widget.measureProperty().addObjectToPoints(layer);
                            break;
                        case "delete":
                            try {
                                if (Gis.UI.DeleteActions[layer.getType()]) {
                                    Gis.UI.DeleteActions[layer.getType()].call(self, {srcElement: {}}, layer);
                                }
                            } catch (e) {
                                Gis.Logger.log("Error delete", e.message, e.stack);
                            }
                            break;
                        case "copy":
                            var center = Gis.UI.getCoordinatesString(layer, self);
                            if (center) {
                                if (Gis.UI.copyToClipboard(center)) {
                                    Gis.notify('Позиция скопирована в буфер обмена', 'info');
                                }
                            } else {
                                Gis.notify('Позиция неопределена', 'warning');
                            }
                            break;
                        case "menu":
                            if (Gis.UI.isNeedUseZeroClipboard()) {
                                self.initZeroCopy.call($('.copy', $(this).parent())[0]);
                            }
                            break;
                    }
                    $($(this).parent()).toggleClass('active');
                    return false;
                };
                /**
                 * Сохранить слои с карты в файл
                 * @param filename
                 */
                function saveLayers(filename) {
                    var map, layerIds, layer, layers = [], oBuilder, oMyBlob, layersData, characterType;
                    filename = filename || 'data.json';
                    var UIAttached = self._containerController.getUIAttached();
                    map = UIAttached.getMap();
                    layerIds = map.getLayerIDs();
                    layerIds.forEach(function (id) {
                        layer = map.getLayer(id);
                        if (Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1) {
                            layers.push(layer);
                        }
                    });
                    layersData = JSON.stringify(layers, null, '    ');
                    characterType = "text/plain;charset=" + document.characterSet;
                    if (window.WebKitBlobBuilder) {
                        oBuilder = new WebKitBlobBuilder();
                        oBuilder.append(layersData);
                        oMyBlob = oBuilder.getBlob(characterType);
                    } else {
                        oMyBlob = new Blob([layersData], {type: characterType});
                    }
                    saveAs(oMyBlob, filename);
                }

                this.isCollapsed = function () {
                    return !self.$_middle.is(":visible");
                };

                this.toggleCollapsed = function () {
                    var display = !self.isCollapsed() ? "none" : "block";
                    self.$_middle.css({
                        display: display
                    });
                    self.$_header.css({
                        display: display
                    });
                    if (self.isCollapsed()) {
                        Gis.Widget.Scheme.needHeight = function () {
                            return self._$div.outerHeight(true);
                        };
                        self.$_collapse.addClass("collapsed");
                    } else {
                        Gis.Widget.Scheme.needHeight = Gis.Widget.Scheme.needHeightNormal;
                        self.$_collapse.removeClass("collapsed");
                    }
                    Gis.Preferences.setPreferenceData(IS_COLLAPSED, self.isCollapsed());
                    self._containerController.getUIAttached()._recalculateContainerStyles();
                };
                this._saveAllClick = function () {
                    var map = self._containerController.getUIAttached().getMap();
                    if ($(this).hasClass("disabled")) {
                        return;
                    }
                    if (Gis.Util.isCellNet()) {
                        try {
                            var layerIds, layer, layers = [];
                            layerIds = map.getLayerIDs();
                            layerIds.forEach(function (id) {
                                layer = map.getLayer(id);
                                if (Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1) {
                                    layers.push(layer);
                                }
                            });
                            cellnet.savejson(JSON.stringify(layers, null, '    '));
                        } catch (e) {
                            alert(e);
                        }
                        return;
                    }
                    var $dialog = $('#dialog-save-file-name'),

                        layerIDs;
                    if (!$dialog.length) {
                        $dialog = $('<div id="dialog-save-file-name"><h3>Укажите имя файла для сохранения</h3><input id="file-name-user" type="text"/></div>');
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
                                text: 'Сохранить',
                                click: function () {
                                    saveLayers($('input', $(this)).val() || 'data.json');
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
                    });
                    layerIDs = map.getLayerIDs();
                    if (layerIDs && layerIDs.length) {
                        $('input', $dialog).val('data.json');
                        $dialog.dialog('open');
                        $('input', $dialog).select();
                    }
                };
                this._fileChange = function (e) {
                    var map, selected_file;
                    var UIAttached = self._containerController.getUIAttached();
                    map = UIAttached.getMap();
                    selected_file = this.files[0];
                    this.value = '';
                    var reader = new FileReader();
                    reader.onload = (function(map) {
                        return function(e) {
                            var objects;
                            try {
                                objects = JSON.parse(e.target.result);
                                Gis.Util.fillMapFromObject(map, objects);
                            } catch (err) {
                                Gis.Logger.log('Некорректные данные в файле', e.target.result, err.stack);
                            }
                        };
                    })(map);
                    reader.readAsText(selected_file, 'utf-8');
                };
                this._fileClick = function () {
                    if (Gis.Util.isCellNet()) {
                        var map = self._containerController.getUIAttached().getMap(),
                            data = cellnet.loadjson();
                        if (data) {
                            map.fillObjects(data)
                        }
                        return false;
                    }
                };

                this._typeClicked = function () {
                    self._setTypeOpen($(this).parent().data('type-id'));
                };
                this.allClearClick = function () {
                    if ($(this).hasClass("disabled")) {
                        return;
                    }
                    self._deleteLayersConfirm();
                };
                this.filterTypeSelected = function (type) {
                    CURRENT_FILTER_TYPE = type || Gis.Widget.Scheme.TYPE_FILER_ALL;
                    self._selectedType = type;
                    CURRENT_FILTER_FUNCTION = CURRENT_FILTER_TYPE === Gis.Widget.Scheme.TYPE_FILER_ALL ? function (layer) {
                        return Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1 && layer.getOriginalType() === layer.getType();
                    } : function (layer) {
                        return layer.getType() === CURRENT_FILTER_TYPE;
                    }
                    self._fillList();
                };
                this.triggerFilter = function (e) {
                    $filterAllButton[0].classList.toggle(SELECTED_CLASS);
                    checkFilterState();
                    return false;
                };
                this.initZeroCopy = function () {
                    if (Gis.UI.isNeedUseZeroClipboard()) {
                        var layer = this;
                        if (this._binded) {
                            return;
                        } else {
                            this._binded = true;
                            this.classList.remove('not-binded');
                            var client = new ZeroClipboard(this);
                            client.on("copy", function (event) {
                                var layerLocal, layerId = $(layer).parents('.gis-row-layer').data('layer-id');
                                layerLocal = self._containerController.getUIAttached().getMap().getLayer(layerId);
                                var center = layerLocal.getCenter();
                                if (center) {
                                    center = self.coordinateToText(center);
                                } else {
                                    Gis.notify('Позиция неопределена', 'warning');
                                    return;
                                }
                                event.clipboardData.setData("text/plain", center);
                            });
                            client.on("aftercopy", function () {
                                Gis.notify('Позиция скопирована в буфер обмена', 'info');
                            });
                            client.on('error', function (e) {
                                console.log(e);
                            });
                        }
                    }
                };
            },
            _deleteLayersConfirm: function () {
                var $dialogDiv = $('.dialogMapClear'), map = this._containerController.getUIAttached().getMap();
                if (!$dialogDiv.length) {
                    $dialogDiv = $('<div class="dialogMapClear" style="display: none; text-align: left;">' +
                        '<h2 style="font-size: 16px;">Подтверждение очистки карты</h2>' +
                        '<div style="margin-top: 10px">Вы действительно хотите очистить карту?</div>' +
                        '<div style="margin-top: 10px; padding-top: 5px; border-top: 1px solid #ffffff;"><input type="checkbox" style="margin-right: 10px;" name="delete-owner"  id="delete-owner" /><label for="delete-owner">Удалить созданные оператором объекты</label></div>' +
                        '</div>').appendTo(document.body);
                }
                this._$dialogRemoveMap = $dialogDiv.dialog(Gis.Util.extend(this._dialogOptions, {
                    buttons: [
                        {
                            text: 'Да',
                            click: function () {
                                var deleteOwner = $("#delete-owner", $dialogDiv).is(':checked');
                                map.clearMap(function (layer) {
                                    return deleteOwner || !layer.isEditableByUser();
                                }, false);
                                $dialogDiv.dialog('close');
                            }
                        },{
                            text: 'Нет',
                            click: function () {
                                $dialogDiv.dialog('close');
                            }
                        }]
                }));
                this._$dialogRemoveMap.dialog('open');
            },
            removeFuncFilter: function (layer) {
                return layer && layer.isEditableByUser() && Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1;
            },
            onAdd: function (container) {
                Gis.Widget.Base.prototype.onAdd.call(this, container);
                this.draw();
                this.setBounds();
                var preferenceData = Gis.Preferences.getPreferenceData(IS_COLLAPSED);
                Gis.setConfig(Gis.Widget.Scheme.COLLAPSE_BY_DEFAULT_KEY, true);
                if (!Gis.Util.isDefine(preferenceData)) {
                    preferenceData = Gis.config(Gis.Widget.Scheme.COLLAPSE_BY_DEFAULT_KEY, false);
                }
                if (preferenceData !== this.isCollapsed()) {
                    this.toggleCollapsed();
                }
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
                    "<div class=\"gis-widget-button\" id=\"gis-collapse\" title='Свернуть'></div>" +
                    (this.isControlAvailable('schemesaveall') ? "<div class='gis-widget-button' id='gis-save-all' title='Сохранить всю топосхему'></div>" : '') +
                    (this.isControlAvailable('schemeload') ? "<div class='gis-widget-button' id='gis-load-all' title='Загрузить топосхему из файла'>" +
                        "<input type='file' title='' name='file'>" +
                    "</div>" : '') +
                    (this.isControlAvailable('schemeclear') ? "<div class='gis-widget-button' id='gis-clear-all' title='Очистить карту'></div>" : '') +
                    "</div>";
            },
            _contentHtml: function () {
                return "<ul id='gis-list-filtered' class='data-list element-hover'>" +
                    "</ul>";
            },
            _headerHtml: function () {
                return "<div>" +
                    "<div class='gis-widget-button btn' id='gis-filter-all' title='Фильтр'>" +
                    "<span></span>" +
                    "<div class='input-group'><input type='text' placeholder='Фильтр'></div>" +
                    "</div>" +
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
                var map, processed = [], types = [{val: Gis.Widget.Scheme.TYPE_FILER_ALL, name: 'Все'}];
                map = this._containerController.getUIAttached().getMap();
                map.getRenderer().getKnownTypes().forEach(function (type) {
                    if (processed.indexOf(type) < 0 && Gis.Widget.Scheme.TYPES.indexOf(type) >= 0) {
                        types.push({val: type, name: Gis.Widget.Scheme.TYPE_NAMES[type]});
                        processed.push(type);
                    }
                });
                if (processed.indexOf(openedType) === -1) {
                    openedType = undefined;
                }
                return types;
            },
            _getRowsFiltered: function (filterFunction, aLayer) {
                var map, layerIds, type, layer, rows = {};
                map = this._containerController.getUIAttached().getMap();
                layerIds = aLayer ? [aLayer.getId()] : map.getLayerIDs();
                var filterCriteria = getFilterCriteria();
                layerIds.forEach(function (id) {
                    layer = map.getLayer(id);
                    type = layer.getOriginalType();
                    if (Gis.Widget.Scheme.TYPES.indexOf(layer.getType()) > -1) {
                        rows[type] = rows[type] || [];
                        rows[type].push({layer: layer, visible: isLayerVisible(layer, filterFunction, type, filterCriteria)});
                    }
                });
                return rows;
            },
            _skChanged: function () {
                this.filterTypeSelected(this._selectedType);
                Gis.Widget.Base.prototype._skChanged.call(this);
            },
            drawIcon: function (object) {
                var options = object.getOptionsWithStyle(),
                    width,
                    icon;
                if (!object || (object.getType() !== "source" && object.getType() !== "post")) {
                    return;
                }
                icon = options.icon;
                var baseWidth = 21;
                if (icon) {
                    if (this.tagName.toLowerCase() === 'div') {
                        width = this.outerWidth;
                        var top = (baseWidth - width) / 2;
                        var canvasImage = document.createElement('canvas');
                        var iconByTpe = Gis.Additional.Icon[icon.getType()];
                        if (object.getType() === "source" && options.bearingStyle) {
                            width = 12;
                            top = 1;
                            var canvas = document.createElement('canvas');
                            canvas.width = baseWidth;
                            canvas.height = baseWidth;
                            var context = canvas.getContext('2d');

                            context.beginPath();
                            context.shadowBlur=1;
                            context.shadowColor=options.bearingStyle.getBorder();
                            context.strokeStyle=options.bearingStyle.getColor();
                            context.fillStyle=options.bearingStyle.getColor();
                            context.lineWidth = options.bearingStyle.getThickness();
                            context.moveTo(0, 14);
                            context.lineTo(baseWidth, 0);
                            context.stroke();
                            this.appendChild(canvas);
                        }
                        canvasImage.width = width;
                        canvasImage.height = width;
                        this.appendChild(canvasImage);
                        $(canvasImage).css({
                            top: top,
                            left: (baseWidth - width) / 2
                        });
                        if (iconByTpe) {
                            iconByTpe(icon.getOption('color') || 'black', width, canvasImage);
                        } else {
                            var imageObj = new Image();
                            imageObj.onload = function() {
                                canvasImage.getContext('2d').drawImage(imageObj, 0, 0, width, width);
                            };
                            imageObj.src = icon.getImageUrl();
                        }
                    } else {
                        this.src = icon.getImageUrl();
                    }
                }
            },
            _drawIcons: function ($parent) {
                var map = this._containerController.getUIAttached().getMap(),
                    object, self = this;
                $('.ico-preview', $parent || this._filteredList).each(function () {
                    object = map.getLayer($(this).data('id'));
                    self.drawIcon.call(this, object);
                });
            },
            getRowActions: function (row) {
                return "<div class='actions'>" +
                    "<div class='action real-action attach gis-widget-button' title='Связать с измерителем' data-action='attach'></div>" +
                    "<div class='action real-action delete  " + this._editableClass(row) + " gis-widget-button' title='Удалить' data-action='delete'></div>" +
                    "<div class='action real-action copy not-binded gis-widget-button' data-clipboard-text='Позиция неопределена' title='Скопировать координаты' data-action='copy'></div>"+
                    "<div class='action menu gis-widget-button'  data-action='menu'  title='Меню'></div>" +
                    "</div>";
            },
            _selectedClass: function (selected, row) {
                return (selected && selected.getId() === row.getId() ? 'selected' : '');
            },
            _editableClass: function (row) {
                return (this.isDataEditable(row) && row.isEditableByUser()) ? "" : "";
            },
            _generateRow: function (row, visible) {
                return '<li id="gis-row-layer-' + row.getId() + '" class=\'gis-row-layer ' + this._selectedClass(this._getFirstSelected(), row) + (visible ? '' : (' ' + HIDED_CLASS)) +
                    '\' data-layer-id=\'' + row.getId() + '\'>' + this.getRowActions(row) + this._generateIco(row) + '<div class="row-name">' +
                    this._generateRowName(row) + '</div></li>';
            },
            _fillList: function () {
                var id, i, len, row, html = "", rows = this._getRowsFiltered(CURRENT_FILTER_FUNCTION), filterCriteria = getFilterCriteria(),
                    isFiltered = Gis.Widget.Scheme.TYPE_FILER_ALL !== CURRENT_FILTER_TYPE || filterCriteria;
                for (id in rows) {
                    if (rows.hasOwnProperty(id)) {
                        var name = !isFiltered ? '<span>' + Gis.Widget.Scheme.TYPE_NAMES[id] + '</span>' : '';
                        html += '<li class=\'gis-type gis-type-' + id + " " +
                            (filterCriteria || (openedType && openedType === id) ? TYPE_SELECTED_CLASS : '') + '\' data-type-id=\'' + id + '\'>' + name +
                            '<ul>';
                        for (i = 0, len = rows[id].length; i < len; i += 1) {
                            row = rows[id][i];
                            html += this._generateRow(row.layer, row.visible);
                        }
                        html += "</ul></li>";
                    }
                }
                this._rows = {};
                this._filteredList.html(html);
                this._drawIcons();
                if (isFiltered && openedType !== CURRENT_FILTER_TYPE && !filterCriteria) {
                    this._setTypeOpen(CURRENT_FILTER_TYPE);
                }
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
                this._rows = {};
                this._filteredList = $('#gis-list-filtered', this._$list);
                this._$div.append(this._$list);
                this._createTypeList();
                this.$_middle = $('.gis-map-middle', this._$list);
                this.$_header = $('.gis-map-header', this._$list);
                this.$_footer = $('.gis-map-footer', this._$list);
                this.$_collapse = $('#gis-collapse', this.$_footer);
                this.$_save = $("#gis-save-all", this.$_footer);
                this.$_clean = $("#gis-clear-all", this.$_footer);
                $filterAllButton = $('#gis-filter-all', this._$list);
            },
            setBounds: function () {
                var maxHeight, heightContainer;
                heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
                maxHeight = this.isCollapsed() ? this._$div.outerHeight(true) : Math.min(heightContainer / 2, 300);
                this.$_middle.css({
                    height: (maxHeight - this.$_header.outerHeight(true) - this.$_footer.outerHeight(true) - this._$div.outerHeight(true) + this._$div.height())
                });
                this._$div.css({
                    top: heightContainer - maxHeight
                });
            },
            _setTypeOpen: function (type) {
                if (!type) {
                    $('.gis-type.' + TYPE_SELECTED_CLASS, this._$list).removeClass(TYPE_SELECTED_CLASS);
                } else {
                    $('.gis-type.' + TYPE_SELECTED_CLASS, this._$list).not($('.gis-type-' + type, this._$list)).removeClass(TYPE_SELECTED_CLASS);
                    if (openedType !== type) {
                        $('.gis-type-' + type, this._$list).addClass(TYPE_SELECTED_CLASS);
                    } else {
                        $('.gis-type-' + type, this._$list).removeClass(TYPE_SELECTED_CLASS);
                        type = undefined;
                    }
                }
                openedType = type;
            },
            _layerEvent: function (e) {
                if (this._funcEvent) {
                    return this._funcEvent;
                }
                var self = this, functions = {
                    'layerunselected': function (e) {
                        var $rows;
                        $rows = $('.gis-row-layer.selected', self._$list);
                        if ($rows.data('layer-id') === e.layer.getId()) {
                            self.selectRow($rows, false);
                        }
                    },
                    'layerselected': function (e) {
                        if (CURRENT_FILTER_FUNCTION && !CURRENT_FILTER_FUNCTION(e.layer || e.target)) {
                            return;
                        }
                        var id = e.layer.getParentId() || e.layer.getId(), filterCriteria = getFilterCriteria();
                        $('.gis-row-layer.selected', this._$list).removeClass('selected');
                        $('.gis-row-layer', this._$list).each(function () {
                            if (id === $(this).data('layer-id') && Gis.Widget.Scheme.TYPES.indexOf(e.layer.getType()) >= 0) {
                                if (!filterCriteria && e.layer.getType() !== openedType) {
                                    self._setTypeOpen(e.layer.getType());
                                }
                                self.unSelectRows(this);
                                self.selectRow(this, true);
                            }
                        });
                    },
                    'layerchanged': function (e) {
                        var element;
                        if (self._layerNotForScheme(e)) {
                            return;
                        }
                        if (CURRENT_FILTER_FUNCTION && !CURRENT_FILTER_FUNCTION(e.layer || e.target)) {
                            return;
                        }
                        var id = e.target.getId();
                        if (!self._rows[id]) {
                            element = $('#gis-row-layer-' + id, self._filteredList);
                            if (!element.length) {
                                return self._layerAdded(e);
                            }
                            self._rows[id] = element;
                        } else {
                            element = self._rows[id];
                        }
                        if (e.target.options.icon && e.rows && e.rows.indexOf('icon') > -1) {
                            var element2 = $(self._generateRow(e.target, !element.hasClass(HIDED_CLASS)));
                            element.replaceWith(element2);
                            self._rows[id] = element2;
                            if (element2.length > 0) {
                                var $ico = $('.ico-preview', element2);
                                if ($ico.length > 0) {
                                    self.drawIcon.call($ico[0], e.target);
                                }
                            }
                        } else {
                            this.updateText(e, element);
                        }
                    }
                };
                this._funcEvent = function (e) {
                    if (functions[e.type]) {
                        functions[e.type].call(self, e);
                    }
                };
                return this._funcEvent;
            },
            _deInitEvents: function () {
                Gis.Widget.Base.prototype._deInitEvents.call(this);
                var map = this._containerController.getUIAttached().getMap(), self = this;
                map.off('layeradded', this._layerAdded, this);
                map.off('layerremoved', this._layerRemoved, this);
                map.off('layerremoved layeradded', this._checkButtonsActive, this);
                map.getRenderer().off('layervisibilitychanged', this._recalculateListDelayed, this);
                map.getRenderer().off('layervisibilitychanged', this._checkButtonsActive, this);
                this._$list.off('dblclick', '.gis-row-layer', this._layerDblClicked);
                this._$list.off('click', '.gis-row-layer', this._layerClicked);
                this._$list.off('click', '.gis-type > span', this._typeClicked);
                this.$_middle.off('click', '.actions .action', this._actionClicked);
                if (Gis.UI.isNeedUseZeroClipboard()) {
                    Gis.UI.loadZeroClipboard(function () {
                        self.$_middle.off('mouseenter', '.actions .copy.not-binded', self.initZeroCopy);
                    });
                }
                this._$list.off('click', '#gis-filter-all', this.triggerFilter);
                this._$list.off('click', '#gis-filter-all input', falseFn);
                $filterAllButton.off('input', 'input', filter);
                $filterAllButton.on('focus blur', 'input', focusChange);
                $filterAllButton.off('keyup', 'input', inputKeyUp);
                this._$list.off('click', '#gis-collapse', this.toggleCollapsed);
                this._$list.off('click', '#gis-save-all', this._saveAllClick);
                this._$list.off('change', '#gis-load-all > input', this._fileChange);
                this._$list.off('change', '#gis-load-all > input', this._fileChange);
                this._$list.off('click', '#gis-load-all > input', this._fileClick);
                this._$list.off('click', '#gis-clear-all', this.allClearClick);
                this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
                this._containerController.getUIAttached().getMap().off('layerselected layerunselected layerchanged', this._layerEvent(), this);
                this._$div.tooltip('destroy');
            },
            _layerNotForScheme: function (e) {
                return e && e.target && e.target.getType && (Gis.Widget.Scheme.TYPES.indexOf(e.target.getType()) === -1 || e.target.isControllableByServer() === Gis.FULL_LOCAL);
            },
            _recalculateList: function (e) {
                if (this._layerNotForScheme(e)) {
                    return;
                }
                this._createTypeList();
                this.filterTypeSelected(this._selectedType);
                this.afterUpdate();
            },
            _recalculateListDelayed: function (e) {
                var self = this;
                if (!this._recalculateListTimeout) {
                    this._recalculateListTimeout = setTimeout(function () {
                        self._recalculateListTimeout = null;
                        Gis.requestAnimationFrame(50)(function () {
                            self._recalculateList(e);
                        });
                    }, RECALCULATE_DELAY);
                }
            },
            _layerAdded: function (e) {
                var rows, layer = e.target, $newRow, $parent;
                if (CURRENT_FILTER_FUNCTION && !CURRENT_FILTER_FUNCTION(layer)) {
                    return;
                }
                if ($('#gis-row-layer-' + layer.getId(), this._filteredList).length) {
                    return;
                }
                $parent = $('.gis-type-' + layer.getType(), this._filteredList);
                if (!$parent.length) {
                    this._recalculateList(e);
                    return;
                }
                rows = this._getRowsFiltered(CURRENT_FILTER_FUNCTION, layer);
                $newRow = $(this._generateRow(layer, rows && rows[layer.getType()] && rows[layer.getType()][0].visible));
                $('>ul', $parent).append($newRow);
                this._drawIcons($newRow);
            },
            _layerRemoved: function (e) {
                var $parent = $('.gis-type-' + e.target.getType(), this._filteredList);
                $('#gis-row-layer-' + e.target.getId(), $parent).remove();
                delete this._rows[e.target.getId()];
                if (!$('ul li', $parent).length) {
                    $parent.remove();
                    this._createTypeList();
                }
            },
            _checkButtonsActive: function (e) {
                var map = this._containerController.getUIAttached().getMap(),
                    ids = map.getLayerIDs(),
                    filtered = ids.filter(function (element) {
                        var layer2 = map.getLayer(element);
                        return Gis.Widget.Scheme.TYPES.indexOf(layer2.getType()) > -1;
                    });
                if (filtered.length == 0) {
                    this.$_save.addClass("disabled");
                    this.$_clean.addClass("disabled");
                } else {
                    this.$_save.removeClass("disabled");
                    this.$_clean.removeClass("disabled");
                }
            },
            _initEvents: function () {
                Gis.Widget.Base.prototype._initEvents.call(this);
                var map = this._containerController.getUIAttached().getMap(), self = this;
                map.on('layeradded', this._layerAdded, this);
                map.on('layerremoved', this._layerRemoved, this);
                map.on('layerremoved layeradded', this._checkButtonsActive, this);
                map.getRenderer().on('layervisibilitychanged', this._recalculateListDelayed, this);
                map.getRenderer().on('layervisibilitychanged', this._checkButtonsActive, this);
                this._$list.on('dblclick', '.gis-row-layer', this._layerDblClicked);
                this._$list.on('click', '.gis-row-layer', this._layerClicked);
                this.$_middle.on('click', '.actions .action', this._actionClicked);
                if (Gis.UI.isNeedUseZeroClipboard()) {
                    Gis.UI.loadZeroClipboard(function () {
                        self.$_middle.on('mouseenter', '.actions .copy.not-binded', self.initZeroCopy);
                    });
                }
                this._$list.on('click', '.gis-type > span', this._typeClicked);
                this._$list.on('click', '#gis-save-all', this._saveAllClick);
                this._$list.on('click', '#gis-collapse', this.toggleCollapsed);
                this._$list.on('change', '#gis-load-all > input', this._fileChange);
                this._$list.on('click', '#gis-load-all > input', this._fileClick);
                this._$list.on('click', '#gis-clear-all', this.allClearClick);
                this._$list.on('click', '#gis-filter-all', this.triggerFilter);
                this._$list.on('click', '#gis-filter-all input', falseFn);
                $filterAllButton.on('input', 'input', filter);
                $filterAllButton.on('focus blur', 'input', focusChange);
                $filterAllButton.on('keyup', 'input', inputKeyUp);
                this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
                this._containerController.getUIAttached().getMap().on('layerselected layerunselected layerchanged', this._layerEvent(), this);
                this._$div.tooltip({
                    items: ".gis-row-layer .row-name",
                    track: true,
                    content: function () {
                        var element = $($(this).parent()),
                            layer = map.getLayer(element.data('layer-id'));
                        if (layer) {
                            return layer.getFormatedDescription();
                        }
                        return '';
                    }
                });
            },
            afterUpdate: function () {
                Gis.Widget.Base.prototype.afterUpdate.call(this);
            }
    });

    Gis.Widget.Scheme.TYPE_FILER_ALL = "-1";
    Gis.Widget.Scheme.TYPE_NAMES = {
        source: 'Объект',
        post: 'Пост',
        ellipse: 'Эллипс',
        visibility: 'Область видимости',
        path: 'Маршрут',
        polygon: 'Полигон',
        sector: 'Сектор',
        image: 'Иконка',
        text: 'Маркер'
    };
    Gis.Widget.Scheme.TYPE_NAMES[Gis.Objects.Overlay.prototype.options.tacticObjectType] = 'Оверлей';
    Gis.Widget.Scheme.TYPE_NAMES[Gis.Objects.VisibilityMap.prototype.options.tacticObjectType] = 'Область видимости';
    Gis.Widget.Scheme.TYPE_NAMES[Gis.Objects.ArealRelief.prototype.options.tacticObjectType] = 'Площадной рельеф';
    Gis.Widget.Scheme.TYPE_NAMES[Gis.Objects.HeatMap.prototype.options.tacticObjectType] = "Температурная карта";
    Gis.Widget.Scheme.TYPE_NAMES[Gis.Objects.GeoPath.prototype.options.tacticObjectType] = "Автоматическй маршрут";
    Gis.Widget.Scheme.TYPES = [
        Gis.Objects.VisibilityMap.prototype.options.tacticObjectType,
        Gis.Objects.ArealRelief.prototype.options.tacticObjectType,
        Gis.Objects.Overlay.prototype.options.tacticObjectType,
        'source',
        'post',
        Gis.Objects.HeatMap.prototype.options.tacticObjectType,
        Gis.Objects.GeoPath.prototype.options.tacticObjectType,
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
        if (singleton && data) {
            singleton.setData(data);
        }
        return singleton || new Gis.Widget.Scheme(data);
    };
    Gis.Widget.Scheme.needHeightNormal = function (avail) {
        return Math.min(avail / 2, 300);
    };
    Gis.Widget.Scheme.needHeight = Gis.Widget.Scheme.needHeightNormal;
    Gis.Widget.Scheme.include(Gis.UI.TitleGenerators);
    Gis.Widget.Scheme.COLLAPSE_BY_DEFAULT_KEY = 'collapse_scheme_by_default';
}(this));