function HashList() {
    'use strict';
    var list = {};

    /**
     *
     * @param key1
     * @param key2
     * @returns {Gis.Objects.Base|undefined}
     */
    function getBy2Keys(key1, key2) {
        if (list[key1]) {
            return (list[key1][key2]) || undefined;
        }
        return undefined;
    }
    /**
     *
     * @param key1
     * @returns {Gis.Objects.Base[]|undefined}
     */
    function getByKey(key1) {
        var id,
            result = [];
        for (id in list) {
            if (list.hasOwnProperty(id) && list[id][key1]) {
                result.push(list[id][key1]);
            }
        }
        return (result.length && (result.length > 1 ? result : result[0])) || undefined;
    }

    function removeBy2Keys(key1, key2) {
        if (list[key1] && list[key1][key2]) {
            return delete list[key1][key2];
        }
        return false;
    }

    function removeByKey(key1) {
        var id;
        for (id in list) {
            if (list.hasOwnProperty(id) && list[id][key1]) {
                return delete list[id][key1];
            }
        }
        return false;
    }

    this.add = function (key1, key2, object) {
        if (!list[key1]) {
            list[key1] = {};
        }
        list[key1][key2] = object;
    };
    this.clear = function (key) {
        if (!Gis.Util.isDefine(key)) {
            list = {};
        } else {
            delete list[key];
        }
    };
    this.getList = function (key) {
        return list[key];
    };
    this.hasElements = function () {
        return Object.keys(list).length;
    };
    this.getObject = function (key1, key2) {
        return key2 ? getBy2Keys(key1, key2) : getByKey(key1);
    };
    this.remove = function (key1, key2) {
        return key2 ? removeBy2Keys(key1, key2) : removeByKey(key1);
    };
    this.each = function (func, context) {
        var key1,
            key2,
            objectsByType,
            object;
        for (key1 in list) {
            if (list.hasOwnProperty(key1)) {
                objectsByType = list[key1];
                for (key2 in objectsByType) {
                    if (objectsByType.hasOwnProperty(key2)) {
                        object = objectsByType[key2];
                        if (context) {
                            func.call(context, object);
                        } else {
                            func.call(object, object);
                        }
                    }
                }
            }

        }
    };
}