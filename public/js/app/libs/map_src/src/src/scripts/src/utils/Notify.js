/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function (G) {
    'use strict';
    G.notify = function (message, type) {
        if (G.Config.needUserNotify) {
            if ($ && $.notify) {
                $.notify(message, type);
            }
        }
    };
}(Gis));