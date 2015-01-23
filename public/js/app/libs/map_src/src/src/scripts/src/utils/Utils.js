/**
 * Created with JetBrains PhpStorm.
 */
(function (global) {
    "use strict";
    Gis.SK_AUTOZONE = null;
    var animationFrame = global.requestAnimationFrame       ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame,
        IS_FILE_PROTOCOL = !location.href.indexOf('file:/');
    Gis.requestAnimationFrame =function (time) {
        return  animationFrame    ||
            function( callback ){
                global.setTimeout(callback, time);
            };
    };

    var menu_reduce_callback = function (oldVal, newVal) {
        return oldVal + '<li data-action="' + newVal + '"><span>' + newVal + '</span></li>';
    };
    Array.prototype.compare = Array.prototype.compare || function(arr) {
        if (this.length != arr.length) return false;
        for (var i = 0; i < arr.length; i++) {
            if (this[i].compare) {
                if (!this[i].compare(arr[i])) return false;
            }
            if (this[i] !== arr[i]) return false;
        }
        return true;
    };
    function s4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    Gis.Util = {
        rotate: function (point, angle) {
            var angleDeg = -angle * Math.PI / 180;
            return L.point(point.x * Math.cos(angleDeg) - point.y * Math.sin(angleDeg),
                point.x * Math.sin(angleDeg) + point.y * Math.cos(angleDeg)
            );
        },
        isInFixedZoneBounds: function (latitude) {
            var maxBound, minBound;
            if (!Gis.Util.isNumeric(Gis.SK_AUTOZONE)) {
                return false;
            }
            maxBound = Gis.SK_AUTOZONE * 6 + 1;
            minBound = maxBound - 8;
            return (latitude >= minBound && latitude <= (minBound + 1))
                || (latitude < maxBound && latitude >= (maxBound - 1));
        },
        getZoneFromLongitude: function (x) {
            var isOnBound = this.isInFixedZoneBounds(x);
            var autoCalculatedZone = Math.floor((Gis.Projection.absLongitude(x) % 360) / 6 + 1);
            return isOnBound ?
                (Gis.Util.isNumeric(Gis.SK_AUTOZONE) ? Gis.SK_AUTOZONE : autoCalculatedZone) :
                autoCalculatedZone;
        },
        /** usage - Gis.Util.extend(extendable[, obj2, ...])
         * extend extendable by props from  obj2 ...
         * @param {object} extendable - object to extend
         * */
        extend: function (extendable) {
            var sources = Array.prototype.slice.call(arguments, 1),
                i,
                j,
                len,
                src;

            for (j = 0, len = sources.length; j < len; j += 1) {
                src = sources[j] || {};
                for (i in src) {
                    if (src.hasOwnProperty(i)) {
                        extendable[i] = src[i];
                    }
                }
            }
            return extendable;
        },
        fill: function (extendable) {
            var sources = Array.prototype.slice.call(arguments, 1),
                i,
                j,
                len,
                src;
            for (j = 0, len = sources.length; j < len; j += 1) {
                src = sources[j] || {};
                for (i in src) {
                    if (src.hasOwnProperty(i) && extendable.hasOwnProperty(i)) {
                        extendable[i] = src[i];
                    }
                }
            }
            return extendable;
        },
        /**
         * Create new object from prototype
         * @param {object} proto prototype of class
         * @returns {object} new object
         * */
        inherit: function (proto) {
            if (proto === null) {
                throw new TypeError();
            }
            if (Object.create) {
                return Object.create(proto);
            }
            var t = typeof proto;
            if (t !== "object" && t !== "function") {
                throw new TypeError();
            }
            function F() {}
            F.prototype = proto;

            return new F();
        },
        /**
         * Define subclass
         * @param {Function | object} superclass superclass of constructor
         * @param {object} methods instance methods
         * @param {object} statics static methods
         * @returns {Function} constructor of class
         * */
        defineSubclass: function (superclass,
                                  methods,
                                  statics) {
            var F = function () {
                if (this.initialize) {
                    this.initialize.apply(this, arguments);
                }
            };

            if (statics) {
                F = Gis.Util.extend(F, statics);
            }
            F.include = function (data) {
                var init, initialize;
                if (data.options) {
                    Gis.Util.extend(F.prototype.options, data.options);
                    delete data.options;
                }
                if (data.initialize) {
                    init = F.prototype.initialize;
                    initialize = data.initialize;
                    F.prototype.initialize = function () {
                        var self = this, args = arguments;
                        initialize.call(this, function () {
                            init.apply(self, args);
                        });
                    }
                    delete data.initialize;
                }
                Gis.Util.extend(F.prototype, data);
            };
            F.prototype = Gis.Util.inherit(superclass.prototype);
            F.prototype.constructor = F;
            F.prototype._super = superclass.prototype;
            // mix includes into the prototype, from Leaflet
            if (methods.includes) {
                Gis.Util.extend.apply(null, [methods].concat(methods.includes));
                delete methods.includes;
            }
            if (methods.options) {
                methods.options = Gis.Util.extend({}, F.prototype.options, methods.options);
            }
            if (methods) {
                Gis.Util.extend(F.prototype, methods);
            }
            return F;
        },

        /**
         * split words to array (from @link http://leafletjs.com/)
         * @param {string} str string to split by space
         * @returns {Array} array of splitted words
         * */
        splitWords: function (str) {
            return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
        },
        /**
         * From leaflet
         * @param num
         * @param digits
         * @returns {number}
         */
        formatNum: function (num, digits) {
            var pow = Math.pow(10, digits || 5);
            return Math.round(num * pow) / pow;
        },
        gradToRad: function (grad) {
            return grad * (Math.PI / 180);
        },
        radToGrad: function (rad) {
            return rad * (180 / Math.PI);
        },
        generateGUID: function () {
            return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() +  s4() + s4());
        },
        checkGUID: function (id) {
            var regexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i,
                match;
            match = id && id.match && id.match(regexp);
            return match && match.length === 1;
        },
        compareArrays: function (array1, array2) {
            if (!this.isDefine(array1) || !this.isDefine(array2)) {
                return false;
            }
            var i, arrLen = array1.length;
            if (arrLen !== array2.length) {
                return false;
            }
            for (i = 0; i < arrLen; i += 1) {
                if (array1[i] instanceof Array && array2[i] instanceof Array) {   //Compare arrays
                    if (!array1[i].compare(array2[i])) {
                        return false;
                    }
                } else if (array1[i] !== array2[i]) {
                    return false;
                }
            }
            return true;
        },
        /**
         * Удаляет символ @charToTrim если он последний в строке @string
         * @param {String} string обрабатываемая строка
         * @param {String} [charToTrim=" "] отсекаемый символ
         * @returns {String}
         */
        lastTrim: function (string, charToTrim) {
            charToTrim = Gis.Util.isDefine(charToTrim) ? charToTrim : " ";
            if (string[string.length - 1] === charToTrim) {
                string = string.substr(0, string.length - 1);
            }
            return string;
        },
        isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj);
        },
        isFunction: function (value) {
            return typeof value === 'function';
        },
        isArray: function (value) {
            return value && Object.prototype.toString.call(value).toLowerCase().indexOf('array') > -1;
        },
        createMenuList: function (associative) {
            var html = '<ul>', val, div;
            for (var key in associative) {
                if (associative.hasOwnProperty(key)) {
                    val = associative[key];
                    if (val) {
                        if (this.isArray(val) && val.length) {
                            html += '<li class="with-sub-menu"><span>' + key + '</span><ul class="gis-custom-action-list">' + val.reduce(menu_reduce_callback, '') + '</ul></li>';
                        } else {
                            html += '<li data-action="' + val + '"><span>' + key + '</span></li>';
                        }
                    }
                }
            }
            html += '</ul>';
            div = document.createElement('div');
            div.classList.add('context-menu');
            div.classList.add('gis-custom-action-list-container');
            div.innerHTML = html;
            return div;
        },
        toFixed: function (value, digits) {
            return value.toFixed ? value.toFixed(digits) : (parseFloat(value).toFixed(digits));
        },
        isDefine: function (value) {
            return value != undefined && value != null;
        },
        isAwesomium: function () {
            return navigator.userAgent.toLowerCase().indexOf("awesomium") > -1;
        },
        isCellNet: function () {
            return this.isDefine(global.cellnet);
        },
        isString: function (data) {
            return this.isDefine(data) && (typeof data).toLowerCase() === 'string';
        },
        fillMapFromObject: function (map, objectData) {
            var i, len;
            function addObject (map, object) {
                try {
                    var existsLayer = map.getLayer(object.id);
                    if (object.tags && object.tags.creator) {
                        object.tags.creator = map.getSetting('creator');
                    }
                    object.id = Gis.Util.generateGUID();
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
            for (i = 0, len = objectData.length; i < len; i += 1) {
                addObject(map, objectData[i]);
            }
        },
        /**
         * работаем по протоколу file://
         * @returns {boolean}
         */
        isFileProtocol: function () {
            return IS_FILE_PROTOCOL;
        }
    };
    Gis.Util.loadKinetic = function (callbackOk, callbackError) {
        require([Gis.config('relativePath') + "scripts/kinetic.min"], function (Kinetic) {
            if (callbackOk) {
                callbackOk(Kinetic);
            }
        }, function () {
            if (callbackError) {
                callbackError();
            }
        });
    };
    Gis.extend = Gis.Util.extend;
}(this));