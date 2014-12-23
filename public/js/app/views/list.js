define(
    'views/list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'event_bus'

    ],function($, _, Backbone, React, Config, EventBus){

        var debug = (Config['debug'] && Config['debug']['debug_list'])? 1:null;
        console.log('module views/list loaded');

        var ListView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class

            template: '<div id="main_list_header"></div>' +
                '<div id="main_list"></div>',
            initialize: function() {
                (debug)?console.log('ListView (backbone) initialization...'):null;
                _.bindAll(this, 'render');
                (debug)?console.log('init, this.collection:'):null;
                (debug)?console.log(this.collection):null;

                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.render, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            render: function(){
                var self = this;
                $(document).ready(function(){
                    require(['jsx!views/react/controls/main_list'], function(MainList){
                        React.renderComponent(
                            new MainList({
                                collection: self.collection
                            }), document.getElementById("main_main")
                        );
                    });
                });
            }
        });

            var initialize = function(CollectionModule){
                var Collection = new CollectionModule;
                if(debug){
                    console.log('CollectionModule');
                    console.log(CollectionModule);
                    console.log('Collection');
                    console.log(Collection);
                    console.log('trying fetch collection...');
                }
                var p = Collection.fetch({
                    /*data: {recursive: 1},*/
                    error: function(obj, response){
                        console.warn('error, response: '+response);
                        EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                    },
                    success: function(){
                        if(debug){
                            console.info('success & Current collection:');
                            console.info(Collection.toJSON())
                        };
                        var View = new ListView({collection: Collection});
                    }
                });
            };

        return {
            initialize: initialize
        };
    }
);

