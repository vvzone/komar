Gis.Additional.Icon.arrow = function (color, icoWidth, canvas, color2) {
    "use strict";
    var ctx, awailWidth = 21;
    canvas = canvas || document.createElement('canvas');
    canvas.width = icoWidth;
    canvas.height = icoWidth;
    Gis.Additional.Icon.fixPositionCanvas(awailWidth, awailWidth, canvas);
    var coefficient = icoWidth / awailWidth;
    ctx = canvas.getContext('2d');
    color2 = color2 || "#ffffff";
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(21 * coefficient,0);
    ctx.lineTo(21 * coefficient,21 * coefficient);
    ctx.lineTo(0,21 * coefficient);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;
    ctx.save();
    ctx.save();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = color2;
    ctx.translate(9.924735069274902 * coefficient,10.48912525177002 * coefficient);
    ctx.rotate(-3.141592653589793);
    ctx.translate(-9.924735069274902 * coefficient,-10.48912525177002 * coefficient);
    ctx.beginPath();
    ctx.moveTo(16.614143 * coefficient,6.746563 * coefficient);
    ctx.bezierCurveTo(16.613746 * coefficient,3.052125 * coefficient,13.619785999999998 * coefficient,0.057319999999999816 * coefficient,9.925756999999997 * coefficient,0.057319999999999816 * coefficient);
    ctx.bezierCurveTo(6.230539999999998 * coefficient,0.057319999999999816 * coefficient,3.235325999999997 * coefficient,3.0521249999999998 * coefficient,3.235325999999997 * coefficient,6.746563 * coefficient);
    ctx.bezierCurveTo(3.235325999999997 * coefficient,9.93516 * coefficient,8.218344999999996 * coefficient,18.453873 * coefficient,9.583697999999998 * coefficient,20.726955 * coefficient);
    ctx.bezierCurveTo(9.655535999999998 * coefficient,20.847431 * coefficient,9.785340999999999 * coefficient,20.92093 * coefficient,9.925358999999998 * coefficient,20.92093 * coefficient);
    ctx.bezierCurveTo(10.065364999999998 * coefficient,20.92093 * coefficient,10.195645999999998 * coefficient,20.84743 * coefficient,10.267033999999999 * coefficient,20.727348999999997 * coefficient);
    ctx.bezierCurveTo(11.631991999999999 * coefficient,18.454662999999996 * coefficient,16.614142 * coefficient,9.935157999999996 * coefficient,16.614142 * coefficient,6.746561999999997 * coefficient);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(9.897698402404785 * coefficient,12.236992835998535 * coefficient);
    ctx.rotate(-3.141592653589793);
    ctx.translate(-9.897698402404785 * coefficient,-12.236992835998535 * coefficient);
    ctx.beginPath();
    ctx.moveTo(13.93781 * coefficient,9.976645 * coefficient);
    ctx.bezierCurveTo(13.937570000000001 * coefficient,7.7453579999999995 * coefficient,12.129343 * coefficient,5.936617999999999 * coefficient,9.898328000000001 * coefficient,5.936617999999999 * coefficient);
    ctx.bezierCurveTo(7.666566000000001 * coefficient,5.936617999999999 * coefficient,5.857588000000001 * coefficient,7.7453579999999995 * coefficient,5.857588000000001 * coefficient,9.976645 * coefficient);
    ctx.bezierCurveTo(5.857588000000001 * coefficient,11.902421 * coefficient,8.867123000000001 * coefficient,17.047369 * coefficient,9.691742000000001 * coefficient,18.420218 * coefficient);
    ctx.bezierCurveTo(9.735127000000002 * coefficient,18.49298 * coefficient,9.813526000000001 * coefficient,18.537368999999998 * coefficient,9.898091 * coefficient,18.537368999999998 * coefficient);
    ctx.bezierCurveTo(9.982646 * coefficient,18.537368999999998 * coefficient,10.061309000000001 * coefficient,18.492979 * coefficient,10.104423 * coefficient,18.420451999999997 * coefficient);
    ctx.bezierCurveTo(10.9288 * coefficient,17.047849999999997 * coefficient,13.937809000000001 * coefficient,11.902420999999997 * coefficient,13.937809000000001 * coefficient,9.976643999999997 * coefficient);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.restore();
    return canvas;
};
Gis.Additional.Icon.arrow.width = 21;