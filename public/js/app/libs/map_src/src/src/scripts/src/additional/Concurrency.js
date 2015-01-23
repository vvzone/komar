(function (global){
    "use strict";
    var worker;
    /**
     * @class
     */
    Gis.Thread = Gis.BaseClass.extend(
        /** @lends Gis.Concurrency.prototype */
        {
            initialize: function (newWorker, data) {
                var self = this;
                worker = newWorker;
                Gis.BaseClass.prototype.initialize.apply(this, Array.prototype.slice.call(arguments, 1));
                worker.onmessage = function (oEvent) {
                    self.publishResponse(oEvent.data);
                };
            },
            publishResponse: function (data) {
                this.fire('response', data);
            },
            sendMessage: function (message) {
                worker.postMessage(message);
            }

        });
    Gis.thread = function (newWorker, data) {
        if (newWorker.publishResponse) {
            return newWorker;
        }
        return new Gis.Thread(newWorker, data);
    }
}(this));
