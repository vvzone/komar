"use strict";
Gis.Additional.Icon.circle = function (color, icoWidth, canvas) {
    var ctx;
    canvas = canvas || document.createElement('canvas');
    canvas.width = icoWidth;
    canvas.height = icoWidth;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.lineWidth = icoWidth / 6;

    ctx.arc(icoWidth / 2, icoWidth / 2, 2 * icoWidth / 6, 0, Math.PI * 2);
    ctx.fill();
    // line color
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    return canvas;
};