/**
 * Расширяет path возможностью добавлять паттерны заливки
 */
(function (L) {
    "use strict";
    var predefinedPatterns,
        percentFunc = function (dim) {
            var count = dim * this.percent,
                step = (dim - count) / count,
                i = 0,
                i2,
                path = "";
            for (i; i < count; i += 1) {
                for (i2 = 0; i2 < count; i2 += 1) {
                    path += "M" + (i2 * step + i2) + "," + (i * step + i) + " h1 v1 h-1 z";
                }
            }
            return path;
        },
        percentPathStyle = function () {
            return "fill:" + (this.options.color || "black") + ";stroke:none;";
        },
        pathDim = 10,
        brickFunc = function (dim) {
            var separate = 2,
                width = dim - separate,
                height = dim / 2 - separate;
            return "M0,0 h" + width + " v" + height + "h-" + width + "z" +
                " M 0, " + (height + separate) + " h" + (width / 2 - separate) + " v" + height + "h-" + (width / 2 - separate) + "z" +
                " M " + (width / 2) + ", " + (height + separate) + " h" + (width / 2 + separate) + " v" + height + "h-" + (width / 2 + separate) + "z";
        },
        zigzagFunc = function (dim) {
            var dh = this.getHeight() / 2,
                dv = this.getWidth() / 3,
                point = "l" + dh + "," + dv + " " + dh + ", -" + dv,
                patern = [-(dim / 4), dim / 4, dim * 3 / 4],
                string = "";
            patern.forEach(function (value) {
                string += "M0," + value + " " + point;
            });
            return string;
        };

    L.PathFillExtend = {
        options: {
            fillHatch: false
        },
        setFillHatch: function (hatch) {
            var currentHatch = this.options.fillHatch,
                compare = (!currentHatch && hatch.isHatch() && L.HatchClass.CHANGED) || (currentHatch && currentHatch.compare(hatch) && L.HatchClass.CHANGED);
            if (compare) {
                this.options.fillHatch = hatch;
                this._recalculateHatch(compare === L.HatchClass.COLOR_CHANGED);
            }
        },
        _setPattern: function (pattern) {
            this._pattern = pattern;
            pattern.getPattern(this._container);
            this._path.setAttribute('fill', "url(#" + pattern.getPatternId() + ')');
        },
        _recalculateHatch: function (onlyColor) {
            var pattern;
            if (!onlyColor) {
                pattern = predefinedPatterns[this.options.fillHatch.getStyle()]({
                    color: this.options.fillHatch.getColor(),
                    fillColor: this.options.fillColor,
                    container: this._container
                });
                if (pattern) {
                    this._setPattern(pattern);
                }
            }
            if (this._pattern) {
                this._pattern.setColor(this.options.fillHatch.getColor());
            }
        }
    };
    L.Hatch = L.Class.extend({
        dim: 10,
        strokeWidth: 1,
        path: function (dim) {
            return ("M0,0 l0," + dim);
        },
        options: {
            color: "#000000",
            fillColor: undefined
        },
        initialize: function (data) {
            this.options.color = data.color || "black";
            this.options.fillColor = data.fillColor || undefined;
            this._parentContainer = data.container;
        },
        _createElement: function (name) {
            return document.createElementNS(L.Path.SVG_NS, name);
        },
        setColor: function (color) {
            this.options.color = color;
        },
        _initPath: function (container) {
//            if (this._pattern) {
//                document.body.removeChild(this._pattern);
//            }
            this._pattern = container.getElementsByTagName('pattern')[0];
            if (!this._pattern) {
                this._pattern = this._createElement('pattern');
                this._pattern.setAttribute('patternUnits', 'userSpaceOnUse');
                this._container = this._createElement('g');
                this._path = this._createElement('path');
                this._bg = this._createElement('path');
                this._container.appendChild(this._bg);
                this._container.appendChild(this._path);
                this._pattern.appendChild(this._container);
                Gis.DomUtil.prepend(container, this._pattern);
            } else {
                this._container = this._pattern.childNodes[0];
                this._bg = this._container.childNodes[0];
                this._path = this._container.childNodes[1];
            }

        },
        getPatternId: function () {
            return "fillpatern";
        },
        getWidth: function () {
            return this.dim;
        },
        getHeight: function () {
            return this.dim;
        },
        getFillPath: function () {
            return "M0,0  H " + this.getWidth() + " V " + this.getHeight() + " H 0 V 0";
        },
        pathStyle: function () {
            return "fill:none;stroke:" + (this.options.color || "black") + "; stroke-width:" + this.strokeWidth;
        },
        getFillStyle: function () {
            return "fill:" + (this.options.fillColor || "none") + ";";
        },
        getTransform: function () {
            return "";
        },
        strokeDashArray: function () {
            return "";
        },
        _initPattern: function () {
            this._pattern.setAttribute("id", this.getPatternId());
            this._pattern.setAttribute("x", 0);
            this._pattern.setAttribute("y", 0);
            this._pattern.setAttribute("width", this.getWidth());
            this._container.setAttribute("fill-rule", "evenodd");
            this._pattern.setAttribute("height", this.getHeight());
            this._pattern.setAttribute("transform", this.getTransform());
            this._bg.setAttribute("style", this.getFillStyle());
            this._bg.setAttribute("d", this.getFillPath());
            this._path.setAttribute("style", this.pathStyle());
            this._path.setAttribute("stroke-dasharray", this.strokeDashArray());
            this._path.setAttribute("d", this.path(this.dim));
            return this._pattern;
        },
        getPattern: function (container) {
            if (!this._pattern) {
                if (!container && this._parentContainer) {
                    throw new Error("not seted container");
                }
                this._initPath(container || this._parentContainer);
            }
            return this._initPattern();
        }
    });
    L.Hatch = L.extend(L.Hatch, {
        HatchStyleHorizontal: 0,
        HatchStyleVertical: 1,
        HatchStyleForwardDiagonal: 2,
        HatchStyleBackwardDiagonal: 3,
        HatchStyleCross: 4,
        HatchStyleDiagonalCross: 5,
        HatchStyle05Percent: 6,
        HatchStyle10Percent: 7,
        HatchStyle20Percent: 8,
        HatchStyle25Percent: 9,
        HatchStyle30Percent: 10,
        HatchStyle40Percent: 11,
        HatchStyle50Percent: 12,
        HatchStyle60Percent: 13,
        HatchStyle70Percent: 14,
        HatchStyle75Percent: 15,
        HatchStyle80Percent: 16,
        HatchStyle90Percent: 17,
        HatchStyleLightDownwardDiagonal: 18,
        HatchStyleLightUpwardDiagonal: 19,
        HatchStyleDarkDownwardDiagonal: 20,
        HatchStyleDarkUpwardDiagonal: 21,
        HatchStyleWideDownwardDiagonal: 22,
        HatchStyleWideUpwardDiagonal: 23,
        HatchStyleLightVertical: 24,
        HatchStyleLightHorizontal: 25,
        HatchStyleNarrowVertical: 26,
        HatchStyleNarrowHorizontal: 27,
        HatchStyleDarkVertical: 28,
        HatchStyleDarkHorizontal: 29,
        HatchStyleDashedDownwardDiagonal: 30,
        HatchStyleDashedUpwardDiagonal: 31,
        HatchStyleDashedHorizontal: 32,
        HatchStyleDashedVertical: 33,
        HatchStyleSmallConfetti: 34,
        HatchStyleLargeConfetti: 35,
        HatchStyleZigZag: 36,
        HatchStyleWave: 37,
        HatchStyleDiagonalBrick: 38,
        HatchStyleHorizontalBrick: 39,
        HatchStyleDivot: 42,
        HatchStyleDottedGrid: 43,
        HatchStyleDottedDiamond: 44,
        HatchStyleShingle: 45,
        HatchStyleTrellis: 46,
        HatchStyleSphere: 47,
        HatchStyleSmallGrid: 48,
        HatchStyleSmallCheckerBoard: 49,
        HatchStyleLargeCheckerBoard: 50,
        HatchStyleOutlinedDiamond: 51,
        HatchStyleSolidDiamond: 52,
        HatchStyleTotal: 53
    });
    L.Hatch.HatchStyleLargeGrid = L.Hatch.HatchStyleCross;
    L.Hatch.HatchStyleMin = L.Hatch.HatchStyleHorizontal;
    L.Hatch.HatchStyleMax = L.Hatch.HatchStyleTotal - 1;
    predefinedPatterns = {};
    predefinedPatterns[L.Hatch.HatchStyleHorizontal] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0,0 l" + dim + ",0";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleVertical] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0,0 l0," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleForwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0,0 " + dim + "," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleBackwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0," + dim + " " + dim + ",0";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleCross] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0,0 H " + dim + " V " + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleSmallGrid] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0,0 H " + dim + " V " + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDottedGrid] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            strokeDashArray: function () {
                return this.strokeWidth + " " + this.strokeWidth;
            },
            path: function (dim) {
                return "M0,0 H " + dim + " V " + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDiagonalCross] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0,0 l" + dim + "," + dim + " M" + dim + ",0 l-" + dim + "," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle05Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.05,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle10Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.1,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle20Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.2,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle25Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.25,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle30Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.30,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle40Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.40,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle50Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.50,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle60Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.60,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle70Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.70,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle75Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.75,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle80Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.80,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyle90Percent] = function (data) {
        return new (L.Hatch.extend({
            percent: 0.90,
            path: percentFunc,
            dim: pathDim,
            pathStyle: percentPathStyle
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleLightDownwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0,0 l" + dim + "," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleLightUpwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0," + dim + " L" + dim + ",0";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDarkUpwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0," + dim + " L" + dim + ",0";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDarkDownwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0,0 l" + dim + "," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleWideDownwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            strokeWidth: 2,
            dim: 5,
            path: function (dim) {
                return "M0,0 l" + dim + "," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleWideUpwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            strokeWidth: 2,
            dim: 5,
            path: function (dim) {
                return "M0," + dim + " L" + dim + ",0";
            }
        }))(data);
    };

    predefinedPatterns[L.Hatch.HatchStyleLightHorizontal] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0,0 H" + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleLightVertical] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            path: function (dim) {
                return "M0,0 V" + dim;
            }
        }))(data);
    };

    predefinedPatterns[L.Hatch.HatchStyleNarrowHorizontal] = function (data) {
        return new (L.Hatch.extend({
            dim: 7,
            path: function (dim) {
                return "M0,0 l" + dim + ",0";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleNarrowVertical] = function (data) {
        return new (L.Hatch.extend({
            dim: 7,
            path: function (dim) {
                return "M0,0 l0," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDarkHorizontal] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            strokeWidth: 2,
            path: function (dim) {
                return "M0,0 l" + dim + ",0";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDarkVertical] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            strokeWidth: 2,
            path: function (dim) {
                return "M0,0 l0," + dim;
            }
        }))(data);
    };


    predefinedPatterns[L.Hatch.HatchStyleDashedDownwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            getHeight: function () {
                return this.dim * 2;
            },
            path: function (dim) {
                return "M0,0 l" + dim + "," + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDashedUpwardDiagonal] = function (data) {
        return new (L.Hatch.extend({
            getHeight: function () {
                return this.dim * 2;
            },
            path: function (dim) {
                return "M0," + dim + " L" + dim + ",0";
            }
        }))(data);
    };


    predefinedPatterns[L.Hatch.HatchStyleDashedHorizontal] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M0," + (dim / 2 - this.strokeWidth) + " H" + (dim / 2) + " M" + (dim / 2) + "," + (dim - this.strokeWidth) + " H " + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleTrellis] = function (data) {
        return new (L.Hatch.extend({
            strokeWidth: 1,
            pathStyle: function () {
                return "fill:none;stroke:" + (this.options.fillColor || "none") + "; stroke-width:" + this.strokeWidth;
            },
            getFillStyle: function () {
                return "fill:" + (this.options.color || "black") + ";";
            },
            path: function (dim) {
                return "M0," + (dim / 2 - this.strokeWidth) + " H" + (dim / 2) + " M" + (dim / 2) + "," + (dim - this.strokeWidth) + " H " + dim;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleHorizontalBrick] = function (data) {
        return new (L.Hatch.extend({
            dim: 20,
            pathStyle: function () {
                return "fill:" + (this.options.color || "black") + ";";
            },
            path: brickFunc
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDiagonalBrick] = function (data) {
        return new (L.Hatch.extend({
            dim: 20,
            pathStyle: function () {
                return "fill:" + (this.options.color || "black") + ";";
            },
            path: brickFunc
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDashedVertical] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M" + (dim / 2 - this.strokeWidth) + ",0 V" + (dim / 2) + " M" + (dim - this.strokeWidth) + "," + (dim / 2) + " V" + dim;
            }
        }))(data);
    };

    predefinedPatterns[L.Hatch.HatchStyleSmallConfetti] = function (data) {
        return new (L.Hatch.extend({
            strokeWidth: 1,
            getFillStyle: function () {
                return "fill:" + (this.options.fillColor || "none") + ";";
            },
            strokeDashArray: function () {
                return "1 1";
            },
            dim: 8,
            path: zigzagFunc
        }))(data);
    };

    predefinedPatterns[L.Hatch.HatchStyleLargeConfetti] = function (data) {
        return new (L.Hatch.extend({
            strokeWidth: 2,
            strokeDashArray: function () {
                return "2 2";
            },
            dim: 16,
            path: zigzagFunc
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleZigZag] = function (data) {
        return new (L.Hatch.extend({
            dim: 8,
            path: zigzagFunc
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleWave] = function (data) {
        return new (L.Hatch.extend({
            dim: 8,
            path: function (dim) {
                var dh = (this.getWidth() - this.strokeWidth) / 3,
                    dv = this.getHeight() / 3,
                    point = "l" + dh + "," + dv + " " + dh + ", -" + dv + " " + dh + ", " + dv,
                    patern = [-(dim / 4), dim / 4, dim * 3 / 4],
                    string = "";
                patern.forEach(function (value) {
                    string += "M0," + value + " " + point;
                });
                return string;
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleSolidDiamond] = function (data) {
        return new (L.Hatch.extend({
            pathStyle: function () {
                return "fill:" + (this.options.color || "black") + ";stroke:none";
            },
            path: function (dim) {
                return "M" + (dim / 2) + ",0 L" + dim + "," + (dim / 2) + " L" + (dim / 2) + "," + dim + " L0," + (dim / 2) + "z";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleLargeCheckerBoard] = function (data) {
        return new (L.Hatch.extend({
            pathStyle: function () {
                return "fill:" + (this.options.color || "black") + ";stroke:none";
            },
            path: function (dim) {
                return "M0,0 h" + (dim / 2) + " v" + (dim / 2) + " h" + (-dim / 2) + "zM" + (dim / 2) + "," + (dim / 2) + " h" + (dim / 2) + " v" + (dim / 2) + " h" + (-dim / 2) + "z";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleSmallCheckerBoard] = function (data) {
        return new (L.Hatch.extend({
            dim: 5,
            pathStyle: function () {
                return "fill:" + (this.options.color || "black") + ";stroke:none";
            },
            path: function (dim) {
                return "M0,0 h" + (dim / 2) + " v" + (dim / 2) + " h" + (-dim / 2) + "zM" + (dim / 2) + "," + (dim / 2) + " h" + (dim / 2) + " v" + (dim / 2) + " h" + (-dim / 2) + "z";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleOutlinedDiamond] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                return "M" + (dim / 2) + ",0 L" + dim + "," + (dim / 2) + " L" + (dim / 2) + "," + dim + " L0," + (dim / 2) + "z";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDottedDiamond] = function (data) {
        return new (L.Hatch.extend({
            strokeDashArray: function () {
                return this.strokeWidth + " " + this.strokeWidth;
            },
            path: function (dim) {
                return "M" + (dim / 2) + ",0 L" + dim + "," + (dim / 2) + " L" + (dim / 2) + "," + dim + " L0," + (dim / 2) + "z";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleSphere] = function (data) {
        return new (L.Hatch.extend({
            pathStyle: function () {
                return "fill:" + (this.options.color || "black") + ";stroke:none";
            },
            path: function (dim) {
                return "M0," + (dim / 2) + " A" + (dim / 2) + "," + (dim / 2) + " 0 1 0 0," + (dim / 2 - 0.00001) + "z" +
                    " M" + (dim / 2) + "," + (dim / 4) + " A" + (dim / 6) + "," + (dim / 10) + " 0 1 1 " + (dim / 2) + "," + (dim / 4 - 0.00001) + "z";
            }
        }))(data);
    };
    predefinedPatterns[L.Hatch.HatchStyleDivot] = function (data) {
        return new (L.Hatch.extend({
            path: function (dim) {
                var dimStepH = dim / 3,
                    dimStepV = dim / 6;
                return "M0,0 l" + dimStepH + "," + dimStepV + " " +
                    "l" + (-dimStepH) + "," + dimStepV + " " +
                    "M" + (3 * dimStepH) + "," + (3 * dimStepV) + " " +
                    "l" + (-dimStepH) + "," + dimStepV + " " +
                    "l" + dimStepH + "," + dimStepV + " ";
            }
        }))(data);
    };

}(L));
