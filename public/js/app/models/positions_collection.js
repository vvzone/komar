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

        console.log('models/positions_collection loaded');

        var Positions = Backbone.Collection.extend({
            model: Position,
            url: function() {
                return apiUrl('positions');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return Positions;
    }
);

