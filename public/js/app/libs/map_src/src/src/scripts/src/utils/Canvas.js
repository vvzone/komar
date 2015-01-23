/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.Canvas = {
        lineByPath: function (ctx, path) {
            var points = path.split(' '), coordinates;
            points.forEach(function (point) {
                coordinates = point.split(',');
                ctx.lineTo(coordinates[0], coordinates[1]);
            });
            return ctx;
        },

        /**
         * Draws a rounded rectangle using the current state of the canvas.
         * If you omit the last three params, it will draw a rectangle
         * outline with a 5 pixel border radius
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} radius The corner radius. Defaults to 5;
         * @param {String} fill color to fill the rectangle.
         * @param {String} stroke color to stroke the rectangle.
         */
        roundRect: function (ctx, x, y, width, height, radius, fill, stroke) {
            stroke = stroke || true;
            radius = radius || 5;
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            if (fill) {
                ctx.fillStyle = fill;
                ctx.fill();
            }
            if (stroke) {
                ctx.strokeStyle = stroke;
                ctx.stroke();
            }
        }
    };
}(Gis));