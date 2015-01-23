/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */

(function (G) {
    "use strict";
    G.Additional.Icon.simple = function (color, icoWidth, canvas) {
        var ctx;
        canvas = canvas || document.createElement('canvas');
        canvas.width = icoWidth;
        canvas.height = icoWidth;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.lineWidth = icoWidth / 6;

        ctx.beginPath();
        ctx.moveTo(8, 0);
        Gis.Canvas.lineByPath(ctx, "2,0 0,0 0,2 0,8 2,8 2,1.914 8,1.914");
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(12, 4);
        Gis.Canvas.lineByPath(ctx, "6,4 4,4 4,6 4,12 6,12 6,5.914 12,5.914");
        ctx.fill();
        ctx.closePath();

        ctx.rect(8, 8, 4, 4);
        ctx.fill();
        return canvas;
    };
}(Gis));