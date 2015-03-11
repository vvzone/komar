define(
    'models/client',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config',
        'models/person',
        'models/unit'
    ],function($, _, Backbone, React, apiUrl, Config, PersonModel, UnitModel){
        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/client loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                is_external: null,
                identification_number: null,
                full_name: null,
                name: null,
                type: null, //is_person o is_unit
                person: null,
                unit: null
            },
            attr_description:{
                is_external: 'Внешний корреспондент',
                identification_number: 'Идентификационный номер',
                full_name: 'Полное название',
                person: 'Физ лицо',
                unit: 'Юр лицо'
            },
            attr_rus_names: {
                is_external: 'Внешний корреспондент',
                identification_number: 'Идентификационный номер',
                full_name: 'Полное название',
                person: 'Физ лицо',
                unit: 'Юр лицо'
            },
            model_name: 'client',
            model_rus_name: 'Клиент',
            sub_model: {
              person: 'person',
              unit: 'unit'
            },
            attr_dependencies: {
                //тут может быть только коллекция для соответвующего id элемента
                //base_attr_type: 'constant',
                //attribute_type_childs: 'attribute_type_childs' //запрашиваем коллекцию
            }, //for recursive objects
            list_output: {
                name: 'full_name'
            },
            table_output: {

            },
            form: {
                identification_number: 'tiny_text',
                is_external: 'bool',
                full_name: 'tiny_text'
            },
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

                (debug)?console.info('->beforeSave'):null;
                if (_.size(this.get('person'))>0) {
                    var new_list_values = this.get('person').map(function(model){
                        return model;
                    });
                    this.set('person', new_list_values);
                }
                if (_.size(this.get('unit'))>0) {
                    var new_list_values = this.get('unit').map(function(model){
                        return model;
                    });
                    this.set('unit', new_list_values);
                }
            },
            parse: function(response, xhr) {

                if (debug) {
                    console.info('parse call');
                    console.info('response');
                    console.log(response);
                    console.log('xhr');
                    console.log(xhr);
                }
                // Check if response includes some nested collection data... our case 'nodes'
                if (_.has(response, 'person')){
                    (debug)?console.info('_.has person'):null;
                    if(_.size(response.person)>0){
                        (debug)?console.info('_.size(response.person)>0'):null;
                        // Check if this model has a property called nodes
                        if (!_.has(this, 'person')) {  // It does not...
                            (debug)?console.info('!_.has(this.person) ... this.person set new PersonModel(response.person)'):null;
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.person = new PersonModel(response.person);
                        } else {
                            // It does, so just reset the collection
                            this.person.reset(new PersonModel(response.person));
                        }
                    }
                }
                if (_.has(response, 'unit')){
                    if(_.size(response.unit)>0){
                        // Check if this model has a property called nodes
                        if (!_.has(this, 'unit')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.unit = new UnitModel(response.unit);
                        } else {
                            // It does, so just reset the collection
                            this.unit.reset(new UnitModel(response.unit));
                        }
                    }
                }
                // Same for edge...
                return response;
            },
            initialize: function(){
                if(debug){
                    console.info('CLIENT-Model init');
                    console.info(this);
                }
                //
                /* remove on production!!! */
                if (_.has(this.attributes, 'person')){
                    (debug)?console.log('_.has person'):null;
                    if(_.size(this.get('person'))>0){
                        (debug)?console.log('person>0'):null;
                        // Check if this model has a property called nodes
                        /*
                         console.log('this');
                         console.log(this);
                         */
                        //if (!_.has(this.attributes, 'person')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.set('person', new PersonModel(this.get('person'))); //Для реальной модели - расскоментить RESET пустой модели
                        /*} else {
                            // It does, so just reset the collection
                            this.get('person').reset(this.get('person'));
                        }*/
                    }
                }
                if (_.has(this.attributes, 'unit')){
                    (debug)?console.log('_.has unit'):null;
                    if(_.size(this.attributes.unit)>0){
                        (debug)?console.log('unit>0'):null;
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
                (debug)?console.warn('KABOOM!'):null;
            }

        });

        return Model;
    }
);
