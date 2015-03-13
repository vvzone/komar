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
                sex_types: null,
                inn: null,
                citizenship: null,
                deputy: null,
                person_post: null,
                user: null
                //client: null,
                //identification_number: null,
                //is_external: null
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
                user: 'Профиль пользователя системы'
                //client: 'Общая информация',
                //identification_number: 'Идентификационный номер',
                //is_external: 'Внешний'
            },
            sub_models: {
                client: 'client'
            },
            attr_dependencies: {
                deputy: 'constant', //'deputy'
                sex_types: 'sex_types'
            }, //for recursive objects
            model_name: 'person',
            model_rus_name: 'Физлицо',
            form: {
                first_name: 'tiny_text',
                patronymic_name: 'tiny_text',
                family_name: 'tiny_text',
                birth_date: 'tiny_text',
                birth_place: 'tiny_text',
                sex_types: 'simple_select',
                inn: 'tiny_text',
                citizenship: 'tiny_text',
                deputy: 'simple_select',
                person_post: null, //simple_select
                user: 'model'
            },
            parse: function(response, xhr){
                if (_.has(response, 'user')){
                    console.log('has');
                    if(_.size(response.user)>0){
                        console.log('>0');
                        // Check if this model has a property called nodes
                        //response.user = new UserSubModel(response.user);
                        response.user = new UserSubModel(response.user);
                        /*
                        if (!_.has(this, 'user')) {  // It does not...
                            // So instantiate a collection and pass in raw data
                            console.log('this !has');
                            response.user = new UserSubModel(response.user);
                        } else {
                            console.log('this else');
                            // It does, so just reset the collection
                            //response.user.reset(new UserSubModel(response.user));
                            this.attributes.user.reset(new UserSubModel(response.user));
                        }
                        */
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
