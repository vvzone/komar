/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */


(function (G) {
    "use strict";
    G.Additional.Icon['static'] = function (color, icoWidth, canvas) {
        var ctx, g;
        canvas = canvas || document.createElement('canvas');
        canvas.width = 21;
        canvas.height = 21;
        Gis.Additional.Icon.fixPositionCanvas(icoWidth, 21, canvas);
        ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(0, 0);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(21, 0);
        ctx.lineTo(21, 21);
        ctx.lineTo(0, 21);
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
        ctx.save();
        ctx.save();
        ctx.restore();
        ctx.save();
        ctx.restore();
        ctx.restore();
        ctx.save();
        g = ctx.createLinearGradient(9.9453, 3.98, 13.6538, 18.8152);
        g.addColorStop(0, color);
        g.addColorStop(0.7333, color);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(10.5, 19.375);
        ctx.bezierCurveTo(9.411, 19.375, 8.525, 18.489, 8.525, 17.4);
        ctx.lineTo(8.525, 13.884999999999998);
        ctx.lineTo(2.649, 7.541);
        ctx.bezierCurveTo(1.911, 6.743, 1.959, 5.4910000000000005, 2.757, 4.75);
        ctx.bezierCurveTo(3.122, 4.41, 3.598, 4.223, 4.097, 4.223);
        ctx.bezierCurveTo(4.646000000000001, 4.223, 5.175000000000001, 4.454, 5.549, 4.857);
        ctx.lineTo(8.618, 8.06);
        ctx.lineTo(8.6, 4.602);
        ctx.bezierCurveTo(8.6, 3.4930000000000003, 9.434999999999999, 2.625, 10.5, 2.625);
        ctx.bezierCurveTo(11.58, 2.625, 12.427, 3.493, 12.427, 4.6);
        ctx.lineTo(12.386, 8.055);
        ctx.lineTo(15.453999999999999, 4.853999999999999);
        ctx.bezierCurveTo(15.822, 4.4559999999999995, 16.351, 4.223999999999999, 16.9, 4.223999999999999);
        ctx.bezierCurveTo(17.398999999999997, 4.223999999999999, 17.875999999999998, 4.411, 18.241999999999997, 4.7509999999999994);
        ctx.bezierCurveTo(19.040999999999997, 5.491999999999999, 19.089, 6.744, 18.349999999999998, 7.542);
        ctx.lineTo(12.473999999999997, 13.887);
        ctx.lineTo(12.473999999999997, 17.401);
        ctx.bezierCurveTo(12.475, 18.488, 11.589, 19.375, 10.5, 19.375);
        ctx.lineTo(10.5, 19.375);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(10.5, 3);
        ctx.bezierCurveTo(11.385, 3, 12.052, 3.716, 12.052, 4.6);
        ctx.lineTo(12, 9);
        ctx.lineTo(15.725, 5.1129999999999995);
        ctx.bezierCurveTo(16.041, 4.771999999999999, 16.47, 4.598999999999999, 16.901, 4.598999999999999);
        ctx.bezierCurveTo(17.29, 4.598999999999999, 17.68, 4.739999999999999, 17.988, 5.025999999999999);
        ctx.bezierCurveTo(18.634999999999998, 5.626999999999999, 18.676, 6.638999999999999, 18.076, 7.286999999999999);
        ctx.lineTo(12.1, 13.739);
        ctx.lineTo(12.1, 17.400000000000002);
        ctx.bezierCurveTo(12.1, 18.284000000000002, 11.385, 19.000000000000004, 10.5, 19.000000000000004);
        ctx.bezierCurveTo(9.615, 19.000000000000004, 8.9, 18.284000000000002, 8.9, 17.400000000000002);
        ctx.lineTo(8.9, 13.738000000000003);
        ctx.lineTo(2.925, 7.286);
        ctx.bezierCurveTo(2.3249999999999997, 6.638999999999999, 2.3649999999999998, 5.6259999999999994, 3.013, 5.0249999999999995);
        ctx.bezierCurveTo(3.319, 4.74, 3.709, 4.599, 4.098, 4.599);
        ctx.bezierCurveTo(4.529, 4.599, 4.958, 4.772, 5.276, 5.113);
        ctx.lineTo(9, 9);
        ctx.lineTo(8.975, 4.6);
        ctx.bezierCurveTo(8.975, 3.716, 9.615, 3, 10.5, 3);
        ctx.moveTo(10.5, 2.25);
        ctx.bezierCurveTo(9.224, 2.25, 8.225, 3.282, 8.225, 4.6);
        ctx.lineTo(8.24, 7.122);
        ctx.lineTo(5.816, 4.594);
        ctx.bezierCurveTo(5.38, 4.124, 4.751, 3.849, 4.098, 3.849);
        ctx.bezierCurveTo(3.504, 3.849, 2.937, 4.072, 2.502, 4.476);
        ctx.bezierCurveTo(1.553, 5.357, 1.4949999999999999, 6.846, 2.375, 7.795999999999999);
        ctx.lineTo(8.15, 14.032);
        ctx.lineTo(8.15, 17.4);
        ctx.bezierCurveTo(8.15, 18.695999999999998, 9.204, 19.75, 10.5, 19.75);
        ctx.bezierCurveTo(11.796, 19.75, 12.85, 18.696, 12.85, 17.4);
        ctx.lineTo(12.85, 14.032999999999998);
        ctx.lineTo(18.625, 7.795999999999998);
        ctx.bezierCurveTo(19.505, 6.845999999999997, 19.447, 5.3569999999999975, 18.497, 4.475999999999997);
        ctx.bezierCurveTo(18.061, 4.071999999999997, 17.494, 3.8489999999999975, 16.9, 3.8489999999999975);
        ctx.bezierCurveTo(16.247, 3.8489999999999975, 15.617999999999999, 4.123999999999998, 15.172999999999998, 4.603999999999997);
        ctx.lineTo(12.772, 7.11);
        ctx.lineTo(12.801, 4.609);
        ctx.bezierCurveTo(12.802, 3.282, 11.791, 2.25, 10.5, 2.25);
        ctx.lineTo(10.5, 2.25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        return canvas;
    };
}(Gis));