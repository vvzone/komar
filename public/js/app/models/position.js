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
                short_name: null,
                description: null,
                allowed_ranks: null
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокр. название',
                description: 'Описание',
                allowed_ranks: 'Соответсвующие звания'
            },
            attr_dependencies: {'allowed_ranks': 'ranks'}, //for recursive objects
            url: function() {
                return apiUrl('position', this.id);
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
