/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
(function (G) {
    "use strict";
    var $copyDiv, $copyMultiline, copyInput, copyInputMultiline;
    G.UI.Util = {
        saveDataToFile: function (dataType, data) {
            var str = "этот текст будет сохранен в файл";
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("msie") != -1 && ua.indexOf("opera") == -1 && ua.indexOf("webtv") == -1) { //IE
                var mydoc = window.open();
                mydoc.document.write(str);
                mydoc.document.execCommand("saveAs",true,".xml");
            }
            else { //другие браузеры
                var mydoc = window.open("data:application/download;charset=utf-8;base64," + btoa(str));
            }
        }
    };
    Gis.UI.loadZeroClipboard = function (callback) {
        require([Gis.config('relativePath') + "libs/ui/scripts/ZeroClipboard.js"], function (ZeroClipboard) {
            window.ZeroClipboard = ZeroClipboard;
            callback(ZeroClipboard);
        }, function () {
            Gis.notify('Не удалось загрузить ZeroClipboard, копирование в буфер обмена невозможно.', 'error')
        });
    }
    G.UI.uiUsersetInclude = function (userset, dataToInclude) {
        if (!userset) {
            return userset;
        }
        if (!G.Util.isArray(dataToInclude)) {
            dataToInclude = [dataToInclude];
        }
        return userset.concat(dataToInclude).unique();
    }
    G.UI.uiUsersetExclude = function (userset, dataToExclude) {
        var i, len;
        if (!userset) {
            return userset;
        }
        if (!G.Util.isArray(dataToExclude)) {
            dataToExclude = [dataToExclude];
        }
        userset = userset.slice();
        dataToExclude.forEach(function (value) {
            len = userset.length;
            for (i = 0; i < len; i += 1) {
                if (userset[i] === value) {
                    userset.splice(i, 1);
                    break;
                }
            }
        });
        return userset;
    };
    Gis.UI.preventDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        return this;
    };
    Gis.UI.disableTextSelection = function (map) {
        Gis.HTML.addEventListener(map || window, 'selectstart', Gis.UI.preventDefault);
    };
    Gis.UI.enableTextSelection = function (map) {
        Gis.HTML.removeEventListener(map || window, 'selectstart', Gis.UI.preventDefault);
    };

    Array.prototype.unique = function() {
        var a = this.slice();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };

    Gis.UI.restoreSelection = function() {
        if (this.saveSelection) {
            window.getSelection().removeAllRanges();
            for (var i = 0; i < this.saveSelection.length; i++) {
                window.getSelection().addRange(this.saveSelection[i]);
            }
            this.saveSelection = false;
        }
    };
    Gis.UI.isCopyApiSupported = function () {
        return (window.clipboardData && clipboardData.setData);
    };
    Gis.UI.isFlashSupported = function () {
        return !Gis.Util.isFileProtocol() && typeof navigator.mimeTypes['application/x-shockwave-flash'] !== 'undefined';
    };
    Gis.UI.isNeedUseZeroClipboard = function () {
        return !Gis.UI.isCopyApiSupported() && Gis.UI.isFlashSupported();
    };
    Gis.UI.getCoordinatesString = function (layer, converter, onlyFirstAndLast) {
        var center = layer.getLatLngArray ? layer.getLatLngArray() : Gis.latLng(layer.getCenter());
        if (center) {
            if (!Gis.Util.isArray(center)) {
                center = [center];
            }
            if (onlyFirstAndLast && center.length > 2) {
                center.splice(1,center.length - 2)
            }
            center = center.reduce(function (previousValue, currentValue) {
                return (previousValue ?
                        previousValue + "\n" :
                        '')
                    + converter.coordinateToText(Gis.latLng(currentValue))
            }, '');
            return center;
        } else {
//            Gis.notify('Позиция неопределена', 'warning');
        }
    }
    Gis.UI.copyToClipboard = function (s) {
        var $div;
        if (window.clipboardData && clipboardData.setData) {
            clipboardData.setData('text', s);
            return true;
        } else if (!this.isFlashSupported()) {
            $copyDiv = $copyDiv || $('<div><p>Прямое копирование не поддерживается. Скопируйте координаты из поля ниже.</p><textarea ></textarea></div>');
            copyInput = copyInput || $copyDiv[0].querySelector('textarea');
            if (copyInput) {
                copyInput.style.height = Math.min(200, (s.split("\n").length * 20)) + 'px';
                copyInput.value = s;
            }
            $copyDiv
                .dialog({
                    modal: true,
                    draggable: false,
                    dialogClass: 'no-title-bar copy-latlng',
                    resizable: false,
                    minHeight: 65,
                    autoOpen: true,
                    buttons: {
                        'Закрыть': function() {
                            $( this ).dialog( "close" );
                        }
                    },
                    open: function () {
                        copyInput = this.querySelector('textarea');
                        copyInput.setSelectionRange(0, copyInput.value.length);
                        copyInput.focus();
                    }
                });
        }
        return false;
    };
}(Gis));