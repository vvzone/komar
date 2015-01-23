/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */

(function (G) {
    "use strict";
    G.Additional.Icon.triangle = function (color, icoWidth, canvas) {
        var ctx, strokeWidth = icoWidth / 8;
        canvas = canvas || document.createElement('canvas');
        canvas.width = icoWidth;
        canvas.height = icoWidth;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(strokeWidth, icoWidth - strokeWidth);
        G.Canvas.lineByPath(ctx, icoWidth / 2 + "," + strokeWidth + " " + (icoWidth - strokeWidth) + "," + (icoWidth - strokeWidth));
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        return canvas;
    };
}(Gis));
/**
 * @static
 * @constant
 * @default
 * @type {string}
 */
Gis.Additional.Icon.TYPE.TRIANGLE = 'triangle';