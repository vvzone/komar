"use strict";
/**
 * Стиль заливки
 * @enum
 * @type {number}
 */
Gis.Hatch = {
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
    HatchStyleTrellis: 46,
    HatchStyleSphere: 47,
    HatchStyleSmallGrid: 48,
    HatchStyleSmallCheckerBoard: 49,
    HatchStyleLargeCheckerBoard: 50,
    HatchStyleOutlinedDiamond: 51,
    HatchStyleSolidDiamond: 52
};
Gis.getAvailableHathes = function () {
    return Object.keys(Gis.Hatch);
};
Gis.Hatch.HatchStyleLargeGrid = Gis.Hatch.HatchStyleCross;