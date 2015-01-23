/**
 * Created with PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function () {
    function generateObjectName(object) {
        return object.getName() || object.getTypeName(object.getType()) || 'Неизвестный объект';
    }


    var baseGenerator = function (object) {
        var name = generateObjectName(object),
            additional = this.additionalData(object);
        return "<span class='gis-name'>" + name + "</span><span class='additional'>" + additional + "</span>";
    },
        icoGenerator = function (object) {
            var icon = object.getOptionsWithStyle().icon, baseHtml='';
            if (icon) {
                baseHtml = "<div class='ico-preview' data-id='" + object.getId() + "' width='24' height='24'></div>";
            }

            return baseHtml;
        };

    Gis.UI.TitleGenerators = {
        post : icoGenerator,
        source : icoGenerator,
        _generateRowName: function (object) {
            return baseGenerator.call(this, object);
        },
        generateRowNameText: function (object) {
            return generateObjectName(object);
        },
        _generateIco: function (object) {
            if (this[object.getType()]) {
                return this[object.getType()].call(this, object);
            }
            return '';
        },
        updateText: function (e, element) {
            var name = $('.gis-name', element),
                $additional = $('.additional', element),
                objectName = generateObjectName(e.target),
                objectData = this.additionalData(e.target);
            if (name.text() !== objectName) {
                name.text(objectName);
            }
            if ($additional.text() !== objectData) {
                $additional.text(objectData);
            }
        },

        additionalData: function (object) {
            return Gis.UI.getCoordinatesString(object, this, true);
        }
    }
}());