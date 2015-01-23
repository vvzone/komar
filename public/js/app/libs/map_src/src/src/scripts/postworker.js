var tracer = {
    options: {
        traceLengthSeconds: 0,
        traceLengthMeters: 10000
    },
    getTraceLengthSeconds: function () {
        return this.options.traceLengthSeconds || Gis.Config.style.DefaultTrackBehavior.traceLengthSeconds;
    },
    getTraceLengthMeters: function () {
        return this.options.traceLengthMeters || Gis.Config.style.DefaultTrackBehavior.traceLengthMeters;
    },
    /**
     * вычисляет точку на отрезке между двумя точками в определнный момент времени
     * @param {Object} cropped более старая точка (отсекаемая)
     * @param {Object} next более новая точка (будет следовать за вычисленной точкой)
     * @param {int} timestamp временная метка для новой позиции
     * @returns {int[]} координаты новой точки
     * */
    findMiddleInTime: function (cropped, next, timestamp) {
        var croppedStamp = cropped.getTimeStamp(),
            nextStamp = next.getTimeStamp(),
            tLen1 = timestamp - croppedStamp,
            tLen2 = nextStamp - timestamp,
            cropLng = cropped.getLatLng(),
            nextLng = next.getLatLng();

        // принимаем участок пути за прямой отрезок
        return Gis.position({
            latitude: (tLen2 * cropLng[0] + tLen1 * nextLng[0]) / (tLen1 + tLen2),
            longitude: (tLen2 * cropLng[1] + tLen1 * nextLng[1]) / (tLen1 + tLen2),
            parentId: cropped.getParentId(),
            timeStamp: timestamp
        });
    },

    needCrop: function () {
        return this.getTraceLengthSeconds() > 0 || this.getTraceLengthMeters() > 0;
    },
    /**
     * усеченный массив точек. выбирает наименьший исходя из пути и пройденного времени
     * @param {Gis.Objects.Position[]} points массив точек @link Gis.Objects.Position уже отсортированный
     * @param {int} [timestamp] время для которого нужно определить позицию
     * @returns {Gis.Objects.Position[]} массив в котором отсечены все невидимые точки
     * */
    getVisiblePoints: function (points, timestamp) {
        var byTime = this.positionByLen(points),
            byLength = this.positionInTime(points, timestamp);

        return byTime.length > byLength.length ? byLength : byTime;
    },
    showFirstPoint: function (points) {
        var i, len;
        if (this._showFirst) {
            for (i = 0, len = points.length; i < len; i += 1) {
                if (this._showFirst === points[i].getId()) {
                    points[i].setLastShowedTime(points[i].calculateNextStamp());
                }
            }
        }
        return i;
    },
    /**
     * усеченный массив точек
     * @param {Gis.Objects.Position[]} points массив точек @link Gis.Objects.Position уже отсортированный
     * @param {int} [timestamp] время для которого нужно определить позицию
     * @returns {Gis.Objects.Position[]} массив в котором отсечены все невидимые точки
     * */
    positionInTime: function (points, timestamp) {
        var i = 0,
            len = points.length - 1,
            nextPosIndex,
            result = points,
            boundStamp,
            nextPos,
            currentTimestamp,
            lastStamp;

        currentTimestamp = (new Date()).getTime() / 1000;
        boundStamp = timestamp || currentTimestamp - this.getTraceLengthSeconds();
        this.showFirstPoint(points);
        if (this.getTraceLengthSeconds()) {
            for (i; i < len; i += 1) {
                nextPosIndex = i + 1;
                nextPos = points[nextPosIndex];
                lastStamp = points[i].getLastShowedTime(points[i - 1], nextPos);
                if (points[i].getLastShowedTime(points[i - 1], nextPos) < boundStamp) {
                    result = [];
                    if (nextPos.getLastShowedTime(points[i], points[i + 2]) > boundStamp) {
                        result = points.slice(nextPosIndex);
                        result.unshift(this.findMiddleInTime(points[i], nextPos, boundStamp));
                        break;
                    }
                }
            }
            this._showFirst = false;
            result = result.length ? result : points.slice(len);
            if (result.length === 1) {
                result[0].setLastShowedTime(result[0].calculateNextStamp());
                this._showFirst = result[0].getId();
            }
        }
        return result;
    },
    /**
     * возвращает крайнюю точку учитывая длину пути
     * @param {Gis.Objects.Position[]} points массив точек @link Gis.Objects.Position уже отсортированный
     * @returns {Gis.Objects.Position[]} массив в котором отсечены все невидимые точки
     * */
    positionByLen: function (points) {
        var i = points.length - 1,
            distance = 0;
        if (this.getTraceLengthMeters() && i > 0) {
            for (i; i > 0; i -= 1) {
                distance += this.distanceTo(points[i].getLatLng(), points[i - 1].getLatLng());
                if (distance > this.getTraceLengthMeters()) {
                    return points.slice(i);
                }
            }
        }
        return points;
    },
    distanceTo: function (from, to) {
        var d2r = Math.PI / 180,
            dLat = (to[0] - from[0]) * d2r,
            dLon = (to[1] - from[1]) * d2r,
            lat1 = from[0] * d2r,
            lat2 = to[0] * d2r,
            sin1 = Math.sin(dLat / 2),
            sin2 = Math.sin(dLon / 2),
            a;

        a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

        return this.R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
};

function parseMessage(data) {
    data = JSON.parse(data);
    if (data.options) {
        tracer.options = data.options;
    }
    var visiblePoints = tracer.getVisiblePoints(data.points);
    var response = {time: new Date().getTime(), points: visiblePoints};
    postMessage(JSON.stringify(response));
}
onmessage = function (oEvent) {
    postMessage(parseMessage(oEvent.data));
};