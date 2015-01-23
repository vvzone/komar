/**
 * Created by Пользователь on 13.04.14.
 */
(function (L) {
    'use strict';
    L.PopupBehavior = {
        _opened: false,
        bindPopup: function (content, options) {
            if (!this._popup) {
                this
                    .on('mouseover', this.openPopup, this)
                    .on('mousemove', this._movePopup, this)
                    .on('mouseout remove', this.closePopup, this);

                if (L.Browser.touch) {
                    this.on('click', this.openPopup, this);
                }
            }
            this._popup = new L.PopupGis(options, this)
                .setContent(content);
            this._popup.setOffset(L.point(0, -5));

            return this;
        },

        unbindPopup: function () {
            if (this._popup) {
                this.closePopup();
                this._popup = null;
                this
                    .off('mouseover', this.openPopup)
                    .off('mousemove', this._movePopup)
                    .off('mouseout remove', this.closePopup);
            }
            return this;
        },
        autoTooltip: function (e) {
            if (this.getToolTip && this.getToolTip(e.latlng)) {
                this._popup.setContent(this.getToolTip(e.latlng));
            }
        },
        _movePopup: function (e) {
            this.openPopup(e);
            this.autoTooltip(e);
            this._popup.setLatLng(e.latlng);
        },

        openPopup: function (e) {
            if (!this._opened && this._popup && this._map) {
                this._popup.setLatLng(e.latlng);
                this.autoTooltip(e);
                this._map.openPopup(this._popup);
                this._opened = true;
            }

            return this;
        },

        closePopup: function () {
            if (this._popup) {
                this._popup._close();
                this._opened = false;
            }
            return this;
        }
    };
}(L));