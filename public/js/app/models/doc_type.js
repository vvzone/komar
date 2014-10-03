define(
    'models/position',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/position loaded');

        var Position = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                attributes_types: null
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                attributes_types: 'Типы атрибутов'
            },
            attr_dependencies: {
                'allowed_ranks': 'ranks',
                'attributes_types': ''
            }, //for recursive objects
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

        return Position;
    }
);
