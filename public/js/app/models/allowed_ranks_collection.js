define(
    'models/allowed_ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/rank',
        'config'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, Rank, Config){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/allowed_ranks_collection loaded');

        var Ranks = Backbone.PageableCollection.extend({
            model: Rank,
            collection_rus_name: 'Все звания',
            collection_name: 'allowed_ranks',
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
