/**
 * Created by vkmar_000 on 22.12.14.
 */
(function () {
    'use strict';
    function isNeedLoaders() {
        var object = Gis.config(L.TileWithLoader.CONFIG_KEY, L.TileWithLoader.CORNER_LOADER);
        return object === L.TileWithLoader.FULL_LOADER || object === L.TileWithLoader.TILE_LOADER;
    }

    var TileWithLoader = function (size) {
        if (isNeedLoaders()) {
            this.tile = L.DomUtil.create('img', '');
            this.div = L.DomUtil.create('div', 'leaflet-tile image-loader');
            this._mainBlock = this.div;
            this.div.style.width = this.div.style.height = size + 'px';
            this.div.appendChild(this.tile);
        } else {
            this.tile = L.DomUtil.create('img', 'leaflet-tile');
            this._mainBlock = this.tile;
        }
        this.tile.container = this;
        Object.defineProperty(this, 'src', {
            get: function() {
                return this.tile.src;
            },
            set: function(src) {
                this.tile.src = src;
            }
        });
        Object.defineProperty(this, 'parentNode', {
            get: function() {
                return this._mainBlock.parentNode;
            },
            set: function(src) {
                this.tile.parentNode = src;
            }
        });
    };
    TileWithLoader.prototype.setStyle = function (style, value) {
//        $(this.tile).css(style);
        $(this._mainBlock).css(style, value);
    };
    TileWithLoader.prototype.removeClass = function (className) {
//        L.DomUtil.removeClass(this.tile, className);
        L.DomUtil.removeClass(this._mainBlock, className);
    };
    TileWithLoader.prototype.addClass = function (className) {
//        L.DomUtil.addClass(this.tile, className);
        L.DomUtil.addClass(this._mainBlock, className);
    };
    TileWithLoader.prototype.removeFrom = function () {
        if (this._mainBlock.parentNode) {
            this._mainBlock.parentNode.removeChild(this._mainBlock);
        }
    };
    TileWithLoader.prototype.appendTo = function (parent) {
        var div = this._mainBlock;
        parent.appendChild(div);
        setTimeout(function () {
            Gis.requestAnimationFrame(10)(function () {
                div.classList.add('showed');
            });
        }, 50);
    };
    TileWithLoader.prototype.showImg = function () {
        this.addClass('leaflet-tile-loaded');
        this.removeClass('image-loader');
    };
    TileWithLoader.prototype.load = function (src) {
        this.tile.src = src;
    };
    TileWithLoader.prototype.setData = function (key, data) {
        this.tile[key] = data;
        if (this.div) {
            this.div[key] = data;
        }
    };
    TileWithLoader.prototype.setPosition = function (tilePos, chrome) {
        L.DomUtil.setPosition(this._mainBlock, tilePos, chrome);
    };
    TileWithLoader.prototype.addEventListener = function (type, callback) {
        L.DomEvent.addListener(this.tile, type, callback);
        if (this.div) {
            L.DomEvent.addListener(this.div, type, callback);
        }
    };
    TileWithLoader.prototype.removeEventListener = function (type, callback) {
        L.DomEvent.removeListener(this.tile, type, callback);
        if (this.div) {
            L.DomEvent.removeListener(this.div, type, callback);
        }
    };
    TileWithLoader.prototype.setOpacity = function (opacity) {
        L.DomUtil.setOpacity(this._mainBlock, opacity);
    };
    TileWithLoader.prototype.notChildOf = function (parent) {
        return this._mainBlock.parentNode !== parent;
    };
    L.TileWithLoader = TileWithLoader;
    L.tileWithLoader = function (size) {
        return new TileWithLoader(size);
    };
    L.TileWithLoader.NO_LOADER = 0;
    L.TileWithLoader.FULL_LOADER = 1;
    L.TileWithLoader.TILE_LOADER = 2;
    L.TileWithLoader.CORNER_LOADER = 3;
    L.TileWithLoader.CONFIG_KEY = 'show-tile-loaders';
}());