define(
    'models/region',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/region loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                code: null,
                region_type: null,
                description: null
            },
            validation: {
                name: {
                    required: true,
                    msg: "Обязательное поле"
                },
                code: {
                    required: true,
                    msg: "Обязательное поле"
                }
            },
            attr_description:{
                region_types: 'Объект типа региона'
            },
            attr_rus_names: {
                name: 'Название',
                code: 'Код',
                region_type: 'Тип региона',
                description: 'Описание'
            },
            attr_dependencies: {
                region_type: 'region_types'
            }, //for recursive objects
            model_name: 'region',
            model_rus_name: 'Регион',
            url: function() {
                return apiUrl('region', this.id);
            },
            initialize: function(){
                this.on('change', function(){
                    console.info('change');
                    console.info(['validate', this.validate()]);
                    console.info(['isValid', this.isValid()]);
                    console.info(['this', this]);
                    this.bind('validated:invalid', function(model, errors) {
                        this.validationErrors = errors;
                    });
                })
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        return Model;
    }
);
