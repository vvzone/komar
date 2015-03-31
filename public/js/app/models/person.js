define(
    'models/person',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/client_sub_model',
        'models/user'
    ],function($, _, Backbone, React, apiUrl, ClientSubModel, UserSubModel){

        console.log('models/person loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,                
                first_name: null,
                patronymic_name: null,
                family_name: null,
                birth_date: null,
                birth_place: null,
                sex_type: 1,
                inn: null,
                citizenship: null,
                deputy: null,
                person_post: null,
                user: null
            },
            attr_rus_names: {
                first_name: 'Имя',
                patronymic_name: 'Отчество',
                family_name: 'Фамилия',
                birth_date: 'Дата рождения',
                birth_place: 'Место рождения',
                sex_type: 'Пол',
                inn: 'ИНН',
                citizenship: 'Гражданство',
                deputy: 'Заместитель',
                person_post: 'Должность',
                user: 'Профиль пользователя системы'
            },
            attr_dependencies: {
                deputy: 'constant', //'deputy'
                sex_types: 'sex_types',
                sex_type: 'sex_types'
            }, //for recursive objects
            model_name: 'person',
            model_rus_name: 'Физлицо',
            template: {
                edit: 'form/person'
            },
            form: {
                first_name: 'tiny_text',
                patronymic_name: 'tiny_text',
                family_name: 'tiny_text',
                birth_date: 'tiny_text',
                birth_place: 'tiny_text',
                sex_type: 'simple_select',
                inn: 'tiny_text',
                citizenship: 'tiny_text',
                deputy: 'simple_select',
                person_post: null, //simple_select
                user: 'model'
            },
            table: {
                columns: {
                    id: {
                        header: 'N',
                        value: function(value){
                            if(value.length){

                            }
                            return value;
                        }
                    },
                    family_name: {},
                    birth_date: {
                        value: function(value){
                            return value.date;
                        }
                    },
                    birth_place: {},
                    /*
                    sex_type: {
                        value: function(value){
                            value += '';
                            return value.substr(0, 1);
                        }
                    },
                    */
                    inn: {},
                    citizenship: {}
                }
            },
            parse: function(response, xhr){
                if (_.has(response, 'user')){
                    console.log('has');
                    if(_.size(response.user)>0){
                        console.log('>0');
                        // Check if this model has a property called nodes
                        response.user = new UserSubModel(response.user);
                    }else{
                        delete response.user;
                    }
                }
                return response;
            },
            /*
            beforeSave: function(){
                this.client.set('identification_number', this.get('identification_number'));
                this.client.set('is_external', this.get('is_external'));
            },
            */
            url: function() {
                return apiUrl('person', this.id);
            },
            initialize: function(){
                console.info('Model Person init');

                //when nested model is new
                this.set({
                    user: new UserSubModel()
                });

            }
        });

        return Model;
    }
);
