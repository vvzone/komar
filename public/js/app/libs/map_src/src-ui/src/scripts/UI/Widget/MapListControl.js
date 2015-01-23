/**
 * Created by Пользователь on 21.04.14.
 */
(function (global) {
    'use strict';
    var MIN_HEIGHT = 300,
        MIN_WIDTH = 390,
        $dialog,
        MAP_DIALOG_ID = "map-dialog",
        DLG_DIMENSION = "MAPS_DIALOG_DIMENSION",
        MAP_LIST_CONTAINER_ID = "map-list-container",
        SELECTED_CLASS = "selected",
        $mapTypeFilter,
        $mapListContainer,
        $mapFlter,
        $mapAdditional,
        gisMap,
        isCanControlMaps = false,
        SELECTED_GRID = null,
        SELECTED_KEY = null,
        ADDITIONAL_LAYERS = null,
        namespace = {},
        selectedMap,
        mapTypeSelected,
        $currentRows,
        singleton,
        clicked,
        opened,
        CHECKED_CLASS = 'checked',
        MapListControl,
        defaultDimension = {
            w: Math.max(MIN_WIDTH, Math.min($(window).width() * 0.8, 600)),
            h: Math.max(Math.min(MIN_HEIGHT, $(window).height() * 0.8, 500), 300)
        };
    function createDialogHtml() {
        return '<div class="map-dialog" id="' + MAP_DIALOG_ID + '">' +
            '<div class="padding-3">' +
            '<div class="top">' +
            '<div id="map-type-filter">' +
            '<ul>' +
            '<li><label><input class="' + CHECKED_CLASS + '" name="map-type" checked type="radio" value="all"/><span>Все</span></label></li>' +
            '<li><label><input name="map-type" type="radio" value="lan"/><span>Интернет</span></label></li>' +
            '<li><label><input name="map-type" type="radio" value="local"/><span>Оффлайн</span></label></li>' +
            '</ul>' +
            '</div>' +
            '<div class="map-controls">' +
            '<button class="gis-propertys-button" id="map-refresh"><span></span></button>' +
            '<button class="gis-propertys-button" id="map-control">Управление</button>' +
            '</div>' +
            '</div>' +
            '<div class="middle">' +
            '<div class="map-filter">' +
            '<input name="map-filter" type="text" placeholder="Фильтр" value=""/>' +
            '</div>' +
            '</div>' +
            '<div id="' + MAP_LIST_CONTAINER_ID + '"></div>' +
            '<div class="map-buttons">' +
            '<div class="right">' +
            '<button class="gis-propertys-button map-ok">Ок</button>' +
            '<button class="gis-propertys-button map-cancel">Отмена</button>' +
            '</div>' +
            '<div class="additional-buttons">' +
            '<button class="gis-propertys-button" id="map-additional">Дополнительные карты...</button>' +
            (Gis.Map.GridVisibilityChanged ? '<div class="grid-container"><button class="gis-propertys-button" id="map-grid">Без сетки</button></div>' : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    function sortMaps(maps) {
        maps.sort(function (a, b){
            var blower = b.title.toLowerCase(), alower = a.title.toLowerCase();
            return alower > blower ? 1 : alower < blower ? -1 : 0;
        });
    }
    function reselect () {
        $('li.selected', $mapListContainer).removeClass('selected');
        $(document.getElementsByClassName(gisMap.getSelectedMapKey())[0]).addClass('selected');
    }

    function getActions(currentMap) {
        return currentMap.getCustomLayers() ? '<span class="actions">' +
            '<button data-action="layers" class="action gis-propertys-button widget-control gis-button-layers layers"><span class="gis-button-icon" title="Слои"></span></button>' +
            '</span>' : '';
    }

    function createMapList(maps) {
        var list = '', selectedKey = gisMap.getSelectedMapKey(), className, currentMap, activeMapKey, prefix;
        activeMapKey = selectedKey;
        if (!clicked) {
            selectedMap = gisMap.getMap(selectedKey);
        } else {
            selectedKey = selectedMap.getKey();
        }
        if (maps) {
            sortMaps(maps);
            list = maps.reduce(function (previous, current) {
                className = selectedKey === current.key ? SELECTED_CLASS : '';
                currentMap = gisMap.getMap(current.key);
                className += ' gis-all';
                if (currentMap.isLocal()) {
                    className += ' gis-local';
                } else {
                    className += ' gis-lan';
                }
                className += ' ' + current.key;
//                prefix = activeMapKey === current.key ? '<span class="checkbox checked"></span>' : '';
                prefix = '';
                return previous + '<li class="map-element ' + className + '" data-key="' + current.key + '">' + prefix +
                    '<span class="name">' + current.title + '</span>' +
                    getActions(currentMap) +
                    '</li>';
            }, '');
        }
        return '<ul class="map-list data-list element-hover">' + list + '</ul>'
    }

    namespace.selectRow = function() {
        if (!this.classList.contains(SELECTED_CLASS)) {
            $('.' + SELECTED_CLASS, $mapListContainer).removeClass(SELECTED_CLASS);
            this.classList.add(SELECTED_CLASS);
            selectedMap = gisMap.getMap($(this).data('key'));
        }
    };

    namespace.revert = function () {
        if (SELECTED_KEY && clicked) {
            gisMap.getMap(SELECTED_KEY).setAdditionalLayers(ADDITIONAL_LAYERS);
            gisMap.setMapType(SELECTED_KEY, true);
            ADDITIONAL_LAYERS = null;
            SELECTED_KEY = null;
        }
        if (gisMap.switchGridVisibility) {
            if (!SELECTED_GRID) {
                gisMap.switchGridVisibility(gisMap.getSelectedGrid());
            } else if (SELECTED_GRID !== gisMap.getSelectedGrid()) {
                gisMap.switchGridVisibility(SELECTED_GRID);
            }
        }
    };
    namespace.doClick = function () {
        clicked = true;
        namespace.selectRow.call(this);
        checkLayersAvailable();
    };
    namespace.mapClicked = function () {
        namespace.doClick.call(this);
        if (!selectedMap || selectedMap.getKey() !== gisMap.getSelectedMapKey()) {
            gisMap.setMapType(getSelectedMapData(), true);
        }
    };
    namespace.actionClicked = function () {
        switch ($(this).data('action')) {
            case 'layers':
                singleton.showCustomLayersDialog(gisMap.getMap($(this).parents('.map-element').data('key')));
                break;
        }
        return false;
    };

    function closeDialogs() {
        $dialog.dialog('close');
    }

    function getSelectedMapData() {
        return selectedMap;
    }
    namespace.typeFilterClicked = function () {
        var $this = $(this);
        mapTypeSelected = $this.val();
        if (!$this.hasClass(CHECKED_CLASS)) {
            $('.' + CHECKED_CLASS, $mapTypeFilter).removeClass(CHECKED_CLASS);
            $this.addClass(CHECKED_CLASS);
        }
        filter();
    };

    function doFilter () {
        var text = $mapFlter.val().toLowerCase(),
            $filtered = $currentRows.filter(function () {
                return $(this).data('filter-index').indexOf(text) > -1 && isRowTypeOk(this);
            }).css({
                display: 'block'
            });
        $currentRows.not($filtered).css({
            display: 'none'
        });
    }
    function getMapTypeSelected() {
        if (!mapTypeSelected) {
            mapTypeSelected = $('.' + CHECKED_CLASS, $mapTypeFilter).val();
        }
        return mapTypeSelected;
    }
    function isRowTypeOk(row) {
        return $(row).hasClass('gis-' + getMapTypeSelected());
    }
    function tileLayerChanged () {
        singleton.replaceMaps();
    }
    function checkLayersAvailable () {
        $mapAdditional[gisMap.getMapList(selectedMap).length ? 'removeClass' : 'addClass']('disabled');
    }

    function filter() {
        doFilter();
    }

    function saveDimension() {
        var parent = $dialog.parent(),
            position = parent.position();
        Gis.Preferences.setPreferenceData(DLG_DIMENSION, {
            width: parent.outerWidth(),
            height: parent.outerHeight(),
            position: {my: 'left+' + position.left + ' top+' + position.top, at: 'left top'}
        });
    }
    function getSavedDimension() {
        return Gis.Preferences.getPreferenceData(DLG_DIMENSION);
    }

    namespace.animateButton = function() {
        var $this = $(this), evt = 'webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionEnd',
            evtend = function () {
                $this.off(evt, evtend);
                $this.removeClass('animate').removeClass('rotated');
            };
        if (!$this.hasClass('animate')) {
            $this.addClass('animate');
            Gis.requestAnimationFrame(50)(function () {
                $this.addClass('rotated');
                $this.on(evt, evtend);
            });
        }
    };

    /**
     * Контролл карты
     * @class
     * @extend Gis.BaseClass
     */
    MapListControl = Gis.BaseClass.extend(
        /**
         * @lends MapListControl#
         */
        {
            defaultDialogOptions: {
                closeOnEscape: true,
                autoOpen: false,
                modal: false,
                resizable: true,
                draggable: true,
                minHeight: MIN_HEIGHT,
                minWidth: MIN_WIDTH,
                position: {my: 'left+50 top+50', at: "left top", of: window },
                width: defaultDimension.w,
                height: defaultDimension.h,
                dialogClass: 'shadow'
            },
            _createDialog: function () {
                var self = this, savedDimension = getSavedDimension() || {};
                if (!$dialog) {
                    $dialog = $(createDialogHtml());
                    $dialog.dialog(Gis.Util.extend({}, this.defaultDialogOptions, savedDimension, {
                        title: 'Выбор карты',
                        open: function () {
                            $('#gis-select-map').addClass('active');
                            gisMap.on('maplistchanged', self.mapListChanged, self);
                            gisMap.on('tilelayerchanged', reselect, this);
                            if (Gis.Map.GridVisibilityChanged) {
                                gisMap.on(Gis.Map.GridVisibilityChanged.TYPE, self.mapTypeChanged, self);
                            }
                            opened = true;
                            SELECTED_GRID = gisMap.getSelectedGrid && gisMap.getSelectedGrid();
                            SELECTED_KEY = gisMap.getSelectedMapKey();
                            ADDITIONAL_LAYERS = gisMap.getMap(SELECTED_KEY).getAdditionalLayers();
                        },
                        close: function () {
                            $('#gis-select-map').removeClass('active');
                            gisMap.off('maplistchanged', self.mapListChanged, self);
                            gisMap.off('tilelayerchanged', reselect, this);
                            if (Gis.Map.GridVisibilityChanged) {
                                gisMap.off(Gis.Map.GridVisibilityChanged.TYPE, self.mapTypeChanged, self);
                            }
                            self.fire('close');
                            self.closeGrids();
                            opened = false;
                        },
                        beforeClose: function () {
                            saveDimension();
                        }
                    })
                    );
                    $mapTypeFilter = $('#map-type-filter', $dialog);
                    $mapFlter = $('.map-filter input', $dialog);
                    $mapAdditional = $('#map-additional', $dialog);
                    $mapListContainer = $('#' + MAP_LIST_CONTAINER_ID, $dialog);
                    $mapListContainer.on('click', 'li.map-element', namespace.mapClicked);
                    $mapListContainer.on('click', '.action', namespace.actionClicked);
                    $dialog.on('click', '.map-ok', function () {
                        closeDialogs();
                    });
                    $mapListContainer.on('dblclick', '.map-list > li', function () {
                        if (gisMap.getMapList(selectedMap).length) {
                            self.showSecondDialog(selectedMap);
                        }
                        return false;
                    });
                    $dialog.on('click', '.map-cancel', function () {
                        namespace.revert();
                        closeDialogs();
                    });
                    $dialog.on('click', '#map-control', function () {
                        location.href = 'tmtsm://open';
                        return false;
                    });
                    $dialog.on('click', '#map-refresh', function () {
                        namespace.animateButton.call($('span', this));
                        gisMap.loadTileMapsData();
                    });
                    $dialog.on('click', '#map-additional', function () {
                        if (!$(this).hasClass('disabled')) {
                            self.showSecondDialog(selectedMap);
                        }
                    });
                    if (Gis.Map.GridVisibilityChanged) {
                        $dialog.on('click', '#map-grid', function () {
                            if (!$(this).hasClass('disabled')) {
                                if ($(this).hasClass('selected')) {
                                    self.closeGrids();
                                } else {
                                    self.showGrid(this);
                                }
                            }
                            return false;
                        });
                    }
                    $dialog.on('input', '.map-filter input', filter);
                    $mapTypeFilter.on('click', 'input', namespace.typeFilterClicked);
                    this.closeGrids = function () {
                        $('#map-grid', $dialog).removeClass('selected');
                        if (self._grids) {
                            self._grids.remove();
                        }
                        $(document.body).off('click', self.closeGrids);
                    };
                }
            },
            close: function () {
                closeDialogs();
            },
            gridName: function (key) {
                var names = {};
                names[Gis.Map.GRID_TYPES.KILOMETR] = 'Километровая сетка';
                names[Gis.Map.GRID_TYPES.NOMENCLATE] = 'Номенклатурная сетка';
                names[Gis.Map.GRID_TYPES.GRAD] = 'Градусная сетка';
                return names[key] || key;
            },
            mapTypeChanged: function () {
                $('#map-grid', $dialog).text(this.gridName(gisMap.getSelectedGrid()) || 'Без сетки');
            },
            showGrid: function (button) {
                this.closeGrids();
                var grids = '<ul class="grid-list">', selected, self = this;
                selected = !gisMap.getSelectedGrid() ? 'selected' : '';
                grids += '<li class="' + selected + '" data-key="-1">Без сетки</li>';
                for (var key in Gis.Map.GRID_TYPES) {
                    if (Gis.Map.GRID_TYPES.hasOwnProperty(key)) {
                        selected = gisMap.getSelectedGrid() === Gis.Map.GRID_TYPES[key] ? 'selected' : '';
                        grids += '<li class="' + selected + '" data-key="' + key + '">' + this.gridName(Gis.Map.GRID_TYPES[key]) + '</li>';
                    }
                }
                grids += '</ul>';
                this._grids = $(grids);
                $(document.body).append(this._grids);
                $(document.body).on('click', this.closeGrids);
                this._grids.on('click', 'li', function() {
                    if (!$(this).hasClass('selected')) {
                        var gridtypes = Gis.Map.GRID_TYPES[$(this).data('key')];
                        gisMap.switchGridVisibility(gridtypes || gisMap.getSelectedGrid());
                        self.mapTypeChanged();
                    }
                    self.closeGrids();
                    return false;
                });
                $(button).addClass('selected');
                this._grids.menu();
                this._grids.css({
                    left: $(button).offset().left,
                    top: $(button).offset().top + $(button).outerHeight() + 2
                });
            },
            isOpened: function () {
                return opened;
            },
            getMap: function () {
                return gisMap;
            },
            setClicked: function (cl) {
                clicked = cl;
            },
            initialize: function () {
                this._createDialog();
                singleton = this;
            },
            _activateMapList: function () {
                this._activateList($mapListContainer);
                $currentRows = $('li.map-element', $mapListContainer);
                $currentRows.each(function () {
                    $(this).data('filter-index', $('span.name', this).html().toLowerCase());
                });
            },
            _activateList: function (container) {
//                $(">ul", container).menu({
//                    role: 'listbox'
//                });
            },
            setMap: function (map) {
                gisMap = map;
            },
            setControlAvailable: function (avail) {
                isCanControlMaps = avail;
                $('#map-control', $dialog).css({
                    display: (gisMap && gisMap.getLocalTMS() && avail) ? 'inline-block' : 'none'
                })
            },
            mapListChanged: function() {
                this.replaceMaps();
            },
            replaceMaps: function (maps) {
                maps = maps || gisMap.getMapList();
                $mapListContainer.html(createMapList(maps));
                this._activateMapList();
                checkLayersAvailable();
                filter();
            },
            open: function (maps) {
                clicked = false;
                if (gisMap != null) {
                    this.replaceMaps(maps);
                    $dialog.dialog('open');
                } else {
                    throw new Error("Need Gis.Map object to be set Gis.MapListControl.setMap");
                }
            }
        });
    Gis.mapListControl = function () {
        return singleton || new MapListControl();
    };
    Gis.mapListControl.include = function (o) {
        MapListControl.include(o);
    };
}(this || self));