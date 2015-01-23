/**
 * Created by Пользователь on 21.04.14.
 */
(function (global) {
    'use strict';

    function getTitleSwitcher($switcher) {
        if ($switcher.hasClass(CHECKED_CLASS)){
            return "Сбросить все";
        }
        return "Выделить все";
    }
    var CHECKED_CLASS = 'checked',
        SOME_CHECKED_CLASS = 'some-checked',
        STATE_ALL_SELECTED = 1,
        STATE_NOTHING_SELECTED = 0,
        STATE_SOME_SELECTED = -1,
        SWITCH_ALL_CLASS = 'checkbox-switch-all';
    Gis.checkAll = {
        initialize: function (_super) {
            _super();
        },
        _updateCheckedState: function () {
            var checkedState = this._stateChecked();
            switch (checkedState) {
                case STATE_ALL_SELECTED:
                    this._swithchAll.addClass(CHECKED_CLASS);
                    this._swithchAll.removeClass(SOME_CHECKED_CLASS);
                    break;
                case STATE_SOME_SELECTED:
                    this._swithchAll.addClass(SOME_CHECKED_CLASS);
                    this._swithchAll.removeClass(CHECKED_CLASS);
                    break;
                case STATE_NOTHING_SELECTED:
                    this._swithchAll.removeClass(CHECKED_CLASS);
                    this._swithchAll.removeClass(SOME_CHECKED_CLASS);
                    break;
            }

            this._swithchAll.next().text(getTitleSwitcher(this._swithchAll));
        },
        _createEventListeners: function () {
            var self = this;
            this._switchAllClikcked = this._switchAllClikcked || function () {
                self.$container.tooltip('close');
                var stateChecked = self._stateChecked();
                if (!stateChecked || stateChecked === STATE_SOME_SELECTED) {
                    $('li span.checkbox', self._$layerList).addClass(CHECKED_CLASS);
                    $('.checkbox', this).addClass(CHECKED_CLASS);
                } else {
                    $('li span.checkbox', self._$layerList).removeClass(CHECKED_CLASS);
                    $('.checkbox', this).removeClass(CHECKED_CLASS);
                }
                $('li span.checkbox', self._$layerList).removeClass(SOME_CHECKED_CLASS);
                self.fire('change');
                return false;
            };
        },
        _stateChecked: function () {
            var unChecked = $('li span.checkbox', this.$checkBoxList),
                checked = $('li span.checkbox.' + CHECKED_CLASS, this.$checkBoxList);
            if (unChecked.length === checked.length) {
                return STATE_ALL_SELECTED;
            }
            if (checked.length) {
                return STATE_SOME_SELECTED;
            }
            return STATE_NOTHING_SELECTED;
        },
        setSwitchContainer: function ($aContainer, $aCheckBoxList) {
            this.$container = $aContainer;
            this.$checkBoxList = $aCheckBoxList;
            this._swithchAll = this.findSwitchAll();
        },
        findSwitchAll: function () {
            return $('.' + SWITCH_ALL_CLASS + ' span', this.$container);
        },
        switcherHtml: function (tag) {
            tag = tag || 'div';
            return "<" + tag +  " class='button-checkbox " + SWITCH_ALL_CLASS + "'><span class='checkbox'></span><span class='name'></span></" + tag +  ">\n";
        },
        initSwitcherEvents: function () {
            this._createEventListeners();
            this.$container.on('click', '.' + SWITCH_ALL_CLASS, this._switchAllClikcked);
            this.$container.tooltip({
                items: '.' + SWITCH_ALL_CLASS,
                track: true,
                content: function() {
                    return getTitleSwitcher($(this));
                }
            });
            if (this._updateButtonState) {
                this.on('change', this._updateButtonState, this);
            }
        },
        deInitSwitcherEvents: function () {
            this.$container.off('click', '.' + SWITCH_ALL_CLASS, this._switchAllClikcked);
            if (this._updateButtonState) {
                this.off('change', this._updateButtonState, this);
            }
        }
    };
}(this || self));