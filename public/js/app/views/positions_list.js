define(
    'views/positions_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'models/positions_collection',
        'views/position',
        'event_bus'

    ],function($, _, Backbone, React, PositionsCollection, PositionView, EventBus){

        console.log('module views/positions_list loaded');

        var PositionsListView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class

            template: '<div id="main_list_header"></div>' +
                '<div id="main_list"></div>',
            initialize: function() {
                console.log('PositionsListView initialization...');
                _.bindAll(this, 'render');
                console.log('init, this.collection:');
                console.log(this.collection);

                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.render, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            render: function(){
                console.log('render, this.collection:');
                console.log(this.collection);
                var self = this;
                $(document).ready(function(){
                    require(['jsx!views/react/controls/main_list'], function(MainList){
                        console.log('trying set collection 2 obj:');
                        console.info(self.collection);

                        React.renderComponent(
                            new MainList({
                                collection: self.collection
                            }), document.getElementById("main_main")
                        );
                    });
                });
            }
        });

        var Positions = new PositionsCollection;
        console.log('trying fetch collection...');
        var p = Positions.fetch({
            data: {recursive: 1},
            error: function(obj, response){
                console.warn('error, response: '+response);
                EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
            },
            success: function(){
                console.info('success & Current collection:');
                console.info(Positions.toJSON());
                var View = new PositionsListView({collection: Positions});
            }
        });
    }
);

