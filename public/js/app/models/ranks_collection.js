define(
    'models/ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config',
        'models/rank'
    ],function($, _, Backbone, React, apiUrl, Config, Rank){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        (debug)?console.log('models/ranks_collection loaded'):null;

        var Ranks = Backbone.Collection.extend({
            model: Rank,
            collection_rus_name: 'Звания',
            collection_name: 'ranks',
            url: function() {
                return apiUrl('ranks');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                (debug)?console.warn('Multi-passport!'):null;
            }
        });

        return Ranks;
    }
);
