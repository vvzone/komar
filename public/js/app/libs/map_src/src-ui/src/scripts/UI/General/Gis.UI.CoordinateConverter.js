/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Технологии
 */
//TODO много букв. порефакторить
"use strict";
(function (Gis) {
    var SELECTED_SYSTEM_PREFS_KEY = "current-selected-coordinate-system",
        DEFAULT_SYSTEM = 'wgs84',
        DEFAULT_SELECTED_SYSTEM = DEFAULT_SYSTEM;
    /**
     * @param i
     * @param [longlat]
     * */
    function getDauumName(i, longlat) {
        return 'GAUSZONE' + i + (longlat ? 'LATLNG' : '') + '';
    }

    for (var i = 1; i < 61; i += 1) {
        proj4.defs(getDauumName(i), '+proj=tmerc +lat_0=0 +lon_0=' + (i * 6 - 3) + ' +k=1 +x_0=' + i + '500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,-0.000000096963,0.000001212034,0.000000630258,1.0 +units=m +no_defs');
        proj4.defs(getDauumName(i, true), '+proj=longlat +ellps=krass +towgs84=23.9,-141.3,-80.9,0,-0.37,-0.85,-0.12');
    }
    proj4.defs("EPSG:4923", "+proj=longlat +a=6378136 +b=6356751.361745712 +towgs84=0.0,0.0,1.5,-0.0,0.0,-0.076,0.0 +no_defs");
    function getDirectionNameInner(name) {
        var directions = {
            'c': 'N',
            'в': 'E',
            'з': 'W',
            'ю': 'S',
            'cш': 'N',
            'вд': 'E',
            'зд': 'W',
            'юш': 'S'
        };
        return directions[name.toLowerCase().substr(0, 1)] || name.toUpperCase();
    }
    function getDirectionNameOutter(name) {
        var directions = {
            'n': 'СШ',
            'e': 'ВД',
            'w': 'ЗД',
            's': 'ЮШ'
        };
        return directions[name.toLowerCase().substr(0, 1)] || name.toUpperCase();
    }
    function fix60(ceil, d) {
        if (d >= 60.0) {
            ceil += 1;
            d = 0;
        }
        return [ceil, d]
    }

    function fixBefore (number, digit) {
        var prefix = '',
            count,
            numberLength = (Math.floor(number) + '').length,
            i;
        if (numberLength < digit) {
            for (i = 0, count = digit - numberLength; i < count; i += 1) {
                prefix = prefix + '0'
            }
        }
        return prefix + number;
    }
    $.mask.definitions['X']='[E|W]';
    $.mask.definitions['Y']='[S|N]';
    var toFixed = Gis.Util.toFixed,
        digitSeconds = 1,
        digitMinutes = 3,
        digitGrags = 5,
        template = {
        'full': {
            isDirectional: true,
            template: /([-]*[\d]+)[\u00B0]*\s(\d+)[']* (\d+[\.\d+]*)["]*(\s[SNEWСЮШВЗДsnewсюшвзд]+)*/,
            getTemplate: function (y) {
                return (y ? '99' : '999') + "\u00B0 99' 99.9\"";
            },
            fillTemplate: function (graduses, minute, second, direction, longitude) {
                second = second || 0;
                minute = minute || 0;
                graduses = graduses || 0;
                var tmp, coordinate, minuteStart = parseFloat(minute), secondStart = parseFloat(second);

                if (!direction) {
                    direction = parseFloat(graduses) > 0 ?
                        longitude ? "E" : 'N' :
                        longitude ? "W" : 'S';
                }
                coordinate = parseFloat(toFixed(graduses, 9));
                coordinate = Math.abs(coordinate);
                graduses = parseInt(coordinate, 10);
                minute = parseInt((coordinate - graduses) * 60, 10) + parseInt(minuteStart);
                second = toFixed(parseFloat((((coordinate - graduses) * 60 + minuteStart) - minute) * 60) + secondStart, digitSeconds);
                tmp = fix60(minute, second);
                minute = tmp[0];
                second = fixBefore(tmp[1], 2);
                tmp = fix60(graduses, minute);
                graduses = fixBefore(tmp[0], longitude ? 3 : 2);
                minute = fixBefore(tmp[1], 2);
                return graduses + String.fromCharCode('176') + ' ' + minute + '\' ' + second + '" ' + getDirectionNameOutter(direction);
            },
            fromBase: function (coordinate, longitude) {
                return this.fillTemplate(coordinate, null, null, null, longitude);
            },
            toBase: function (coordinate) {
                var values,
                    direction,
                    multiple = 1;
                coordinate = coordinate + '';
                values = coordinate.match(this.template);
                if (values && values.length) {
                    if (values[4]) {
                        direction = getDirectionNameInner(values[4].trim()).toLowerCase();
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
        'middle': {
            isDirectional: true,
            template: /([-]*[\d]+)[\u00B0]*\s(\d+[\.\d*]*)[']*(\s[SNEWСЮШВЗДsnewсюшвзд]+)*/,
            getTemplate: function (y) {
                return (y ? '99' : '999') + "\u00B0 99.999'";
            },
            fillTemplate: function (graduses, minute, second, direction, longitude) {
                var tmp, coordinate;
                second = parseFloat(second || 0);
                minute = parseFloat(minute || 0);
                graduses = parseFloat(graduses || 0);
                if (!direction) {
                    direction = parseFloat(graduses) > 0 ?
                        longitude ? "E" : 'N' :
                        longitude ? "W" : 'S';
                }
                coordinate = parseFloat(toFixed(graduses, 9));
                coordinate = Math.abs(coordinate);
                graduses = parseInt(coordinate, 10);
                if (second) {
                    minute += second / 60;
                }
                minute = toFixed((coordinate - graduses) * 60 + parseFloat(minute), digitMinutes);
                tmp = fix60(graduses, minute);
                graduses = fixBefore(tmp[0], longitude ? 3 : 2);
                minute = fixBefore(tmp[1], 2);
                return graduses + String.fromCharCode('176') + ' ' + minute + '\' ' + getDirectionNameOutter(direction);
            },
            fromBase: function (coordinate, longitude) {
                return this.fillTemplate(coordinate, null, null, null, longitude);
            },
            toBase: function (coordinate) {
                var values,
                    direction,
                    multiple = 1;
                coordinate = coordinate + '';
                values = coordinate.match(this.template);
                if (values && values.length) {
                    if (values[3]) {
                        direction = getDirectionNameInner(values[3].trim()).toLowerCase();
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
        'short': {
            isDirectional: true,
            template: /([-]*[\d]+[\.]*[\d]*)[\u00B0]*(\s[SNEWСЮШВЗДsnewсюшвзд]+)*/,
            getTemplate: function (y) {
                return (y ? '99' : '999') + ".99999\u00B0";
            },
            fillTemplate: function (coordinate, minute, second, direction, longitude) {
                var fixed, ceil, digit;
                second = parseFloat(second || 0);
                minute = parseFloat(minute || 0);
                coordinate = parseFloat(coordinate || 0);
                if (!direction) {
                    direction = parseFloat(coordinate) > 0 ?
                        longitude ? "E" : 'N' :
                        longitude ? "W" : 'S';
                }
                coordinate = Math.abs(coordinate);
                if (second) {
                    minute += second / 60;
                }
                if (minute) {
                    coordinate += minute / 60;
                }
                fixed = parseFloat(toFixed(coordinate, digitGrags));
                ceil = Math.floor(fixed);
                digit = toFixed((fixed - Math.floor(fixed)) + '', digitGrags).replace(/0\./, '');
                ceil = fixBefore(ceil, longitude ? 3 : 2);
                return (ceil + '.' + digit) + String.fromCharCode('176') + ' ' + getDirectionNameOutter(direction);
            },
            fromBase: function (coordinate, longitude) {
                return this.fillTemplate(coordinate, null, null, null, longitude);
            },
            toBase: function (coordinate) {
                var values, direction, multiple = 1;
                coordinate += '';
                values = coordinate.match(this.template);
                if (values && values.length) {
                    if (values[2]) {
                        direction = getDirectionNameInner(values[2].trim()).toLowerCase();
                        switch (direction) {
                            case 'w':
                            case 's':
                                multiple = -1;
                                break
                        }
                    }
                    return (parseFloat(values[1]) * multiple);
                }
                return (parseFloat(coordinate));
            }
        }
    };

    function transform(src, dest, x, y, z) {
        return proj4.transform(new proj4.Proj(src), new proj4.Proj(dest), new proj4.Point(x, y, z));
    }

    /**
     * Класс конвертер записи координат в различных системах
     * @class
     * @extends Gis.BaseClass
     */
    Gis.UI.Coordinate = Gis.BaseClass.extend({
        accuracy: 9,
        initialize: function (x, y, z) {
            if (Gis.Util.isArray(x)) {
                this.x = x[0];
                this.y = x[1];
                this.z = x[2];
            } else if (x && x.hasOwnProperty('x')) {
                this.x = x.x;
                this.y = x.y;
                this.z = x.z;
            } else if (x && x.hasOwnProperty('lat')) {
                this.x = x.lng;
                this.y = x.lat;
                this.z = x.z;
            } else if (x && x.hasOwnProperty('latitude')) {
                this.x = x.longitude;
                this.y = x.latitude;
                this.z = x.z;
            } else {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            this.x = this.x == undefined || this.x === 'NaN' ? '' : this.x;
            this.y = this.y == undefined || this.y === 'NaN'  ? '' : this.y;
            this.z = this.z == undefined || this.z === 'NaN'  ? '' : this.z;
        },
        getX: function () {
            return this.x;
        },
        getY: function () {
            return this.y;
        },
        getZ: function () {
            return this.z;
        }
    });
    /**
     *
     * @param x
     * @param [y]
     * @param [z]
     * @returns {*}
     */
    Gis.UI.coordinate = function (x, y, z) {
        if (x && x.getZ) {
            return x;
        }
        return new Gis.UI.Coordinate(x, y, z)
    };
    Gis.UI.CoordinateConverter = Gis.BaseClass.extend(
        /** @lends Gis.UI.CoordinateConverter.prototype */
        {
            _selectedTemplate: 'full',
            _baseSystem: DEFAULT_SYSTEM, //внутренняя система TacticMapClient
            _selectedSystem: DEFAULT_SELECTED_SYSTEM,
            templates: {
                'wgs84': ['full', 'middle', 'short'],
                'sk-42': ['full', 'middle', 'short'],
                'pz-90': ['full', 'middle', 'short']
            },
            getDirectionNameInner: getDirectionNameInner,
            getDirectionNameOutter: getDirectionNameOutter,
            _systemNames: {
                'wgs84': 'WGS-84',
                'sk-42': 'СК-42',
                'pz-90': 'ПЗ-90',
                'gauss': 'Гаусс-Крюгер',
                'full': 'ГМС',
                'short': 'Г',
                'middle': 'ГМ'
            },
            options: {
                availableSystems: [
                    DEFAULT_SELECTED_SYSTEM,
                    'sk-42',
                    'pz-90',
                    'gauss'
                ]
            },
            getCurrentMask: function (y) {
                return this.getSelectedTemplate() && template[this.getSelectedTemplate()] && template[this.getSelectedTemplate()].getTemplate(y);
            },
            /**
             * использует ли шаблон направление S N W E
             * @returns {boolean}
             */
            isTemplateDirectional: function (sk, tmpl) {
                tmpl = tmpl || this.getSelectedTemplate();
                return this.isTemplatingAvailable(sk) && tmpl && template[tmpl] && template[tmpl].isDirectional;
            },
            initialize: function () {
                var self = this;
                var preferenceData = Gis.Preferences.getPreferenceData(SELECTED_SYSTEM_PREFS_KEY);
                if (preferenceData) {
                    this.setActiveSystem(preferenceData);
                }
                this._systems = {
                    'gauss': {
                        fromBase: function (x, y, z) {
                            var point = transform('WGS84', getDauumName(Gis.Util.getZoneFromLongitude(x)), x, y, z);
                            return Gis.UI.coordinate(toFixed(point.y), toFixed(point.x), toFixed(point.z));
                        },
                        toBase: function (y, x, z) {
                            var ystr = ('' + parseInt(x, 10)),
                                position = ystr.substr(0, ystr.length - 6);
                            position = position ?
                                position > 60 ?
                                    position % 60 :
                                    position < 0 ? 60 + (position % 60) : position
                                : null;
                            var point = transform(getDauumName(position || self._autoZone), 'WGS84', (position ? '' : (self._autoZone || 1)) + parseFloat(x), parseFloat(y), parseFloat(z));
                            return Gis.UI.coordinate(parseFloat(toFixed(point.x, 8)), parseFloat(toFixed(point.y, 8)), parseFloat(toFixed(point.z, 8)));
                        }
                    },
                    'wgs84': {
                        template: true,
                        fromBase: function (x, y, z) {
                            return Gis.UI.coordinate(x, y, z);
                        },
                        toBase: function (x, y, z) {
                            return Gis.UI.coordinate(parseFloat(x), parseFloat(y), parseFloat(z));
                        }
                    },
                    'sk-42': {
                        template: true,
                            fromBase: function (x, y, z) {

                            var point = transform('WGS84', getDauumName(Gis.Util.getZoneFromLongitude(x), true), x, y, z);
                            return Gis.UI.coordinate(toFixed(point.x, 8), toFixed(point.y, 8), toFixed(point.z, 8));
                        },
                        toBase: function (x, y, z) {
                            var point = transform(getDauumName(Gis.Util.getZoneFromLongitude(x), true), 'WGS84', x, y, z);
                            return Gis.UI.coordinate(parseFloat(toFixed(point.x, 8)), parseFloat(toFixed(point.y, 8)), parseFloat(toFixed(point.z, 8)));
                        }
                    },
                    'pz-90': {
                        template: true,
                        fromBase: function (x, y, z) {

                            var point = transform('WGS84', 'EPSG:4923', x, y, z);
                            return Gis.UI.coordinate(toFixed(point.x, 8), toFixed(point.y, 8), toFixed(point.z, 8));
                        },
                        toBase: function (x, y, z) {
                            var point = transform('EPSG:4923', 'WGS84', x, y, z);
                            return Gis.UI.coordinate(parseFloat(toFixed(point.x, 8)), parseFloat(toFixed(point.y, 8)), parseFloat(toFixed(point.z, 8)));
                        }
                    }
                }
                Gis.BaseClass.prototype.initialize.apply(this, arguments);
            },
            /**
             * Получить список доступных шаблонов для СК
             * @param {string} system
             * @returns {undefined|Array}
             */
            getAvailableTemplates: function (system) {
                return this.templates[system] && this.templates[system].slice(0);
            },
            /**
             * Получить список доступных СК
             * @returns {Array}
             */
            getAvailableSystems: function () {
                return this.options.availableSystems.slice(0);
            },
            isMetric: function (system) {
                var metric = ['gauss'];
                system = system|| this._selectedSystem;
                return metric.indexOf(system) >= 0;
            },
            /**
             * получить описание СК
             * @param val
             * @returns {*}
             */
            getSystemName: function (val) {
                return this._systemNames[val] || val;
            },
            /**
             * Разбивается ли система на зоны
             * @param {string} system
             * @returns {boolean}
             */
            isNeedZone: function (system) {
                var needArray = ['gauss'];
                return needArray.indexOf(this.getSystemNameFromKey(system)) >= 0;
            },
            getAutoZone: function () {
                return Gis.SK_AUTOZONE;
            },
            /**
             * Установить зону. если не установлена, то в спорной ситуации выбирается автоматически
             * в противном случае берется фиксированная
             * @param {number|null} zone
             * @fires skchanged
             */
            setAutoZone: function (zone) {
                var event = {oldSk: this._selectedSystem, oldTemplate: this._selectedTemplate, oldZone: Gis.SK_AUTOZONE};
                Gis.SK_AUTOZONE = zone;
                this.fire('skchanged', event);
            },
            isCorrectZoneSelected: function () {
                return this.isCorrectZone(Gis.SK_AUTOZONE);
            },
            isCorrectZone: function (zone) {
                return Gis.Util.isNumeric(zone);
            },
            /**
             * Установить активную зону
             * @param {string} sk установить зону или зону и стиль, в таком случае в строке зона и стиль разделены '_|_'
             * @returns {Gis.UI.CoordinateConverter} this
             */
            setActiveSystem: function (sk) {
                var event = {oldSk: this._selectedSystem, oldTemplate: this._selectedTemplate, oldZone: Gis.SK_AUTOZONE};
                if (sk.indexOf(Gis.UI.CoordinateConverter.DELIMETER) >= 0) {
                    sk = sk.split(Gis.UI.CoordinateConverter.DELIMETER);
                }
                if (Gis.Util.isArray(sk)) {
                    this._selectedSystem = sk[0];
                    this._selectedTemplate = sk[1];
                    Gis.SK_AUTOZONE = sk[2];
                } else {
                    this._selectedSystem = sk;
                }
                Gis.Preferences.setPreferenceData(SELECTED_SYSTEM_PREFS_KEY, sk);
                this.fire('skchanged', event);
                if (Gis.EventBus) {
                    Gis.EventBus.fire('skchanged', event);
                }
                return this;
            },
            getSystemNameFromKey: function (key) {
                if (key.indexOf(Gis.UI.CoordinateConverter.DELIMETER) >= 0) {
                    key = key.split(Gis.UI.CoordinateConverter.DELIMETER);
                    return key[0];
                } else {
                    return key;
                }
            },
            /**
             * получить выбранную пользователем СК
             * @returns {string}
             */
            getSelectedSystem: function () {
                return this._selectedSystem;
            },
            getFullSystemKey: function (system, template, zone) {
                return system +
                    Gis.UI.CoordinateConverter.DELIMETER + (this.isCorrectTemplateSelected(template, system) ? template : 'null') +
                    Gis.UI.CoordinateConverter.DELIMETER + (this.isCorrectZone(zone) ? zone : 'null');
            },
            getFullSystemSelectedKey: function () {
                return this.getFullSystemKey(this._selectedSystem, this.getSelectedTemplate(), this.getAutoZone());
            },
            getFullSystemName: function (systemName) {
                systemName = systemName || this.getFullSystemSelectedKey();
                var sk = systemName.split(Gis.UI.CoordinateConverter.DELIMETER),
                    selectedSystem = sk[0],
                    selectedTemplate = sk[1],
                    autoZone = sk[2];
                return this.getSystemName(selectedSystem) +
                    (this.isNeedZone(selectedSystem) ?
                    ' (' + (Gis.Util.isNumeric(autoZone) ? autoZone : 'авто') + ')' :
                    this.isTemplatingAvailable(selectedSystem) ? ' (' + this.getSystemName(selectedTemplate) + ')' : '');
            },
            /**
             * Доступны ли шаблоны для выбраной СК
             * @returns {boolean}
             */
            isTemplatingAvailable: function (system) {
                system = system || this._selectedSystem;
                var templateAvail = !!this.templates[system];
                return !!templateAvail;
            },
            /**
             * Получить выбранный шаблон
             * @returns {string}
             */
            getSelectedTemplate: function () {
                return this._selectedTemplate;
            },
            /**
             * Выбрал ли пользователь корректный шаблон для СК
             * @returns {boolean}
             */
            isCorrectTemplateSelected: function (template, system) {
                return this.isTemplatingAvailable(system || this._selectedSystem) && this.templates[system || this._selectedSystem].indexOf(template || this._selectedTemplate) >= 0;
            },
            /**
             * Форматировать точку согласно шаблону пользователя
             * @param {Gis.UI.Coordinate} point
             * @param {string} [templ]
             * @returns {Gis.UI.Coordinate}
             */
            toTemplate: function (point, templ) {
                if (this.isCorrectTemplateSelected(templ)) {
                        return Gis.UI.coordinate(
                            template[this._selectedTemplate].fromBase(point.x, true),
                            template[this._selectedTemplate].fromBase(point.y)
                        );
                }
                return point;
            },
            /**
             * Преобразуем строку шаблона в координату
             * @param x
             * @param [system]
             * @returns {*}
             */
            coordinateFromTeplate: function (x, system) {
                var newVar = this.isTemplatingAvailable(system) && (this.getFormat(x) || template[this._selectedTemplate]);
                return (x != undefined) && newVar ? newVar.toBase(x): '';
            },
            /**
             * Преобразовать шаблонные координаты в корректные записи
             * @param {Gis.UI.Coordinate} point
             * @param [system]
             * @returns {Gis.UI.Coordinate}
             */
            fromTemplate: function (point, system) {
                if (this.isTemplatingAvailable(system)) {
                        return Gis.UI.coordinate(
                            this.coordinateFromTeplate(point.x, system),
                            this.coordinateFromTeplate(point.y, system)
                        );
                }
                return point;
            },
            /**
             *
             * @param {string} from
             * @param {string} to
             * @param x
             * @param [y]
             * @param [z]
             * @param {boolean} [noTemplate] не преобразовывать в шаблон
             * @returns {Gis.UI.Coordinate}
             */
            convert: function(from, to, x, y, z, noTemplate) {
                var formaterFrom, formaterTo, point;
                point = Gis.UI.coordinate(x, y, z);
                if (point.x != undefined && point.x !== '') {
                    formaterFrom = this.getFormatByName(from);
                    formaterTo = this.getFormatByName(to);
                    point = this.fromTemplate(Gis.UI.coordinate(x, y, z), from);
                    if (formaterFrom && formaterFrom.toBase && formaterTo && formaterTo.fromBase ) {
                        point = formaterFrom.toBase(point.x, point.y, point.z);
                        point = formaterTo.fromBase(point.x, point.y, point.z);
                        if (!noTemplate && formaterTo.template) {
                            point = this.toTemplate(point);
                        }
                    }
                }
                return point;
            },
            /**
             * преобразует строку из базовой записи в выбранную пользователем
             * @param {string | number | Array | object} x координата
             * @param {string | number} [y] координата
             * @param {string | number} [z] координата
             */
            fromBase: function (x, y, z) {
                return this.convert('wgs84', this._selectedSystem, x, y, z);
            },
            /**
             * преобразует строку в базовую запись
             * @param {string | number | Array | object} x координата
             * @param {string | number} [y] координата
             * @param {string | number} [z] координата
             */
            toBase: function (x, y, z) {
                return this.convert(this._selectedSystem, 'wgs84', x, y, z, true);
            },
            /**
             *  Поиск соответствия формата записи
             *  @param {string} coordinate
             *  @returns {object}
             */
            getFormat: function (coordinate) {
                var groupName;
                coordinate = coordinate + '';
                for (groupName in template) {
                    if (template.hasOwnProperty(groupName)) {
                        if (coordinate.match(template[groupName].template)) {
                            return template[groupName];
                        }
                    }
                }
            },
            fromRandomTemplateToCurrent: function (value, x) {
                if (value) {
                    value = value.replace(',', '.');
                }
                var templates = [
                    /^([-]*[\d]+)[\u00B0|\:]+[\s]*(\d+)['|\:]+[\s]*(\d+[\.\d+]*)["]*(\s*[SNEWСЮШВЗДsnewсюшвзд]+)*/,
                    /^([-]*[\d]+)[\u00B0|\:]+[\s]*(\d+[\.\d*]*)[']*(\s*[SNEWСЮШВЗДsnewсюшвзд]+)*/,
                    /^([-]*[\d]+)*[\s]*[\.][,]*[\s]*(\d+)/,
//                    /^([-]*[\d]+[\.]*[\d]*)[\u00B0]*(\s[SNEWСЮШВЗДsnewсюшвзд]+)*/
                ],i, len, matched, direction, multiple = 1, parsedValues, self = this;
                value += '';
                function logError() {
                    alert('Не удалось выполнить преобразование.');
                    Gis.Logger.log('Не удалось выполнить преобразование.', value);
                }

                function parseVariables(variable) {
                    var variables, templatesGlobal = [
                        /([-]*[\d]+)[\u00B0|\:]+[\s]*(\d+)['|\:]+[\s]*(\d+[\.\d+]*)["]*(\s*[SNEWСЮШВЗДsnewсюшвзд]+)*/g,
                        /([-]*[\d]+)[\u00B0|\:]+[\s]*(\d+[\.\d*]*)[']*(\s*[SNEWСЮШВЗДsnewсюшвзд]+)*/g
                    ];
                    if (variable) {
                        for (i = 0, len = templatesGlobal.length; i < len; i += 1) {
                            variables = variable.match(templatesGlobal[i]);
                            if (variables) {
                                return variables;
                            }
                        }
                    }
                    return variable;
                }
                function parseTemplates(innerValue, xInner) {
                    for (i = 0, len = templates.length; i < len; i += 1) {
                        matched = innerValue.match(templates[i]);
                        if (matched) {
                            var result = parseFloat(matched[1]);
                            direction = innerValue.match(/[SNEWСЮШВЗДsnewсюшвзд]+/);
                            if (direction) {
                                direction = getDirectionNameInner(direction[0].trim()).toLowerCase();
                                switch (direction) {
                                    case 'w':
                                    case 's':
                                        multiple = -1;
                                        break
                                }
                            }
                            if (matched[2] != undefined) {
                                matched[2] = matched[2].replace(',', '.');
                                result += parseFloat(matched[2]) / 60;
                            }
                            if (matched[3] != undefined && i === 0) {
                                matched[3] = matched[3].replace(',', '.');
                                result += parseFloat(matched[3]) / 3600;
                            }
                            if (self.isTemplatingAvailable() && template[self._selectedTemplate]) {
                                return template[self._selectedTemplate].fillTemplate(matched[1].replace(',', '.'), matched[2], i === 0 ? matched[3] : null, direction, xInner);
                            } else {
                                if (self.isMetric()) {
                                    return [parseFloat(matched[2]),  parseFloat(matched[0])];
                                }
                                return parseFloat(Gis.Util.toFixed(result * multiple, 8));
                            }
                        }
                    }
                    direction = innerValue.match(/[SNEWСЮШВЗДsnewсюшвзд]+/);
                    if (self.isMetric() && (innerValue.match(/[\u00B0|\:]+/) || direction)) {
                        logError();
                        return false;
                    }
                    if (direction) {
                        direction = getDirectionNameInner(direction[0].trim()).toLowerCase();
                        switch (direction) {
                            case 'w':
                            case 's':
                                innerValue = parseFloat(innerValue) * -1;
                                break
                        }
                    }
                    if (self.isTemplatingAvailable() && template[self._selectedTemplate]) {
                        return template[self._selectedTemplate].fromBase(innerValue, xInner);
                    }
                    return parseFloat(innerValue);
                }

                value = parseVariables(value);

                if (Gis.Util.isArray(value)) {
                    parsedValues = [];
                    if (value.length > 1) {
                        value.forEach(function (val, index) {
                            parsedValues[index] = parseTemplates(value[index], index === 1);
                        });
                    } else {
                        parsedValues = parseTemplates(value[0], x);
                    }
                } else {
                    parsedValues = parseTemplates(value, x);
                }
                return parsedValues;
            },
            /**
             *  Выбор формата по имени
             *  @param {string} name
             *  @returns {object}
             */
            getFormatByName: function (name) {
                return this._systems[name];
            }
        });
    Gis.UI.CoordinateConverter.DELIMETER = '_|_';
}(Gis));
