define(
    'models/client',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/person',
        'models/unit'

    ],function($, _, Backbone, React, apiUrl, PersonModel, UnitModel){

        console.log('models/client loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                id_external: null,
                ident_number: null,
                full_Name: null,
                person: [],
                unit: []
            },
            attr_description:{
                list_values: 'Массив объектов -> attribute_type_list, отдается для объектов с base_attr_type = 8',
                parents: 'Массив атрибутов верхнего уровня, напр. для точки - маршрут, треугольник и тп.',
                all_parents: 'Массив идентификаторов всех атрибутов куда входит данный атрибут, например, для атрибута "Название" это будут все составные атрибуты, у которых есть название',
                attribute_type_childs: 'Массив объектов атрибутов нижнего уровня. Для точки это x,y,название',
                items: 'Служебное поле клиентской части'
            },
            attr_rus_names: {
                is_external: 'Внешний корреспондент',
                ident_number: 'Идентификационный номер',
                full_Name: 'Полное название',
                person: 'Физ лицо',
                unit: 'Юр лицо'
            },
            model_name: 'client',
            model_rus_name: 'Клиент',
            attr_dependencies: {
                base_attr_type: 'constant',
                attribute_type_childs: 'attribute_type_childs' //запрашиваем коллекцию
            }, //for recursive objects
            url: function() {
                return apiUrl('client', this.id);
            },
            save: function (key, val, options) {
                this.beforeSave(key, val, options);
                return Backbone.Model.prototype.save.call(this, key, val, options);
            },
            beforeSave: function(key, val, options){
                /*
                * возможно стоит сохранять не скопом, а по отдельности
                * */
                
                // ТУТ СОХРАНЯЕТСЯ КОЛЛЕКЦИЯ ДЛЯ CLIENT БУДЕТ ОТДЕЛЬНАЯ МОДЕЛЬ!
                console.info('->beforeSave');
                if (_.size(this.get('person'))>0) {
                    var new_list_values = this.get('person').map(function(model){
                        return model;
                    });
                    this.set('list_values', new_list_values);
                }
                if (_.size(this.get('unit'))>0) {
                    var new_list_values = this.get('unit').map(function(model){
                        return model;
                    });
                    this.set('unit', new_list_values);
                }
            },
            parse: function(response, xhr) {

                console.info('parse call');
                console.info('response');
                console.log(response);
                console.log('xhr');
                console.log(xhr);

                // Check if response includes some nested collection data... our case 'nodes'
                if (_.has(response, 'person')){
                    if(_.size(response.person)>0){
                        // Check if this model has a property called nodes
                        /*
                        console.log('this');
                        console.log(this);
                        */
                        if (!_.has(this, 'person')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.person = new PersonModel(response.person);
                        } else {
                            // It does, so just reset the collection
                            this.person.reset(response.person);
                        }
                    }
                }
                if (_.has(response, 'unit')){
                    if(_.size(response.unit)>0){
                        // Check if this model has a property called nodes
                        /*
                         console.log('this');
                         console.log(this);
                         */
                        if (!_.has(this, 'unit')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.unit = new UnitModel(response.unit);
                        } else {
                            // It does, so just reset the collection
                            this.unit.reset(response.unit);
                        }
                    }
                }
                // Same for edge...
                return response;
            },
            initialize: function(){
                console.info('CLIENT-Model init');
                console.info(this);
                /*
                if(_.has(this, 'person')){
                    console.log('rewrite person');
                    this.set('person', this.person);
                }*/
                //
                /* remove on production!!! */
                if (_.has(this.attributes, 'person')){
                    console.log('_.has person');
                    if(_.size(this.get('person'))>0){
                        // Check if this model has a property called nodes
                        /*
                         console.log('this');
                         console.log(this);
                         */
                        //if (!_.has(this.attributes, 'person')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.set('person', new PersonModel(this.get('person')));
                            //this.attributes.person = new PersonModel(this.attributes.person);
                        /*} else {
                            // It does, so just reset the collection
                            this.get('person').reset(this.get('person'));
                            //this.attributes.person.reset(this.attributes.person);
                        }*/
                    }
                }
                if (_.has(this.attributes, 'unit')){
                    console.log('_.has unit');
                    if(_.size(this.attributes.unit)>0){
                        // Check if this model has a property called nodes
                        /*
                         console.log('this');
                         console.log(this);
                         */
                        //if (!_.has(this.attributes, 'unit')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.set('unit', new UnitModel(this.get('unit')));
                        /*} else {
                            // It does, so just reset the collection
                            this.get('unit').reset(this.get('unit'));
                        }*/
                    }
                }
                /* remove on production!!! */
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
