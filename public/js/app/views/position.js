define(
    'views/position',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/position'
    ],function($, _, Backbone, React, apiUrl, Position){

        var PositionView = Backbone.View.extend({
            //el: '#main_main', // 2-do: extend from base-class
            tagName: 'li',
            template: '<div class="person_box"><%= name %></div>',

            initialize: function() {
                this.render();
            },
            render: function(){
                console.log(this.template);

                this.$el.html(this.template(this.model.toJSON()));
            }
        });

        return PositionView;
    }
);

