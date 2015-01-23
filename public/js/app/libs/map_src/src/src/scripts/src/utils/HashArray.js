function HashArray(maxSize) {
    'use strict';
    var list = {},
        MAX_SIZE = 5;
    MAX_SIZE = maxSize || MAX_SIZE;
    this.add = function (key1, object) {
        if (!list[key1]) {
            list[key1] = [];
        }
        var length = list[key1].length;
        if (MAX_SIZE <= length) {
            list[key1] = list[key1].slice(length - MAX_SIZE + 1);
        }
        list[key1].push(object);
    };
    this.clear = function (key) {
        if (!Gis.Util.isDefine(key)) {
            list = {};
        } else {
            delete list[key];
        }
    };
    this.getList = function (key) {
        return list[key] && list[key].slice();
    };
    this.hasElements = function () {
        return Object.keys(list).length;
    };
}