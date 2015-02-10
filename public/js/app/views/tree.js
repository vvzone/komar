define(
    'views/tree',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus'

    ],function($, _, Backbone, React, EventBus){

        console.log('module views/menu loaded');

        var TreeView = Backbone.View.extend({
            //el: $('div#left_panel'), // 2-do: extend from base-class
            /*tagName: 'ul',*/
            template: '<div id="main_list_header"></div>' +
                '<div id="menu_view"></div>',
            initialize: function() {
                console.info('TreeView initialization...');
                _.bindAll(this, 'render');
                console.log('init, this.collection:');
                console.log(this.collection);
                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.changeCollection, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            changeCollection: function(){
                console.warn('TreeView -> collection.change.event');
                this.render;
            },
            render: function(){
                console.log('TreeView -> render, this.collection:');
                console.log(this.collection);
                var self = this;
                $(document).ready(function(){
                     require(['jsx!views/react/controls/tree/tree_main'], function(TreeMain){
                         console.log('trying set collection 2 obj:');
                         console.info(self.collection);

                         React.renderComponent(
                             new TreeMain({
                                    collection: self.collection
                                }), document.getElementById("main_main")
                         );
                     });
                });
            }
        });

        var initialize = function(CollectionModule){
            console.log('start loaded...');
            var Collection = new CollectionModule;
            console.log('CollectionModule');
            console.log(CollectionModule);
            console.log('Collection');
            console.log(Collection);
            console.log('trying fetch collection...');
            var p = Collection.fetch({
                data: {recursive: 1},
                error: function(obj, response){
                    console.warn('error, response: '+response);
                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                },
                success: function(){
                    console.info('success & Current collection:');
                    console.info(Collection.toJSON());
                    var View = new TreeView({collection: Collection});
                }
            });
        };

        return {
            initialize: initialize
        };
    }
);