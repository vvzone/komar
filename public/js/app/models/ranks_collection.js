define(
    'models/ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/rank'
    ],function($, _, Backbone, React, apiUrl, Rank){

        console.log('models/ranks_collection loaded');

        var Ranks = Backbone.Collection.extend({
            model: Rank,
            url: function() {
                return apiUrl('ranks');
            }
        });

        return Ranks;
    }
);
