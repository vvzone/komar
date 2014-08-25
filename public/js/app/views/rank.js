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
                this.model.on("change", this.render());
            },
            clickedCP: function(event){
                console.info('Received click form React component, event:');
                console.log(event);
                if(event == 'delete'){
                    console.warn('deleting model='+this.model.get('id')+' name='+this.model.get('name'));
                }
            },
            render: function() {
                console.info('RankView render... model:');
                console.info(this.model);
                var self = this;
                React.renderComponent(new ListItem({
                    model: self.model,
                    key: 'item'+this.model.get('id'),
                    action: this.clickedCP
                }), document.getElementById("main_list"));

            }
        });

        return RankView;
    }
);