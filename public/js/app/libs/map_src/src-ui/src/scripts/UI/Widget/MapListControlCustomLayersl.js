(function (global) {
    'use strict';
    var DIALOG_ID = 'map-custom-layers',
        DLG_DIMENSION = "map-dialog-layers-dimension",
        DIALOG_LIST_ID = 'map-custom-layers-list',
        $mapListContainer,
        $dialog,
        gisMap,
        parentSelectedMap,
        singleton;
    function createDialogHtml() {
        return '<div class="map-custom-layers" id="' + DIALOG_ID + '">' +
            '<div class="padding-3">' +
            '<div class="map-text">' +
            'Карта: <span class="map-name"></span>' +
            '</div>' +
            '<div class="a-list" id="' + DIALOG_LIST_ID + '"></div>' +
            '<div class="map-buttons">' +

            '<div class="left">' +
            this.switcherHtml() +
            '</div>' +

            '<div class="right">' +
            '<button class="gis-propertys-button map-ok">Ок</button>' +
            '<button class="gis-propertys-button map-cancel">Отмена</button>' +
            '</div>' +

            '</div>' +
            '</div>' +
            '</div>';
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

    /**
     *
     * @param {Array.<Gis.TmsLayer.CustomLayer>} layers
     */
    function sort(layers) {
        layers.sort(
            /**
             *
             * @param {Gis.TmsLayer.CustomLayer} a
             * @param {Gis.TmsLayer.CustomLayer} b
             * @returns {number}
             */
            function (a, b){
                var blower = b.name.toLowerCase(), alower = a.name.toLowerCase();
                return alower > blower ? 1 : alower < blower ? -1 : 0;
        });
    }
    /**
     *
     * @param {Array.<Gis.TmsLayer.CustomLayer>} layers
     * @returns {string}
     */
    function createList (layers, allSelected) {
        var list = '', saved;
        if (layers) {
            sort(layers);
            list = layers.reduce(function (previous, current) {
                saved = allSelected || parentSelectedMap.isCustomLayerActive(current.index);
                return previous + '<li class="layer" data-index="' + current.index + '">' +
                    '<span class="checkbox ' + (saved ? 'checked' : '') + '"></span>' +
                    '<span class="name">' + current.name + '</span>' +
                    '</li>';
            }, '');
        }
        return '<ul class="map-list data-list element-hover">' + list + '</ul>'
    }

    function close() {
        $dialog.dialog('close');
    }

    function getCheckedLayers() {
        var $list = $('.layer', $mapListContainer), layers = [];
        if ($('.checked', $list).length) {
            $list.each(function (index) {
                if ($('.checked', this).length) {
                    layers.push(parseInt($(this).data('index'), 10));
                }
            });
        }
        return layers;
    }
    function save () {
        parentSelectedMap.setActiveCustomLayers(getCheckedLayers());
        if (gisMap.getSelectedMapKey() === parentSelectedMap.getKey()) {
            gisMap.setMapType(gisMap.getSelectedMapKey(), true);
        }
        close();
    }
    function initEvents() {
        $mapListContainer.on('click', '.layer', function () {
            $('.checkbox', this).toggleClass('checked');
            singleton.fire('change');
//            if (saveTimeout) {
//                clearTimeout(saveTimeout);
//            }
        });
        $dialog.on('click', '.map-ok', save);
        $dialog.on('click', '.map-cancel', function () {
            close();
        });
        this.initSwitcherEvents();
        this.on('change', function () {
            this._updateCheckedState();
        }, this);
    }

    var MapListControlCustomLayers = {
        _initDialogLayers: function () {
            var self = this;
            var savedDimension = getSavedDimension() || {};
            if (!$dialog) {
                $dialog = $(createDialogHtml.call(this));
                $dialog.dialog(Gis.Util.extend({}, this.defaultDialogOptions, {
                    title: 'Выбор слоев',
                    position: {my: 'left+80 top+80', at: "left top", of: window },
                    open: function () {
                        gisMap = self.getMap();

                    },
                    close: function () {
                    },
                    beforeClose: function () {
                        saveDimension();
                    }
                }, savedDimension)
                );
                $mapListContainer = $('#' + DIALOG_LIST_ID, $dialog);
                this.setSwitchContainer($dialog, $mapListContainer);
                initEvents.call(this);
            }
        },
        initialize: function (_super) {
            _super();
            singleton = this;
            this._initDialogLayers();
            this.on('close', close);
        },
        replaceCustomLayers: function (layers) {
            layers = layers || parentSelectedMap.getCustomLayers();
            if (layers) {
                $mapListContainer.html(createList(layers, parentSelectedMap.isAllCustomLayersSelected()));
                singleton.fire('change');
//                singleton._activateMapListAdditional();
            }
        },
        showCustomLayersDialog: function (selectedMap) {
            parentSelectedMap = selectedMap;
            this.setClicked(false);
            if (this.getMap() != null) {
                this.replaceCustomLayers();
                $('span.map-name', $dialog).html(parentSelectedMap.getTitle());
                $dialog.dialog('open');
            } else {
                throw new Error("Need Gis.Map object to be set Gis.MapListControl.setMap");
            }
        }
    }
    Gis.mapListControl.include(MapListControlCustomLayers);
    Gis.mapListControl.include(Gis.checkAll);
}(this || self));