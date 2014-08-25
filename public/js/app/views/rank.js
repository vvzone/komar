define(
    'views/rank',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/controls/list_item'
    ],function($, _, Backbone, React, ListItem){

        var RankView = Backbone.View.extend({
            el: $("div#main_list"),
            /*template: _.template($("#template-movie").html()),*/

            initialize: function() {
                console.log('views/rank initialization');
                this.model.on("change", this.render);
            },
            render: function() {
                console.log('RankView render... model:');
                console.info(this.model);
                var self = this;

                console.info('KEY= '+'item'+this.model.get('id'));
                React.renderComponent(new ListItem({
                    model: self.model,
                    key: 'item'+this.model.get('id')
                }), document.getElementById("main_list"));

            }
        });

        return RankView;
    }
);