/**
 * Created with JetBrains PhpStorm.
 */
(function (global) {
    "use strict";
    var workers = {};
    Gis.Concurrency = {
        isWebWorkers: function () {
            return (Modernizr && Modernizr.webworkers) || global.Worker;
        },
        getWorker: function (key) {
            return workers[key];
        },
        registerWorker: function (key, worker) {
            workers[key] = worker;
        }
    };
}(this));