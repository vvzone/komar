define(
    'models/post',
    [
        'jquery',
        'underscore',
        'backbone',
        //'backbone_validation',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){ //Validation,

        console.log('models/post loaded');

        var Position = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null,
                description: null,
                allowed_ranks: null
            },
            validation: {
                name: {
                    required: true,
                    length: 4,
                    msg: 'Некорректное название должности (4 символа минимум)'
                }
            },
            attr_description: {
                allowed_ranks: 'Массив объектов типа ranks'
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокр. название',
                description: 'Описание',
                allowed_ranks: 'Соответсвующие звания'
            },
            model_name: 'post',
            model_rus_name: 'Должность',
            attr_dependencies: {'allowed_ranks': 'allowed_ranks'}, //for recursive objects
            /* there is may needed collection-file for every dependency, for use one dependency-entity for many controls */
            url: function() {
                return apiUrl('post', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('change', function(){
                    console.info('change');
                    console.info(['isValid', this.isValid()]);
                })
            }

        });

        return Position;
    }
);
