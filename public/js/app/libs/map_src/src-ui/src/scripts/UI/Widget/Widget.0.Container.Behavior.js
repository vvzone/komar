/**
 * Container for gui Widgets
 */
(function (G) {
    "use strict";
    G.Widget.ContainerBehavior = {
        child: null,
        /**
         * @param {Gis.Widget.Base} Widget
         * **/
        addChild: function (Widget) {
            if (Widget.isControlAvailable(null, this._ui.getMap()) && !this.containsChild(Widget) && Widget.canFitTo(this)) {
                this._$container.parent().show();
                this.child.push(Widget);
                Widget.onAdd(this);
            }
        },
        hideChilds: function (exclude) {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (this.child[i] && exclude !== this.child[i]) {
                    this.child[i].hide();
                }
            }
        },
        showChilds: function () {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (this.child[i]) {
                    this.child[i].show();
                }
            }
        },
        swapVisible: function () {
            if (!this.child.length) {
                this._$container.parent().hide();
            } else {
                this._$container.parent().show();
            }
        }, /**
         * @param {Gis.Widget.Base} Widget
         * **/
        removeChild: function (Widget) {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (Widget === this.child[i]) {
                    delete this.child[i];
                }
            }
            Widget.onRemove();
            this.swapVisible();
        },
        removeWidgetByType: function (type) {
            var i, len,
                childs = this.child;
            for (i = 0, len = childs.length; i < len; i += 1) {
                if (type === childs[i].getType()) {
                    this.removeChild(childs[i]);
                }
            }
        },
        containsChild: function (Widget) {
            var i, len;
            for (i = 0, len = this.child.length; i < len; i += 1) {
                if (Widget === this.child[i]) {
                    return true;
                }
            }
            return false;
        }
    };
}(Gis));
