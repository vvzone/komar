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
            initialize: function(options) {
                (debug)?console.log('ListView (backbone) initialization...'):null;
                _.bindAll(this, 'render');
                (debug)?console.log('init, this.collection:'):null;
                (debug)?console.log(this.collection):null;


                this.collection.bind('destroy', this.render, this);
                //this.collection.bind('change', this.render, this);
                this.collection.bind('reset', this.render, this);
                var self = this;
                EventBus.on('success', function(){
                    self.collection.fetch();
                });
                this.collection.bind('', this.render, this);
                this.render(options);
            },
            render: function(options){
                var self = this;
                $(document).ready(function(){
                    require(['jsx!views/react/controls/main_list'], function(MainList){
                        console.warn(['self.pagination', self.pagination]);
                        console.warn(['options', options]);
                        console.warn(['self', self]);

                        React.renderComponent(
                            new MainList({
                                collection: self.collection,
                                pagination: options.pagination
                            }), document.getElementById("main_main")
                        );
                    });
                });
            }
        });

            var initialize = function(CollectionModule, pagination_request){
                var Collection = new CollectionModule;
                //if(debug){
                    console.log('CollectionModule');
                    console.log(CollectionModule);
                    console.log('Collection');
                    console.log(Collection);
                    console.log('trying fetch collection...');
                //}
                var page = 1;
                var per_page = 10;
                if(pagination_request){
                    if(pagination_request.page){
                        page = pagination_request.page;
                    }
                    if(pagination_request.per_page){
                        per_page = pagination_request.per_page;
                    }
                }

                Collection.state.pageSize = per_page;
                Collection.state.currentPage = page;


                //{"id":null,"code":"7","name":"Россия","full_name":"Российская Федерация"}


                Collection.getPage(page).done(function(collection, response, options){
                    var paginator = null;
                    console.info(['collection, response, options', collection, response, options]);
                    console.info(['paginator', collection.paginator]);
                    if(collection.paginator){
                        paginator = collection.paginator
                        console.info(['paginator', response.paginator]);
                    }
                    var View = new ListView({collection: Collection, pagination: paginator});
                });




                /*
                var p = Collection.fetch({

                    error: function(obj, response){
                        console.warn(['error, response: ', response]);
                        EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                    },
                    success: function(collection, response, options){
                        console.info(['collection, response, options', collection, response, options]);
                        if(debug){
                            console.info('success & Current collection:');
                            console.info(Collection.toJSON())
                        };
                        var paginator = null;
                        if(response.paginator){
                            paginator = response.paginator
                        }

                        var View = new ListView({collection: Collection, pagination: paginator});
                    }
                });

                */
            };

        return {
            initialize: initialize
        };
    }
);

