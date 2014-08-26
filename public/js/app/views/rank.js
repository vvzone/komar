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
            tagName: 'li',
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
                console.error('*this*');
                console.log(this);
                console.warn('trying find container');
                console.info($(this.el));

                var self = this;
                this.$el.html('test');

                return(
                    new ListItem({
                            model: self.model,
                            key: 'item'+this.model.get('id'),
                            action: this.clickedCP
                        })
                    );
            }
        });

        return RankView;
    }
);