(function () {
    "use strict";
    /**
     * Автоматически определяет необходимый тип соединения
     * @param data
     * @returns {Gis.ConnectionBase}
     */
    Gis.connection = function (data) {
        if ((window.WebSocket && !Gis.WS_DISABLE)) {
            return new Gis.ConnectionWs(data);
        }
        return new Gis.ConnectionComet(data);
    };
}());