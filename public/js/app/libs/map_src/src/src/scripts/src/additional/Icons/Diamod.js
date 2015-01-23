(function (G) {
    "use strict";
    /**
     * @deprecated
     */
    G.Additional.Icon.diamod = function (color, icoWidth, canvas) {
        var ctx, strokeWidth = icoWidth / 8;
        canvas = canvas || document.createElement('canvas');
        canvas.width = icoWidth;
        canvas.height = icoWidth;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(strokeWidth / 2, icoWidth / 2);
        Gis.Canvas.lineByPath(ctx, icoWidth / 2 + "," + strokeWidth +
            " " + (icoWidth - strokeWidth) + "," + (icoWidth / 2) +
            " " + (icoWidth / 2) + "," + (icoWidth - strokeWidth));
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        return canvas;
    };
}(Gis));