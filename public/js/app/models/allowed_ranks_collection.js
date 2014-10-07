define(
    'models/allowed_ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/rank'
    ],function($, _, Backbone, React, apiUrl, Rank){

        console.log('models/allowed_ranks_collection loaded');

        var Ranks = Backbone.Collection.extend({
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
                console.warn('Multi-passport!');
            }
        });

        return Ranks;
    }
);
