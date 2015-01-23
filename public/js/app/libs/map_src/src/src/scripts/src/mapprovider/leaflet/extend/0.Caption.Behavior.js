/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
L.CaptionBehavior = (function (L) {
    'use strict';
    return {
        bindLabel: function (content, options) {
            if (this._label && !options) {
                this._label.setContent(content);
                this._moveLabel();
                if (this._map && !this._map.hasLayer(this._label)) {
                    this.showLabel();
                }
                return this;
            }
            var anchor = L.point(0, 0);

            anchor = anchor.add(L.Label.prototype.options.offset);

            if (options && options.offset) {
                anchor = anchor.add(options.offset);
            }

            options = L.Util.extend({offset: anchor}, options);

            if (!this._label) {
                this
                    .on('remove', this.hideLabel, this)
                    .on('move', this._moveLabel, this);

                this._haslabelHandlers = true;
            }

            this._label = new L.Label(options, this)
                .setContent(content);
            this.showLabel();
            this._label.setIconOffset(this._labelIconOffset());
            this._label.setOffset(this._calculateLabelOffset());
            return this;
        },
        _calculateLabelOffset: function () {
            return L.point(0, 0);
        },
        _labelIconOffset: function () {
            return L.point(0, 0);
        },
        getLabelLatLng: function () {
            Gis.extendError();
        },

        hideLabel: function () {
            if (this._label) {
                this._label.close();
                this._map.closeLabel(this._label);
            }
            return this;
        },
        showLabel: function () {
            if (this._label && this._map) {
                this._label.setLatLng(this.getLabelLatLng());
                this._map.showLabel(this._label);
            }

            return this;
        },

        _moveLabel: function () {
            if (this._label) {
                this._label.setLatLng(this.getLabelLatLng());
            }
        },
        unbindLabel: function () {
            if (this._label) {
                this.hideLabel();

                delete this._label;

                if (this._haslabelHandlers) {
                    this
                        .off('remove', this.hideLabel)
                        .off('move', this._moveLabel);

                }

                this._haslabelHandlers = false;
            }
            return this;
        }

    };
}(L));
