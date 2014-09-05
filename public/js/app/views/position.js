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
            initialize: function() {
                console.log('views/position initialization');
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
                console.info('PositionView render... model:');
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

        return PositionView;
    }
);

