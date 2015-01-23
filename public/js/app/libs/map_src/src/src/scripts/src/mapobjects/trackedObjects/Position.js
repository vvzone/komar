(function () {
    "use strict";
    var prefix = "_position";
    /**
     * @class
     * @classdesc
     * Позиция поста или объекта
     * @param {Object} options
     * @param {string} [options.tacticObjectType='position'] тип
     * @param {GUID} options.parentId GUID ИРИ или поста
     * @param {number} options.timeStamp UTC timestamp
     * @param {number} options.latitude широта
     * @param {number} loptions.ongitude долгота
     * @param {number} [options.course] истиный курс
     * @param {Gis.Objects.Base[]} [options.artifacts] артифакты в текущей позиции
     * @example
     * var a = Gis.position({
     *      id: Gis.Util.generateGUID(),
     *      parentId: parent.getId(),
     *      timeStamp: new Date().getTime(),
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      course: 35
     * }).addTo(gisMap)
     * @extends Gis.Objects.Base
     */
    Gis.Objects.Position = Gis.Objects.Base.extend(
        /** @lends Gis.Objects.Position.prototype */
        {
            required: ['parentId', 'timeStamp', 'latitude', 'longitude'],
            fixed: 'parentId tacticObjectType',
            lastShowedStamp: undefined,
            _id: Gis.Util.generateGUID(),
            options: {
                tacticObjectType: 'position',
                parentId: undefined,
                timeStamp: undefined,
                latitude: undefined,
                longitude: undefined,
                course: undefined,
                artifacts: undefined
            },
            optionsFire: [
                'tacticObjectType',
                'id',
                'latitude',
                'longitude',
                'parentId',
                'course',
                'tags',
                'caption',
                'tooltip',
                'artifacts'
            ],
            initialize: function (data) {
                this._id = Gis.Util.generateGUID();
                Gis.Objects.Base.prototype.initialize.call(this, data);
            },
            getLayers: function () {
                return Gis.Objects.Base.prototype.getLayers.call(this) || (this._parent && this._parent.getLayers());
            },
            setData: function (data, val) {
                this.clearPositions();
                if (data && (data.artifacts || data === 'artifacts')) {
                    this.closeArtifacts();
                }
                return Gis.Objects.Base.prototype.setData.apply(this, arguments);
            },
            /**
             *
             * @return {number}
             */
            getCourse: function () {
                return this.getOption('course');
            },
            /**
             *
             * @return {Array.<Gis.Objects.Base>}
             */
            getArtifacts: function () {
                return this.getOption('artifacts');
            },
            drawArtifacts: function (map) {
                var artifacts = this.options.artifacts, self = this;
                if (artifacts && artifacts.length) {
                    artifacts.forEach(function (artifact, index) {
                        if (artifact.tacticObjectType) {
                            artifact = Gis.ObjectFactory.createObject(Gis.Util.extend(artifact, {draggable: false, selectable: false}));
                            self.options.artifacts[index] = artifact;
                        }
                        if (!self._map.hasLayer(artifact)) {
                            artifact.setControllableByServer(false);
                            artifact.setData({draggable: false, selectable: false});
                        }
                        artifact.addTo(self._map);
                    });
                }
            },
            /**
             * Поудалять артефакты
             * @param map
             */
            closeArtifacts: function (map) {
                map = this._map || Gis.Map.CURRENT_MAP;
                if (map) {
                    var artifacts = this.options.artifacts;
                    if (artifacts && artifacts.length) {
                        artifacts.forEach(function (artifact) {
                            if (artifact.draw) {
                                map.removeLayer(artifact);
                            }
                        });
                        delete this.options.artifacts;
                    }
                }
            },
            getLastShowedTime: function (previousPosition, nextPosition) {
                this.lastShowedStamp = this.lastShowedStamp || this.calculateNextStamp(previousPosition, nextPosition);
                return this.lastShowedStamp;
            },
            setLastShowedTime: function (stamp) {
                this.lastShowedStamp = stamp;
                return this;
            },
            /**
             *
             * @param [previousPosition]
             * @param [nextPosition]
             * @ignore
             * @returns {*}
             */
            calculateNextStamp: function (previousPosition, nextPosition) {
                var currStamp = new Date().getTime() / 1000;
                return nextPosition ?
                        (previousPosition ? previousPosition.getTimeStamp() +
                            (previousPosition.getTimeStamp() - nextPosition.getTimeStamp()) / 2 : nextPosition.getTimeStamp()) :
                        currStamp;
            },
            /**
             *
             * @return {*}
             */
            getParentId: function () {
                return this.options.parentId;
            },
            onAdd: function (map) {
                this._parent = map.getLayer(this.options.parentId);
                if (!this._parent) {
                    console.error('Parent with id =' + this.options.parentId + " not found in object controller");
                }
                Gis.Objects.Base.prototype.onAdd.call(this, map);
                this._parent.on("remove hided clearmeta", this.onClosePoint, this);
                this._parent.on("hided", this.closeArtifacts, this);
                this._parent.fire("attach", {to: this});
            },
            clearPositions: function () {
                this._latLng = undefined;
                this._latLngObject = undefined;
                this._distanceTo = undefined;
            },
            onDelete: function (e) {
                if (this._parent) {
                    this._parent.off("remove hided clearmeta", this.onClosePoint, this);
                    this._parent.off("hided", this.closeArtifacts, this);
                }
                this.clearPositions();
                this.closeArtifacts();
                Gis.Objects.Base.prototype.onDelete.call(this, e);
                this.pushToCache();
            },
            preAdd: function (map) {
                var parent = map.getLayer(this.options.parentId);
                if (!parent) {
                    map.requestObject(this.options.parentId, this);
                }
                return parent;
            },
            /**
             * @override
             * @private
             */
            _clearData: function () {
                Gis.Objects.Base.prototype._clearData.call(this);
                this._mapRenderer = undefined;
                this._parent = undefined;
                Gis.Util.extend(this.options, {
                    parentId: undefined,
                    timeStamp: undefined,
                    latitude: undefined,
                    longitude: undefined,
                    course: undefined,
                    artifacts: undefined
                });
                this.clearPositions();
            },
            onClosePoint: function () {
                if (this._map || Gis.Map.CURRENT_MAP) {
                    (this._map || Gis.Map.CURRENT_MAP).removeLayer(this);
                } else {
                    console.error("this._map not found un Position!!!!");
                }
            },
            /**
             *
             * @return {*}
             */
            getCaption: function () {
                return this.getOption('caption');
            },
            /**
             *
             * @return {*}
             */
            getToolTip: function () {
                return this.getOption('toolTip');
            },
            /**
             * @deprecated используйте {@link Gis.Objects.Position#getLatLngObject}
             * @returns {undefined|*}
             */
            getLatLng: function () {
                if (!this._latLng) {
                    this._latLng = [parseFloat(this.getOption('latitude')), parseFloat(this.getOption('longitude'))];
                }
                return this._latLng;
            },
            /**
             * @returns {Gis.LatLng}
             */
            getLatLngObject: function () {
                if (!this._latLngObject) {
                    this._latLngObject = Gis.latLng(parseFloat(this.getOption('latitude')), parseFloat(this.getOption('longitude')));
                }
                return this._latLngObject;
            },
            getId: function () {
                return prefix + this.options.parentId + this.options.timeStamp;
            },
            /**
             *
             * @param {Gis.Objects.Position} position
             */
            distanceTo: function (position) {
                if (this._toPoint !== position || !this._distanceTo) {
                    this._distanceTo = this.getLatLngObject().distanceTo(position.getLatLngObject());
                    this._toPoint = position;
                }
                return this._distanceTo;
            },
            /**
             *
             * @return {number}
             */
            getTimeStamp: function () {
                return this.options.timeStamp;
            },
            setTimeStamp: function (stamp) {
                this.options.timeStamp = stamp;
                return this;
            },
            isControllable: function () {
                return false;
            }
        }
    );
    Gis.position = function (data) {
        return new Gis.Objects.Position(data);
    };
    /**
     * сравнивает две точки
     * @param {Gis.Objects.Position} a
     * @param {Gis.Objects.Position} b
     * @param {Boolean} down по убыванию
     * @returns {int}
     * */
    Gis.Objects.Position.sortFunction = function (a, b, down) {
        var timeStamp1 = a.getTimeStamp(),
            timeStamp2 = b.getTimeStamp(),
            index = down ? -1 : 1;
        return (timeStamp1 > timeStamp2 ? 1 : timeStamp1 < timeStamp2 ? -1 : 0) * index;
    };
    /**
     * сортирует точки по дате
     * @param {Object} points ассоциативный массив @link Gis.Objects.Position
     * */
    Gis.Objects.Position.sort = function (points) {
        return points.sort(Gis.Objects.Position.sortFunction);
    };
    Gis.ObjectFactory.list.position = Gis.Objects.Position;
}());