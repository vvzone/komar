define(
    'view/positions_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/positions_collection',
        'view/position'
    ],function($, _, Backbone, React, apiUrl, PositionsCollection, PositionView){

        var PositionsListView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class
            tagName: 'ul',
            initialize: function() {
                /*
                var response = Positions.fetch();
                this.collection = response; //['responseJSON'];
                */
                this.render();
            },
            render: function(){
                this.collection.each(function(position){
                    var positionView = new PositionView({ model: position });
                });

            }
        });

        var Positions = new PositionsCollection;
        var p = Positions.fetch();
        //var PositionsList = new PositionsListView;

        p.done(function () {
            var PositionsList = new PositionsListView({collection: Positions});
            PositionsList.render();
        });

        //return ; //PositionsListView;
    }
);

