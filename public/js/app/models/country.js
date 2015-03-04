define(
    'models/country',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){
        console.log('models/country loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                code: null,
                name: null,
                full_name: null
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
            attr_rus_names: {
                name: 'Название',
                code: 'Код',
                full_name: 'Полное название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'country',
            model_rus_name: 'Страна',
            url: function() {
                return apiUrl('country', this.id);
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
