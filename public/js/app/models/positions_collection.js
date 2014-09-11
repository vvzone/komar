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
                /*this.on('change', function(){
                    console.info('Collection Change! > fetch');
                    this.fetch();
                }, this);*/

                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return Positions;
    }
);

