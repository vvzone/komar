define(
    'models/ranks_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'rank'
    ],function($, _, Backbone, React, apiUrl, Rank){

        var Ranks = Backbone.Collection.extend({
            model: Rank,
            url: function() {
                return apiUrl('ranks');
            }
        });

        return Ranks;
    }
);
