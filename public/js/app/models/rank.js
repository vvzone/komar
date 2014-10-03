define(
    'models/rank',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/rank loaded');

        var Rank = Backbone.Model.extend({
            defaults: {
                name: null,
                is_officer: false,
                description: 'Без описания'
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокр. название',
                description: 'Описание',
                /*order: 'Порядок',*/
                is_officer: 'Офицер'
            },
            attr_dependencies: [], //for recursive objects
            url: function() {
                return apiUrl('rank', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        return Rank;
    }
);
