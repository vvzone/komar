define(
    'models/rank',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config'
    ],function($, _, Backbone, React, apiUrl, Config){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        (debug)?console.log('models/rank loaded'):null;

        var Rank = Backbone.Model.extend({
            defaults: {
                name: null,
                short_name: null,
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
            model_name: 'rank',
            model_rus_name: 'Звание',
            attr_dependencies: [], //for recursive objects
            url: function() {
                return apiUrl('rank', this.id);
            },
            initialize: function(){
                (debug)?console.info('Model init'):null;
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                (debug)?console.warn('KABOOM!'):null;
            }
        });

        return Rank;
    }
);
