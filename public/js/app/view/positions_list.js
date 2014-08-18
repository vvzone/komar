define(
    'view/positions_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/positions_collection'
    ],function($, _, Backbone, React, apiUrl, Positions){


        var PositionsListView = Backbone.View.extend({
            el: 'main_main',
            template: '<div class="widget-container">Test</div>',
            initialize: function() {
                this.positions = Positions.fetch();
                // this.get('positions'), {url: apiUrl('positions', this.id)}
            },
            render: function(){
                this.$el.html(this.template);
            }
        });

        return new PositionsListView(); //PositionsListView;
    }
);

