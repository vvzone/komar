"use strict";

/**
 * Упрощает работу с HTML
 * @type {{listView: Function, hasClass: Function, addClass: Function, removeClass: Function, addEventListener: Function}}
 */
Gis.HTML = {
    /**
     * создает псевдоселект
     * @param {Object} options эмеленты списка
     * */
    listView: function (options) {
        var noText, html = "", rowsHTML = "", selectorButtonContainerClass = 'html-select-view-title-container', selectorButtonClass = 'html-select-view-selector', closedClass = 'closed', data, container, callback, context, defaultValue, callbackBefore, onBeforeOpen;
        data = options.data;
        container = options.container;
        if (!container) {
            return {
                setValueSelected: function () {},
                getValueSelected: function () {}
            };
        }
        callback = options.callback;
        callbackBefore = options.onBeforeSelect;
        onBeforeOpen = options.onBeforeOpen;
        context = options.context;
        noText = options.noText;
        defaultValue = options.defaultValue || (data && data[0]);
        function closeSelect() {
            this.style.display = 'none';
            Gis.HTML.addClass(this.parentNode.querySelector(selectorButtonContainerClass), closedClass);
        }
        function closeAllSelects() {
            var rows = document.querySelectorAll('.html-select-view'),
                selects = document.querySelectorAll("." + selectorButtonContainerClass),
                i = 0, len = selects.length;
            if (rows.length) {
                for (i = 0, len = rows.length; i < len; i += 1) {
                    rows[i].style.display = 'none';
                }
            }
            if (selects.length) {
                for (i = 0, len = selects.length; i < len; i += 1) {
                    Gis.HTML.addClass(selects[i], closedClass);
                }
            }
        }
        function openSelect() {
            this.style.display = 'block';
            Gis.HTML.removeClass(this.parentNode.querySelectorAll('.' + selectorButtonContainerClass), closedClass);
        }

        function rowClicked(callBack, context, callBackBefore) {
            return function () {
                if (!Gis.HTML.hasClass(this, 'html-list-title') && !callBackBefore || !callBackBefore.call(context, this.getAttribute('data-value'))) {
                    var titleContailer = container.querySelector('.html-select-view-title');
                    titleContailer.setAttribute('data-value', this.getAttribute('data-value'));
                    if (!noText) {
                        titleContailer.innerHTML = this.innerHTML;
                    }
                    Gis.HTML.removeClass(container.querySelectorAll('.selected'), 'selected');
                    Gis.HTML.addClass(this, 'selected');
                    if (callBack) {
                        callBack.call(context, this.getAttribute('data-value'));
                    }
                    closeSelect.call(container.querySelector('.html-select-view'));
                }
            };
        }

        function rowKeyPressed(e) {
            var returnKeyCode = 13;
            if (e.keyCode === returnKeyCode || e.charCode === ("" + returnKeyCode)) {
                rowClicked.call(this, e);
            }
        }

        var isCanOpen = function () {
            return !onBeforeOpen || onBeforeOpen(container);
        };

        function titleClicked(e) {
            if (isCanOpen() && Gis.HTML.hasClass(this, closedClass)) {
                openSelect.call(this.parentNode.querySelector('.html-select-view'));
                e.stopPropagation();
                return false;
            }
            closeSelect.call(this.parentNode.querySelector('.html-select-view'));
        }

        function initEvents(callBack, context, container) {
            var rows = (container || document).querySelectorAll('.html-select-view-row');
            Gis.HTML.addEventListener(rows, 'click', rowClicked(callBack, context, callbackBefore));
            Gis.HTML.addEventListener(rows, 'keypress', rowKeyPressed);
            if (!Gis.HTML.hasClass(document.body, 'list-initialized')) {
                Gis.HTML.addClass(document.body, 'list-initialized');
                Gis.HTML.addEventListener(document.body, 'click', closeAllSelects);
            }
            Gis.HTML.addEventListener((container || document).querySelector('.html-select-view-title-container'), 'click', titleClicked);
        }

        function initHtml(data, container, callBack, context, defaultValue) {
            var dv = defaultValue.val,
                val,
                html,
                dn = defaultValue && defaultValue.name;

            function generateRowHtml(data) {
                var val = data.val, row = data.row, dv = data.selected, child = data.childs, prefix = row.prefix || '';
                return "<li class='" + (child ? 'html-list-title ':'html-list-active ') + "html-select-view-row" + (dv === (prefix + val) ? " selected" : "") + "' data-value='" + prefix + val + "'>" + row.name + (child || '') + "</li>";
            }

            if (data && data.forEach) {

                data.forEach(function (row) {
                    html = '';
                    val = row.val;
                    if (Gis.Util.isArray(row.childs)) {
                        row.childs.forEach(function (value) {
                            html += generateRowHtml({val: value.val, row: value, selected: dv, childs: false})
                        });
                        if (html) {
                            html = '<ul class="ui-list-childs">' + html + '</ul>';
                        }
                    }
                    rowsHTML += generateRowHtml({val: val, row: row, selected: dv, childs: html});
                });
                html = "<div class='html-select-view-container'>" +
                    "<div class='html-select-view-title-container " + closedClass + "'>" +
                        "<span class='html-select-view-title' data-value='" + dv + "'>" + dn + "</span>" +
                        "<span class='" + selectorButtonClass + " '></span>" +
                    "</div>" +
                    "<ul class='html-select-view' style='display: none'>" + rowsHTML + "</ul>" +
                    "</div>";
                container.innerHTML = html;
                initEvents(callBack, context, container);
                return container.querySelector('.html-select-view-container');
            }
        }

        return (function (container) {
            return {
                setValueSelected: function (value) {
                    if (this.getValueSelected() !== value) {
                        var listElements, i, len, element, title, selected = false;
                        value = value + "";
                        Gis.HTML.removeClass(container.querySelectorAll('.selected'), 'selected');
                        listElements = container.querySelectorAll('.html-select-view-row');
                        title = container.querySelector('.html-select-view-title');
                        for (i = 0, len = listElements.length; i < len; i += 1) {
                            element = listElements[i];
                            if (element.getAttribute('data-value') === value) {
                                Gis.HTML.addClass(element, 'selected');
                                title.setAttribute('data-value', value);
                                selected = true;
                                if (!noText) {
                                    title.innerHTML = element.innerHTML;
                                }
                            }
                        }
                        if (!selected) {
                            Gis.HTML.removeClass(listElements, 'selected');
                            title.setAttribute('data-value', "");
                            title.innerHTML = "";
                        }
                        callback.call(context, value);
                    }
                },
                getValueSelected: function () {
                    var title = container.querySelector('.html-select-view-title');
                    if (title) {
                        return title.getAttribute('data-value');
                    }
                }
            }
        }(initHtml(data, container, callback, context, defaultValue)));
    },

    hasClass: function (el, name) {
        return (el.className.length > 0) &&
            new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
    },

    addClass: function (el, name) {
        if (el) {
            el.classList.add(name)
        }
    },

    removeClass: function (el, name) {
        var i;

        function replaceFn(w, match) {
            if (match === name) { return ''; }
            return w;
        }

        function replaceClass(el) {
            el.className = el.className
                .replace(/(\S+)\s*/g, replaceFn)
                .replace(/(^\s+|\s+$)/, '');
        }

        if (el) {
            if (el.className) {
                el.classList.remove(name);
            } else if (el.length) {
                for (i = el.length - 1; i >= 0; i -= 1) {
                    el[i].classList.remove(name);
                }
            }
        }
    },
    addEventListener: function (object, type, callback) {
        var id;
        if (object.addEventListener) {
            object.addEventListener(type, callback);
        } else if (object[0] && object[0].addEventListener) {
            for (id in object) {
                if (object.hasOwnProperty(id) && object[id].addEventListener) {
                    object[id].addEventListener(type, callback);
                }
            }
        }
    },
    removeEventListener: function (object, type, callback) {
        var id;
        if (object.removeEventListener) {
            object.removeEventListener(type, callback);
        } else if (object[0] && object[0].removeEventListener) {
            for (id in object) {
                if (object.hasOwnProperty(id) && object[id].removeEventListener) {
                    object[id].removeEventListener(type, callback);
                }
            }
        }
    },
    LOADER_HTML: '<div class="windows8"><div class="container"><div class="wBall" id="wBall_1">' +
        '<div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3">' +
        '<div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5">' +
        '<div class="wInnerBall"></div></div></div></div>'
};