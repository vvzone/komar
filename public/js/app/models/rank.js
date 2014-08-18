define(
    'models/rank',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        var Rank = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                order: null
            },
            pole_names: {
                name: 'Название',
                order: 'Порядок'
            },
            url: function() {
                return apiUrl('rank', this.id);
            }
        });

        return Rank;
    }
);
