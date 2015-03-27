define(
    'models/ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'config',
        'models/rank'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Config, Model){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        (debug)?console.log('models/ranks_collection loaded'):null;
        
        var Ranks = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Звания',
            collection_name: 'ranks',
            url: function() {
                return apiUrl('ranks');
            }
        });

        return Ranks;
    }
);
