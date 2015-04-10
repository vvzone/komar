define(
    'views/list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'event_bus',
        'app_registry'

    ],function($, _, Backbone, React, Config, EventBus, app_registry){
        var debug = (Config['debug'] && Config['debug']['debug_list'])? 1:null;
        console.log('module views/list loaded');

        var ListView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class
            template: '<div id="main_list_header"></div>' +
                '<div id="main_list"></div>',
            routeToCollection: function(){
                app_registry.router.navigate(app_registry.currentUrlWithOutParams(), true);
            },
            initialize: function(options) {
                (debug)?console.log('ListView (backbone) initialization...'):null;
                _.bindAll(this, 'render');
                (debug)?console.log('init, this.collection:'):null;
                (debug)?console.log(this.collection):null;
                
                this.collection.bind('destroy', this.catchDestroy, this);
                this.collection.bind('change', this.catchChange, this);
                this.collection.bind('reset', this.catchReset, this);
                var self = this;
                this.collection.bind('', this.render, this);
                this.render(options);
            },
            catchDestroy: function(model){
                console.log('catchDestroy');
                var url =  app_registry.router_helpers.refreshUrlTmstmp(Backbone.history.fragment);
                app_registry.router.navigate(url, true);
            },
            catchChange: function(model){
                console.log('catchChange');
                this.reRender(model);
            },
            catchReset: function(model){
                console.log('catchReset');
                this.reRender(model);
            },
            reRender: function(model){
                var options = {};
                console.info(['reRender', model]);
                if(model.collection){
                    if(model.collection.paginator){
                        options['pagination'] = model.collection.paginator;
                        console.warn(['collection.paginator', model.collection.paginator]);
                    }else{
                        EventBus.trigger('error', 'Не могу получить данные о пагинации');
                    }
                }
                this.render(options);
            },
            render: function(options){
                var self = this;
                $(document).ready(function(){
                    require(['jsx!views/react/list/main_list'], function(MainList){
                        if(debug){
                            console.warn(['self.pagination', self.pagination]);
                            console.warn(['options', options]);
                            console.warn(['self', self]);
                        }

                        React.unmountComponentAtNode($('#main_main')[0]);

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
                if(debug){
                    console.log('CollectionModule');
                    console.log(CollectionModule);
                    console.log('Collection');
                    console.log(Collection);
                    console.log('trying fetch collection...');
                }
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
                    (debug)?console.info(['collection, response, options', collection, response, options]):null;
                    (debug)?console.info(['paginator', collection.paginator]):null;
                    if(collection.paginator){
                        paginator = collection.paginator;
                        Collection.paginator = collection.paginator;
                        (debug)?console.info(['paginator', response.paginator]):null;
                    }

                    var View = new ListView({collection: Collection, pagination: paginator}); //Collection
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

