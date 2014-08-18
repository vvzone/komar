define(
    'models/positions_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/position'
    ],function($, _, Backbone, React, apiUrl, Position){

        var Positions = Backbone.Collection.extend({
            model: Position,
            url: function() {
                return apiUrl('positions');
            }
        });

        return new Positions;
    }
);

