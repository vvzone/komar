'use strict';
/**
 * Добавляет функционал контейнера стилей
 * @lends Gis.Map#
 */
Gis.StyleContainerBehavior = {
    initStyleContainer: function () {
        var self = this;
        if (this.getStyle) {
            (function () {
                var styles = {};
                self.getStyle = function (styleId) {
                    return styles[styleId];
                };
                /**
                 * @description получить список идентификаторов стилей для данного типа объекта
                 * @param {string} objectType
                 * @returns {string[]} список идентификаторов
                 */
                self.getStylesByObjectType = function (objectType) {
                    var id, computedStyles = [];
                    for (id in styles) {
                        if (styles.hasOwnProperty(id) && styles[id].containsObjectType(objectType)) {
                            computedStyles.push(id);
                        }
                    }
                    return computedStyles;
                };
                /**
                 * @description добавить стиль (заменит существующий с таким же ID)
                 * @param {Gis.Additional.Style | Gis.Additional.Style[]} style
                 * @fires stylechanged
                 */
                self.putStyle = function (style) {
                    var self = this, existedStyle, id;
                    if (Gis.Util.isArray(style)) {
                        style.forEach(function (val) {
                            try {
                                self.putStyle(val);
                            } catch (e) {
                                Gis.Logger.log("Не удалось добавить стиль", JSON.stringify(val), e.stack);
                            }
                        });
                    } else if (style) {
                        id = (style.styleID || (style.getStyleId && style.getStyleId()));
                        existedStyle = styles[id];
                        if (existedStyle) {
                            existedStyle.setData(this.getParams(style) || style);
                        } else {
                            try {
                                styles[id] = Gis.style(style);
                            } catch (e) {
                                Gis.Logger.log('Не удалось создать объект стиля', style, e.stack);
                            }
                        }
                        self.fire('stylechanged', {
                            style: styles[id].getStyleId()
                        });
                    }
                    return this;
                };
            }());
        }
    }
};