define(
    'models/sex_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/sex_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null
            },
            validation: {
                name: {
                    required: true,
                    msg: "Обязательное поле"
                },
                short_name: {
                    required: true,
                    msg: "Обязательное поле"
                }
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Краткое название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'sex_type',
            model_rus_name: 'Пол',
            url: function() {
                return apiUrl('sex_type', this.id);
            },
            initialize: function(){
                this.on('change', function(){
                    this.validate();
                    this.bind('validated:invalid', function(model, errors) {
                        this.validationErrors = errors;
                    });
                })
            }
        });

        return Model;
    }
);
