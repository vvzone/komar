/**
 * Created by vkmar_000 on 23.12.14.
 */
(function () {
    'use strict';
    var countLoading = 0;
    Gis.ProgressBarController = {
        init: function () {
            Gis.EventBus.on('tilesloading tilesloaded', this._tilesCountChanged, this);
        },
        _tilesCountChanged: function (e) {
            switch (e.type) {
                case 'tilesloading':
                    countLoading++;
                    break;
                case 'tilesloaded':
                    countLoading--;
                    if (countLoading < 0) {
                        countLoading = 0;
                    }
                    break;
            }
        },
        /**
         * Тайлы обрабатываются
         * @returns {boolean}
         */
        isLoading: function () {
            return !!countLoading;
        }
    };
}());