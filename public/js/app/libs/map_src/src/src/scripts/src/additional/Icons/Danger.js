/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */

(function (G) {
    "use strict";
    G.Additional.Icon.danger = function (color, icoWidth, canvas) {
        var ctx;
        canvas = canvas || document.createElement('canvas');
        canvas.width = 18;
        canvas.height = 18;
        Gis.Additional.Icon.fixPositionCanvas(icoWidth, 18, canvas);
        ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(0, 0);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(18, 0);
        ctx.lineTo(18, 18);
        ctx.lineTo(0, 18);
        ctx.closePath();
        ctx.clip();
        ctx.translate(0, 0);
        ctx.translate(0, 0);
        ctx.scale(1, 1);
        ctx.translate(0, 0);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 4;
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(9.019, -0.031);
        ctx.lineTo(7.794, 2.412);
        ctx.lineTo(10.242999999999999, 2.412);
        ctx.lineTo(9.019, -0.031);
        ctx.closePath();
        ctx.moveTo(18, 17.908);
        ctx.lineTo(10.489, 2.905);
        ctx.lineTo(10.489, 12.742999999999999);
        ctx.lineTo(7.502, 12.742999999999999);
        ctx.lineTo(7.502, 2.998);
        ctx.lineTo(0.035, 17.908);
        ctx.lineTo(7.502, 17.908);
        ctx.lineTo(7.502, 14.464000000000002);
        ctx.lineTo(10.489, 14.464000000000002);
        ctx.lineTo(10.489, 17.908);
        ctx.lineTo(18, 17.908);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        return canvas;
    };
}(Gis));