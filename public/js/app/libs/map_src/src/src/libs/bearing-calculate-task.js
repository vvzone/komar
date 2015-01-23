/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */

postMessage("I\'m working before postMessage(\'ali\').");

onmessage = function (oEvent) {
    postMessage("Hi " + oEvent.data);
};