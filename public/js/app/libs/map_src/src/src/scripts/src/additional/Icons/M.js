/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */


(function (G) {
    "use strict";
    G.Additional.Icon.m = function (color, icoWidth, canvas, color2) {
        var ctx;
        canvas = canvas || document.createElement('canvas');
        canvas.width = icoWidth;
        canvas.height = icoWidth;
        ctx = canvas.getContext('2d');
        Gis.Canvas.roundRect(ctx, 0, 0, icoWidth, icoWidth, 4, color, '#FFFFFF');
        ctx.stroke();
        ctx.fillStyle = color2 || '#FFFFFF';
        ctx.font = "bold 9pt Arial";
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";
        ctx.fillText('M', icoWidth / 2, icoWidth  - ((icoWidth - 13.5) / 2));
        return canvas;
    };
}(Gis));

