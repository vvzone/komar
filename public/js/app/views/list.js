define(
    'views/list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus'

    ],function($, _, Backbone, React, EventBus){

        console.log('module views/positions_list loaded');

        var ListView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class

            template: '<div id="main_list_header"></div>' +
                '<div id="main_list"></div>',
            initialize: function() {
                console.log('ListView (backbone) initialization...');
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

                        if(self.collection.collection_rus_name){
                            $('#main_top').html('<h2>'+self.collection.collection_rus_name+'</h2>');
                        }

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
                console.log('start loaded...');
                var Collection = new CollectionModule;
                console.log('CollectionModule');
                console.log(CollectionModule);
                console.log('Collection');
                console.log(Collection);
                console.log('trying fetch collection...');
                var p = Collection.fetch({
                    /*data: {recursive: 1},*/
                    error: function(obj, response){
                        console.warn('error, response: '+response);
                        EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                    },
                    success: function(){
                        console.info('success & Current collection:');
                        console.info(Collection.toJSON());
                        var View = new ListView({collection: Collection});
                    }
                });
            };

        return {
            initialize: initialize
        };
    }
);

