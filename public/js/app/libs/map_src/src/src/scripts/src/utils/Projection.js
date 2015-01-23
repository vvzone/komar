/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */

(function (G) {
    "use strict";
    G.Projection = {
        R: 6378137,
        L: 40075000,
        MERIDIAN_LENGTH: 20003930,
        /**
         * вычисляет расстояние от точки до точки
         * @param {Array.<number>|Gis.LatLng} from [широта, долгота]
         * @param {Array.<number>|Gis.LatLng} to [широта, долгота]
         * */
        distanceTo: function (from, to) {
            var d2r = Math.PI / 180,
                dLat = (to[0] - from[0]) * d2r,
                dLon = (to[1] - from[1]) * d2r,
                lat1 = from[0] * d2r,
                lat2 = to[0] * d2r,
                sin1 = Math.sin(dLat / 2),
                sin2 = Math.sin(dLon / 2),
                a,
                distance;

            a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

            distance = this.R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return distance;
        },

        nextPointByLen: function (d, startPoint, azimuth) {
            var srcLat, dstLat, srcLon, dstLon, bearing, longitude;
            startPoint = G.latLng(startPoint);
            srcLon = G.Util.gradToRad(startPoint.lng);
            srcLat = G.Util.gradToRad(startPoint.lat);
            bearing = G.Util.gradToRad(azimuth);
            dstLat = Math.asin(Math.sin(srcLat) * Math.cos(d / (G.Projection.R)) +
                Math.cos(srcLat) * Math.sin(d / G.Projection.R) * Math.cos(bearing));
            dstLon = srcLon + Math.atan2(Math.sin(bearing) * Math.sin(d / G.Projection.R) * Math.cos(srcLat),
                Math.cos(d / G.Projection.R) - Math.sin(srcLat) * Math.sin(dstLat));
            longitude = G.Util.radToGrad(dstLon);
            return [G.Util.radToGrad(dstLat), longitude];
        },
        getNextBearingPointSimplifiedLongitude: function (startPoint, endPoint) {
            var increase, lngDiff;
//            lngDiff = Gis.LatLng.longitudeDifference(startPoint, endPoint);
//            if (lngDiff >= 180) {
//                lngDiff = lngDiff % 360;
//                increase = (-360 + lngDiff) * (startPoint.lng < endPoint.lng ? 1 : -1);
//                endPoint.lng = startPoint.lng + increase;
//            }
            return endPoint;
        },
        calculateNextBearingPoint: function (startPoint, endPoint) {
            var angle;
            startPoint = Gis.latLng(startPoint);
            endPoint = Gis.latLng(endPoint);
            angle = this.calculateAsimuth(startPoint, endPoint);
            return Gis.latLng(this.nextPointByLen(startPoint.distanceTo(endPoint), startPoint, angle));
        },
        /**
         * @param {Gis.LatLng} startPoint
         * @param {Gis.LatLng} endPoint
         * @param step
         * */
        bearingByPoints: function (startPoint, endPoint, step) {
            var angle,
                len,
                points = [],
                point,
                bearingLen,
                endPointTmp;
            step = step || 80000;
            startPoint = Gis.latLng(startPoint);
            endPoint = Gis.latLng(endPoint);
            endPointTmp = Gis.Projection.getNextBearingPointSimplifiedLongitude(startPoint, endPoint);
            endPoint.lng = endPointTmp.lng;
            angle = this.calculateAsimuth(startPoint, endPoint);
            bearingLen = startPoint.distanceTo(endPoint);
            for (len = 0; Math.abs(len) <= bearingLen; len += step) {
                point = this.nextPointByLen(len, startPoint, angle);
                points.push(point);
            }
            if (len !== bearingLen) {
                point = this.nextPointByLen(bearingLen, startPoint, angle);
                points.push(point);
            }
            return points;
        },
        absLongitude: function (lng) {
            return lng >= 0 ? lng : 360 + (lng % 360);
        },
        /**
         * @param {Gis.LatLng} startPoint
         * @param {Gis.LatLng} endPoint
         * */
        calculateAsimuth: function (startPoint, endPoint) {
            var lat1, lat2, dLon = G.Util.gradToRad(startPoint.lng) - G.Util.gradToRad(endPoint.lng);
            lat1 = G.Util.gradToRad(startPoint.lat);
            lat2 = G.Util.gradToRad(endPoint.lat);
            return -G.Util.radToGrad(Math.atan2(Math.sin(dLon) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon))) % 360;
        },
        /**
         * @param {Gis.LatLng} startPoint
         * @param {Gis.LatLng} endPoint
         * */
        calculateLoxodromeAngle: function (startPoint, endPoint) {
            var lat1, lat2, lon2, lon1, angle;
            lat1 = G.Util.gradToRad(startPoint.lat);
            lat2 = G.Util.gradToRad(endPoint.lat);
            lon1 = G.Util.gradToRad(startPoint.lng);
            lon2 = G.Util.gradToRad(endPoint.lng);
            angle = G.Util.radToGrad(Math.atan(Math.cos((lat1 + lat2) / 2) * (lon2 - lon1) / (lat2 - lat1))) % 360;
            if (angle < 0) {
                angle = 360 + angle;
            }
            if (lat1 > lat2 && lon1 > lon2) {
                angle = 180 + angle;
            } else if (lat1 > lat2 && lon1 < lon2) {
                angle = angle - 180;
            }
            return angle;
        },
        /**
         *
         * @param p1
         * @param p2
         * @param p3
         * @returns {*}
         */
        calculateAngleBetwet3PointsRad: function (p1, p2, p3) {
            var d1 = p2.angle(p1);
            var d2 = p2.angle(p3);
            return Math.acos(
                (Math.cos(p1.angle(p3)) - Math.cos(d1)* Math.cos(d2)) /
                    (Math.sin(d1)* Math.sin(d2))
            );
        },
        /**
         *
         * @param p1
         * @param p2
         * @param p3
         * @returns {*}
         */
        calculateAngleBetwet3Points: function (p1, p2, p3) {
            return Gis.Util.radToGrad(this.calculateAngleBetwet3PointsRad(p1, p2, p3));
        },
        /**
         * Точка пересечения ортодромий
         * @param {Gis.LatLng} p1
         * @param {Gis.LatLng} p2
         * @param {Gis.LatLng} p3
         * @param {Gis.LatLng} p4
         * @returns {Gis.LatLng|null}
         */
        calculateIntersectionOfOrtho: function (p1, p2, p3, p4) {
            var array = [p1, p2, p3, p4], maxLat = -Infinity, minLat = Infinity, minLng = Infinity, maxLng = -Infinity,
                bounds1 = Gis.latLngBounds(p1, p2),
                bounds2 = Gis.latLngBounds(p3, p4);
            var latLng = this.intersection(p1, this.calculateAsimuth(p1, p2), p3, this.calculateAsimuth(p3, p4));
            if (!latLng) {
                return null;
            }
            for (var i = 0, len = array.length; i < len; i += 1) {
                maxLat = Math.max(maxLat, array[i].lat);
                minLat = Math.min(minLat, array[i].lat);
                maxLng = Math.max(maxLng, array[i].lng);
                minLng = Math.min(minLng, array[i].lng);
            }
            if (!bounds1.contains(latLng) || !bounds2.contains(latLng)) {
                return null;
            }
            console.log(latLng);
            return latLng;
        }
    };
    Number.prototype.toRadians = function () { return this * Math.PI / 180; };
    Number.prototype.toDegrees = function () { return this * 180 / Math.PI; };
    /**
     * Точка пересечения пеленгов
     * @param {Gis.LatLng} p1
     * @param {number} brng1
     * @param {Gis.LatLng} p2
     * @param {number} brng2
     * @returns {Gis.LatLng}
     */
    G.Projection.intersection = function(p1, brng1, p2, brng2) {
        // see http://williams.best.vwh.net/avform.htm#Intersection

        var φ1 = p1.lat.toRadians(), λ1 = p1.lng.toRadians();
        var φ2 = p2.lat.toRadians(), λ2 = p2.lng.toRadians();
        var θ13 = Number(brng1).toRadians(), θ23 = Number(brng2).toRadians();
        var Δφ = φ2-φ1, Δλ = λ2-λ1;

        var δ12 = 2*Math.asin( Math.sqrt( Math.sin(Δφ/2)*Math.sin(Δφ/2) +
            Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2) ) );
        if (δ12 === 0) {
            return null;
        }

        // initial/final bearings between points
        var θ1 = Math.acos( ( Math.sin(φ2) - Math.sin(φ1)*Math.cos(δ12) ) /
            ( Math.sin(δ12)*Math.cos(φ1) ) );
        if (isNaN(θ1)) {
            θ1 = 0;
        } // protect against rounding
        var θ2 = Math.acos( ( Math.sin(φ1) - Math.sin(φ2)*Math.cos(δ12) ) /
            ( Math.sin(δ12)*Math.cos(φ2) ) );

        var θ12, θ21;
        if (Math.sin(λ2-λ1) > 0) {
            θ12 = θ1;
            θ21 = 2*Math.PI - θ2;
        } else {
            θ12 = 2*Math.PI - θ1;
            θ21 = θ2;
        }

        var α1 = (θ13 - θ12 + Math.PI) % (2*Math.PI) - Math.PI; // angle 2-1-3
        var α2 = (θ21 - θ23 + Math.PI) % (2*Math.PI) - Math.PI; // angle 1-2-3

        if (Math.sin(α1)===0 && Math.sin(α2)===0) {
            return null;
        } // infinite intersections
        if (Math.sin(α1)*Math.sin(α2) < 0) {
            return null;
        }      // ambiguous intersection

        //α1 = Math.abs(α1);
        //α2 = Math.abs(α2);
        // ... Ed Williams takes abs of α1/α2, but seems to break calculation?

        var α3 = Math.acos( -Math.cos(α1)*Math.cos(α2) +
            Math.sin(α1)*Math.sin(α2)*Math.cos(δ12) );
        var δ13 = Math.atan2( Math.sin(δ12)*Math.sin(α1)*Math.sin(α2),
            Math.cos(α2)+Math.cos(α1)*Math.cos(α3) );
        var φ3 = Math.asin( Math.sin(φ1)*Math.cos(δ13) +
            Math.cos(φ1)*Math.sin(δ13)*Math.cos(θ13) );
        var Δλ13 = Math.atan2( Math.sin(θ13)*Math.sin(δ13)*Math.cos(φ1),
            Math.cos(δ13)-Math.sin(φ1)*Math.sin(φ3) );
        var λ3 = λ1 + Δλ13;
        λ3 = (λ3+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180°

        var rawLat = φ3.toDegrees();
        var rawLng = λ3.toDegrees();
        return !isNaN(rawLat) && !isNaN(rawLng) && new Gis.LatLng(rawLat, rawLng);
    };
}(Gis));
