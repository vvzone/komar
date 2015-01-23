"use strict";
/**
 *
 * @class
 * @extends Gis.BaseClass
 */
Gis.UI.Action = Gis.BaseClass.extend(
    /**
     * @lends Gis.UI.Action.prototype
     */
    {
    _type: undefined,
    _selectType: undefined,
    _executed: false,
    options: {
        useCache: true,
        dataBinded: undefined,
        noUI: false
    },
        _isActionAvailable: function (action) {
            var uiAvailable = this._ui.getMap().getSetting('ui');
            return uiAvailable &&  uiAvailable.indexOf(action.getType()) >= 0;
        },
        _layerSelected: function (e) {
        var layer = e.layer, newAction, layerId;
        layerId = layer.getParentId() || layer.getId();
        layer = this._ui.getMap().getLayer(layerId);
        if (layer.getType() !== this._selectType) {
            newAction = Gis.UI.ActionController.getAction(layer.getType());
            if (newAction && !newAction.isExecuted() && this._isActionAvailable(newAction)) {
                newAction.setData({dataBinded: layer});
                this._disable();
                newAction.fire('newactionexecuted', {action: newAction});
                newAction.execute();
            }
        } else {
            this._widget.bindData(layer);
        }
    },
    getFirstSelection: function () {
        var selected = this._ui.getMap().getSelected(),
            keys = Object.keys(selected);
        if (keys.length && selected[keys[0]].getType() === this._selectType) {
            return selected[keys[0]];
        }
        return undefined;
    },
    _layerUnSelected: function (e) {
        if (e.layer.getOriginalType() === this._selectType && this._widget.isAttachedToUi()) {
            this._widget.bindData(undefined);
        }
    },
    initialize: function (ui, data) {
        var cached = this.options.useCache && Gis.UI.ActionController.getAction(this.getType()), self;
        if (!cached) {
            self = this;
            this._ui = ui;
            Gis.BaseClass.prototype.initialize.call(this, data);
            this._executeFunction = function (e) {
                if (!Gis.UI.Action.DO_NOT_EXECUTE_ONCE) {
                    if (!self._executed) {
                        var lastExecuted = Gis.UI.ActionController.getLastExecuted();
                        if (lastExecuted && lastExecuted._type !== self._type) {
                            lastExecuted.closeAction();
                        }
                        self.fire('newactionexecuted', {action: self});
                        self.execute();
                    }
                    if (e) {
                        e.preventDefault();
                    }
                }
                Gis.UI.Action.DO_NOT_EXECUTE_ONCE = false;
            };
            Gis.UI.ActionController.pushAction(this);
        } else {
            throw new Error('You can not use constructor direct');
        }
    },
    getType: function () {
        return this._type;
    },
    isExecuted: function () {
        return this._executed;
    },
    attachToButton: function (container, className) {
        if (!this._containerAtached) {
            className = className.split(' ')[0];
            $(container).on('click', '.' + className, this._executeFunction);
            this._containerAtached = container;
            this._className = className;
        }
    },
    execute: function () {
        Gis.UI.ActionController.pushExecuted(this);
        this.options.dataBinded = this.options.dataBinded || this.getFirstSelection();
        this._executed = true;
        this._oldDraggable = this._ui.getMap().isDraggableEnabled();
        this._oldFilter = this._ui.getMap().getFilterSelect();
        if (this._containerAtached) {
            $('.' + this._className, this._containerAtached).addClass(Gis.UI.Action.SELECTED_CLASS_NAME);
        }
        this.initEvents();
    },
    bindData: function (data) {
        this.options.dataBinded = data;
    },
    _disable: function () {
        this._executed = false;
        this._ui.getMap().setDraggableEnabled(this._oldDraggable);
        if (this._containerAtached) {
            $('.' + this._className, this._containerAtached).removeClass(Gis.UI.Action.SELECTED_CLASS_NAME);
        }
        this.deInitEvents();
    },
    initEvents: function () {
        this._ui.getMap().on('layerselected', this._layerSelected, this);
        this._ui.getMap().on('layerunselected', this._layerUnSelected, this);
    },
    deInitEvents: function () {
        this._ui.getMap().off('layerselected', this._layerSelected, this);
        this._ui.getMap().off('layerunselected', this._layerUnSelected, this);
    },
    pause: function () {
        this.deInitEvents();
        if (this._widget) {
            this._widget.deactivate();
        }
    },
    resume: function () {
        this.initEvents();
        if (this._widget) {
            this._widget.activate();
        }
    },
    closeAction: function () {
        if (this._executed) {
            this._disable();
            this.options.noUI = false;
            Gis.UI.ActionController.popLastExecuted();
        }
    },
    getId: function () {
        this._id = this._id || Gis.Util.generateGUID();
        return this._id;
    }
});
/**
 * Пропустить выполнение один раз
 * @type {boolean}
 */
Gis.UI.Action.DO_NOT_EXECUTE_ONCE = false;

Gis.UI.Action.SELECTED_CLASS_NAME = 'selected';