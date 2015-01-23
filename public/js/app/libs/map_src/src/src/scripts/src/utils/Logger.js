/**
 * Объект для логгировния
 * @type {object}
 * @property {number} logLevel default 1
 */
Gis.Logger = (function () {
    "use strict";
    return {
        /**
         * Уровень логгировния
         * @memberOf Gis.Logger
         * @default
         */
        logLevel: 1,
        logerror: function (message) {
            if (typeof message === "object") {
                if (console.table) {
                    console.table(message);
                }
            }
        },
        log: function (message, secondMessage, thirdMessage) {
            var stamp;
            if (this.logLevel > 0) {
                stamp = (new Date()).getTime() / 1000;
                console.log("[" + stamp + "]: " + message);
                this.logerror(message);
                if (this.logLevel > 1 && secondMessage) {
                    console.log("\t" + secondMessage);
                    this.logerror(secondMessage);
                }
                if (this.logLevel > 2 && thirdMessage) {
                    console.error("\t\t" + thirdMessage);
                    this.logerror(thirdMessage);
                }
            }
        }
    };
}());