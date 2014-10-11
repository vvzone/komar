define(
    'models/attribute_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/attribute_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                base_attr_type: null, // 3 - text, список - 8,
                /*
                * Системные типы:
                 •	целое,  1
                 •	вещественное, 2
                 •	текст,  3
                 •	булевский, 4
                 •	Дата, 5
                 •	Время,  6
                 •	Дата/время, 7
                 •	Список,8
                 •	Составной.
                 * */
                verification_type: null, //id хранимой в БД функции верификации
                listValues: [],
                max: null,
                min: null,
                mask: null,
                length: null,
                parents: [], // [] _.size>0 массив атрибутов верхнего уровня, напр для точки - маршрут, треугольник и тп.
                allParents: [],
                attribute_type_childs: [], //[] массив атрибутов нижнего уровня, напр для точки - x, y.  в виде дерева с сервера при tree=1, или id при tree=0
                items: [] //[] для хранения сформированного на client-side дерева,
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                base_attr_type: 'Базовый тип аттрибута',
                verification_type: 'Тип верификации',
                listValues: 'Варианты значений:',
                max: 'Максимальное значение',
                min: 'Минимальное значение',
                mask: 'Маска',
                length: 'Длина строки',
                attribute_type_childs: 'Дочерние типы атрибутов'
                /*parent: 'Состоит из типов атрибутов:'*/
            },
            model_name: 'attribute_type',
            model_rus_name: 'Тип атрибута',
            attr_dependencies: {
                attribute_type_childs: 'attribute_type_childs' //запрашиваем коллекцию
            }, //for recursive objects
            url: function() {
                return apiUrl('attribute_type', this.id);
            },
            initialize: function(){
                console.info('Model init');
                /*
                дерево тут не нужно
                if (Array.isArray(this.get('childs'))) {
                    console.log('model init -> has child\'s');
                    if(!AttributeTypeCollection){
                        console.log('loading sub-collection for child\'s');
                        var AttributeTypeCollection = require("models/attribute_types_collection");
                    }
                    var AttributeTypeCollection = new AttributeTypeCollection(this.get('childs'));
                    this.set({items: AttributeTypeCollection});
                }*/
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
