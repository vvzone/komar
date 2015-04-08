define(
    'models/attribute_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config',
        'models/attribute_type_lists_collection'
    ],function($, _, Backbone, React, apiUrl, Config, ListCollection){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/attribute_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                base_attr_type: 1, // 1 - для нового документа
                verification_type: null, //id хранимой в БД функции верификации
                attribute_type_lists: [],
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
            attr_description:{
                attribute_type_lists: 'Массив объектов -> attribute_type_list, отдается для объектов с base_attr_type = 8',
                parents: 'Массив атрибутов верхнего уровня, напр. для точки - маршрут, треугольник и тп.',
                all_parents: 'Массив идентификаторов всех атрибутов куда входит данный атрибут, например, для атрибута "Название" это будут все составные атрибуты, у которых есть название',
                attribute_type_childs: 'Массив объектов атрибутов нижнего уровня. Для точки это x,y,название',
                items: 'Служебное поле клиентской части'
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                base_attr_type: 'Базовый тип аттрибута',
                verification_type: 'Тип верификации',
                attribute_type_lists: 'Значения типа атрибута список',
                max: 'Максимальное значение',
                min: 'Минимальное значение',
                mask: 'Маска',
                max_length: 'Максимальная длина строки',
                attribute_type_childs: 'Дочерние типы атрибутов'
            },
            model_name: 'attribute_type',
            model_rus_name: 'Тип атрибута',
            form: {
                current_child_attributes: 'tiny_text',
                attribute_type_lists: 'simple_list'
            },
            attr_dependencies: {
                base_attr_type: 'constant',
                attribute_type_childs: 'attribute_type_childs', //запрашиваем коллекцию
                //list_values: 'attribute_type_lists'
                attribute_type_lists: 'attribute_type_lists'
            },
            //list_values: new ListCollection(),
            /*
            hidden_fields:{
                list_values: {base_attr_type: 8},
                max: {base_attr_type: [1,2,4,5,6,7]},
                min: {base_attr_type: [1,2,4,5,6,7]},
                mask: {base_attr_type: 3},
                max_length: {base_attr_type: [3]},
                attribute_type_childs: {base_attr_type: [9]}
            },*/
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
                (debug)?console.info('->beforeSave'):null;
                if (_.size(this.get('list_values'))>0) {
                    var new_list_values = this.get('list_values').map(function(model){
                        return model;
                    });
                    this.set('list_values', new_list_values);
                }
            },
            parse: function(response, xhr) {
                if(debug){
                    console.info('parse call');
                    console.info('response');
                    console.log(response);
                    console.log('xhr');
                    console.log(xhr);
                }
                // Check if response includes some nested collection data... our case 'nodes'
                /*
                if (_.has(response, 'list_values')){
                    if(_.size(response.list_values)>0){
                        // Check if this model has a property called nodes
                        if (!_.has(this, 'list_values')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            this.list_values = new ListCollection(response.list_values);
                        } else {
                            // It does, so just reset the collection
                            this.list_values.reset(response.list_values);
                        }
                    }
                }
                */
                // Same for edge...
                return response;
            },
            initialize: function(){
                (debug)?console.info('Model init'):null;
                if(_.has(this, 'list_values')){
                    (debug)?console.log('rewrite attr.list_values with collection...'):null;
                    this.set('list_values', this.list_values);
                }
            }
        });

        return Model;
    }
);
