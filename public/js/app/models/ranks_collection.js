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
            },
            initialize: function(){
                this.fetch({
                    success: this.fetchSuccess,
                    complete: this.fetchComplete,
                    error: this.fetchError
                });
            },

            fetchSuccess: function (collection, response) {
                console.log('Collection fetch success, response: ', response);
                console.log('Collection models: ', this.models);
            },

            fetchComplete: function (collection, response) {
                console.log('Collection fetch complete, response: ', response);

                console.log('------------collection-----------------');
                console.log(collection);
                console.log('---------------------------------------');

                console.log('Collection models: ', this.models);
            },

            fetchError: function (collection, response) {
               console.log('fetchError triggered');
            }
        });

        return Ranks;
    }
);
