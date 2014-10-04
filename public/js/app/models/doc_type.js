define(
    'models/doc_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/doc_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                urgency_types: null,
                secrecy_types: null,
                attributes_types: null
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                urgency_types: 'Срочность',
                secrecy_types: 'Секретность',
                attributes_types: 'Типы атрибутов'
            },
            attr_dependencies: {
                'urgency_types': 'urgency_types',
                'secrecy_types': 'secrecy_types',
                'attribute_types': 'attribute_types'
            }, //for recursive objects
            model_name: 'doc_type',
            url: function() {
                return apiUrl('doc_type', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                /*this.on('change', function(){
                    console.error('model -> change');
                }, this);*/
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        return Model;
    }
);
