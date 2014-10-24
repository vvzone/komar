define(
    'models/attribute_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/attribute_type_list_collection'

    ],function($, _, Backbone, React, apiUrl, ListCollection){

        console.log('models/attribute_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                base_attr_type: 1, // 1 - для нового документа
                verification_type: null, //id хранимой в БД функции верификации
                list_values: [],
                /*list_values_collection: [],*/
                max: null,
                min: null,
                mask: null,
                max_length: null,
                parents: [], // [] _.size>0 массив атрибутов верхнего уровня, напр для точки - маршрут, треугольник и тп.
                all_parents: [],
                attribute_type_childs: [], //[] массив атрибутов нижнего уровня, напр для точки - x, y.  в виде дерева с сервера при tree=1, или id при tree=0
                items: [] //[] для хранения сформированного на client-side дерева,
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                base_attr_type: 'Базовый тип аттрибута',
                verification_type: 'Тип верификации',
                list_values: 'Значения типа атрибута список',
                max: 'Максимальное значение',
                min: 'Минимальное значение',
                mask: 'Маска',
                max_length: 'Максимальная длина строки',
                attribute_type_childs: 'Дочерние типы атрибутов'
                /*parent: 'Состоит из типов атрибутов:'*/
            },
            model_name: 'attribute_type',
            model_rus_name: 'Тип атрибута',
            attr_dependencies: {
                base_attr_type: 'constant',
                attribute_type_childs: 'attribute_type_childs' //запрашиваем коллекцию
            }, //for recursive objects
            hidden_fields:{
                /* rules to show hidden fields:
                 * field_name: {dependent_from_filed_name: value/array of values}
                 */
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
                list_values: {base_attr_type: 8},
                max: {base_attr_type: [1,2,4,5,6,7]},
                min: {base_attr_type: [1,2,4,5,6,7]},
                mask: {base_attr_type: 3},
                max_length: {base_attr_type: [3]},
                attribute_type_childs: {base_attr_type: [9]}
            },
            url: function() {
                return apiUrl('attribute_type', this.id);
            },
            save: function (key, val, options) {
                this.beforeSave(key, val, options);
                return Backbone.Model.prototype.save.call(this, key, val, options);
            },
            beforeSave: function(key, val, options){
                /*
                * возможно стоит сохранять не скопом, а по отдельности
                * */
                console.info('->beforeSave');
                if (_.size(this.get('list_values'))>0) {
                    var new_list_values = this.get('list_values').map(function(model){
                        return model;
                    });
                    this.set('list_values', new_list_values);
                }
            },
            parse: function(response, xhr) {
                /*
                console.info('parse call');
                console.info('response');
                console.log(response);
                console.log('xhr');
                console.log(xhr);
                */
                // Check if response includes some nested collection data... our case 'nodes'
                if (_.has(response, 'list_values')){
                    if(_.size(response.list_values)>0){
                        // Check if this model has a property called nodes
                        /*
                        console.log('this');
                        console.log(this);
                        */
                        if (!_.has(this, 'list_values')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.list_values = new ListCollection(response.list_values);
                        } else {
                            // It does, so just reset the collection
                            this.list_values.reset(response.list_values);
                        }
                    }
                }
                // Same for edge...
                return response;
            },
            initialize: function(){
                console.info('Model init');
                if(_.has(this, 'list_values')){
                    console.log('rewrite attr.list_values with collection...');
                    this.set('list_values', this.list_values);
                }
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
