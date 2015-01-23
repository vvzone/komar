(function (global) {
    'use strict';
    var $dialogAdditional,
        MAP_DIALOG_ADDITIONAL_ID = "map-dialog-additional",
        DLG_DIMENSION = "map-dialog-additional-dimension",
        MAP_LIST_CONTAINER_ADDITIONAL_ID = "map-list-container-additional",
        $sliderOpacity,
        $sliderOpacityContainer,
        $mapListContainerAdditional,
        namespace = {},
        parentSelectedMap,
        gisMap,
        singleton,
        MapListControlAdditional,
        saveTimeout;
    function createSliderHtml () {
        return "<div id='layer-opacity-slider'> </div>";
    }
    function createDialogHtmlAdditional() {
        return '<div id="' + MAP_DIALOG_ADDITIONAL_ID + '">' +
            '<div class="padding-3">' +
            '<div class="map-text">' +
            'Основная карта: <span class="map-name"></span>' +
            '<div>Проекция: <span class="map-projection"></span></div>' +
            '</div>' +
            '<div id="' + MAP_LIST_CONTAINER_ADDITIONAL_ID + '"></div>' +
            '<div class="map-buttons">' +
            '<div class="right">' +
            '<button class="gis-propertys-button map-ok">Ок</button>' +
            '<button class="gis-propertys-button map-cancel">Отмена</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    function sortMaps(maps) {
        maps.sort(function (a, b){
            var savedA = parentSelectedMap.getAdditionalLayerInfo(a),
                savedB = parentSelectedMap.getAdditionalLayerInfo(b),
                blower = b.title.toLowerCase(), alower = a.title.toLowerCase();
            if (savedA && !savedB) {
                return -1;
            }
            if (!savedA && savedB) {
                return 1;
            }
            if (savedA && savedB) {
                return savedA.order - savedB.order;
            }
            return alower > blower ? 1 : alower < blower ? -1 : 0;
        });
    }
    namespace.createMapListAdditional = function(maps) {
        var list = '', currentMap, saved;
        if (maps) {
            sortMaps(maps);
            list = maps.reduce(function (previous, current) {
                currentMap = singleton.getMap().getMap(current.key);
                saved = parentSelectedMap.getAdditionalLayerInfo(current.key);
                return previous + '<li data-key="' + current.key + '">' +
                    '<span class="up"></span>' +
                    '<span class="down"></span>' +
                    '<span class="gis-propertys-button opacity">' + Math.round(((saved && saved.opacity) || 1) * 100) + '</span>' +
                    '<span class="checkbox ' + (saved && saved.checked ? 'checked' : '') + '"></span>' +
                    '<span class="name">' + current.title + '</span>' +
                    '</li>';
            }, '');
        }
        return '<ul class="map-list data-list element-hover">' + list + '</ul>'
    };

    function tileLayerChanged () {
        //todo
    }
    function setSliderVisibility(visibility) {
        $sliderOpacityContainer[visibility ? 'addClass' : 'removeClass']('visible');
        if (!Gis.DomUtil.isCssTransform()) {
            $sliderOpacityContainer.css('display', visibility ? 'block' : 'none');
        }
        if (!visibility) {
            cleanSlider();
        }
    }
    function close() {
        $dialogAdditional.dialog('close');
    }
    function switchSlideAnimation(slide) {
        $('.ui-slider-handle', $sliderOpacity)[slide ? 'addClass' : 'removeClass']('animation');
    }

    function initSlider() {
        $sliderOpacity = $(createSliderHtml());
        $sliderOpacityContainer = $("<div class='slider-opacity-container'></div>");
        $sliderOpacityContainer.append($sliderOpacity);
        $dialogAdditional.append($sliderOpacityContainer);
        $sliderOpacityContainer.on('click', function () {
            return false;
        });
        $sliderOpacity.slider({
            min: 0,
            max: 100,
            orientation: "vertical"
        });
        switchSlideAnimation(true);
        $sliderOpacity.on('slidestart', function () {
            switchSlideAnimation(false);
        }).on('slidestop', function () {
            switchSlideAnimation(true);
        });
        setSliderVisibility(false);
    }

    function cleanSlider() {
        $('.slider', $mapListContainerAdditional).removeClass('slider');
        $sliderOpacity.off('slide');
    }

    namespace.opacityClick = function() {
        var $this = $(this), layer, offset, offset2;
        if ($this.hasClass('slider')) {
            setSliderVisibility(false);
        } else {
            cleanSlider();
            $this.addClass('slider');
            $sliderOpacity.slider('value', parseInt($this.text(), 10));
            $sliderOpacity.on('slide', function (e, ui) {
                $this.html(ui.value);
            });
            setSliderVisibility(true);
            offset = $(this).offset();
            offset2 = $dialogAdditional.offset();
            $sliderOpacityContainer.css({
                top: offset.top - offset2.top
            });
        }
        return false;
    };

    function getCheckedLayers() {
        var $list = $('li', $mapListContainerAdditional), maps;
        if ($('.checked', $list).length) {
            maps = [];
            $list.each(function (index) {
                maps.push({
                    key: $(this).data('key'),
                    order: index,
                    opacity: parseInt($('.opacity', this).text(), 10) / 100,
                    checked: $('.checked', this).length
                });
            });
        }
        return maps;
    }

    namespace.saveMap = function () {
        parentSelectedMap.setAdditionalLayers(getCheckedLayers());
        gisMap.setMapType(gisMap.getSelectedMapKey(), true);
        close();
    };

    function initEvents() {
        $mapListContainerAdditional.on('click', '.checkbox', function () {
            $(this).toggleClass('checked');
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
        });
        $dialogAdditional.on('dblclick', '.map-list li', function () {
            $('.checkbox', this).toggleClass('checked');
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
            saveTimeout = setTimeout(function () {
                namespace.saveMap();
            }, 200);
        });
        $dialogAdditional.on('click', '.map-ok', namespace.saveMap);
        $dialogAdditional.on('click', '.map-cancel', function () {
            if (saveTimeout) {
                clearTimeout(saveTimeout);
            }
            close();
        });
        $mapListContainerAdditional.on('click', '.opacity', namespace.opacityClick);
        $mapListContainerAdditional.on('click', '.up', function () {
            var $parent = $(this).parent(),
                prev = $parent.prev();
            if (prev) {
                $parent.insertBefore(prev);
            }
        });
        $mapListContainerAdditional.on('click', '.down', function () {
            var $parent = $(this).parent(),
                next = $parent.next();
            if (next) {
                $parent.insertAfter(next);
            }
        });
        $mapListContainerAdditional.on('mousedown', 'li', function () {
            var $this = $(this),
                funcClean = function () {
                    $this.removeClass('selected');
                    $(document.body).off('mouseup', funcClean);
                };
            $this.addClass('selected');
            $(document.body).on('mouseup', funcClean);
        });
    }

    function saveDimension() {
        var parent = $dialogAdditional.parent(),
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
    var hideSliderOpacity = function () {
        setSliderVisibility(false);
    };
    MapListControlAdditional = {
        _createDialogSecond: function () {
            var self = this;
            var savedDimension = getSavedDimension() || {};
            if (!$dialogAdditional) {
                $dialogAdditional = $(createDialogHtmlAdditional());
                $dialogAdditional.dialog(Gis.Util.extend({}, this.defaultDialogOptions, {
                    title: 'Выбор дополнительных карт',
                    position: {my: 'left+80 top+80', at: "left top", of: window },
                    open: function () {
                        gisMap = self.getMap();
                        $(document.body).on('click', hideSliderOpacity);
                    },
                    close: function () {
                        setSliderVisibility(false);
                        $(document.body).off('click', hideSliderOpacity);
                    },
                    beforeClose: function () {
                        saveDimension();
                    }
                }, savedDimension)
                );
                initSlider();
                $mapListContainerAdditional = $('#' + MAP_LIST_CONTAINER_ADDITIONAL_ID, $dialogAdditional);
                initEvents();
            }
        },
        initialize: function (_super) {
            _super();
            singleton = this;
            this._createDialogSecond();
            this.on('close', close);
        },
        _activateMapListAdditional: function () {
            this._activateList($mapListContainerAdditional);
            $('>ul', $mapListContainerAdditional).sortable({
                axis: 'y',
                containment: 'parent',
                placeholder: "sortable-placeholder"
            });
        },
        replaceMapsAdditional: function (maps) {
            maps = maps || this.getMap().getMapList(parentSelectedMap);
            if (maps) {
                $mapListContainerAdditional.html(namespace.createMapListAdditional.call(this, maps));
                singleton._activateMapListAdditional();
            }
        },
        showSecondDialog: function (selectedMap) {
            parentSelectedMap = selectedMap;
            this.setClicked(false);
            if (this.getMap() != null) {
                this.replaceMapsAdditional();
                $('span.map-name', $dialogAdditional).html(parentSelectedMap.getTitle());
                $('span.map-projection', $dialogAdditional).html(parentSelectedMap.getCrs().getCode());
                $dialogAdditional.dialog('open');
            } else {
                throw new Error("Need Gis.Map object to be set Gis.MapListControl.setMap");
            }
        }
    };
    Gis.mapListControl.include(MapListControlAdditional);
}(this || self));