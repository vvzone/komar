define(
    'models/person',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/client_sub_model'
    ],function($, _, Backbone, React, apiUrl, ClientSubModel){

        console.log('models/person loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,                
                first_name: null,
                patronymic_name: null,
                family_name: null,
                birth_date: null,
                birth_place: null,
                sex_types: null,
                inn: null,
                citizenship: null,
                deputy: null,
                person_post: null,
                client: null,
                identification_number: null,
                is_external: null
            },
            attr_rus_names: {
                first_name: 'Имя',
                patronymic_name: 'Отчество',
                family_name: 'Фамилия',
                birth_date: 'Дата рождения',
                birth_place: 'Место рождения',
                sex_types: 'Пол',
                inn: 'ИНН',
                citizenship: 'Гражданство',
                deputy: 'Заместитель',
                person_post: 'Должность',
                //client: 'Общая информация',
                identification_number: 'Идентификационный номер',
                is_external: 'Внешний'
            },
            sub_models: {
                client: 'client'
            },
            attr_dependencies: {
                //deputy: 'constant',
                /*deputy: 'deputy',*/
                sex_types: 'sex_types'
            }, //for recursive objects
            model_name: 'person',
            model_rus_name: 'Физлицо',
            beforeSave: function(){
                this.client.set('identification_number', this.get('identification_number'));
                this.client.set('is_external', this.get('is_external'));
            },
            parse: function(response, xhr){
                if (_.has(response, 'client')){
                    if(_.size(response.client)>0){
                        // Check if this model has a property called nodes
                        if (!_.has(this, 'client')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            //this.listValues = new ListCollection(response.listValues);
                            this.client = new ClientSubModel(response.client);
                            this.identifical_number = response.client.identifical_number; //?set
                            this.is_external = response.client.is_external;
                        } else {
                            // It does, so just reset the collection
                            this.client.reset(new ClientSubModel(response.client));
                            this.identifical_number = response.client.identifical_number;
                            this.is_external = response.client.is_external;
                        }
                    }
                }
                // Same for edge...
                return response;
            },
            url: function() {
                return apiUrl('person', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
