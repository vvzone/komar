define(
    'views/table',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'event_bus'

    ],function($, _, Backbone, React, Config, EventBus){
        var debug = (Config['debug'] && Config['debug']['debug_table'])? 1:null;

        var TableView = Backbone.View.extend({
            el: '#main_main', // 2-do: extend from base-class
            initialize: function(options) {
                (debug)?console.log('TableView (backbone) initialization...'):null;
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
                    require(['jsx!views/react/table/generate_table'], function(Table){
                        console.warn(['self.pagination', self.pagination]);
                        console.warn(['options', options]);
                        console.warn(['self', self]);

                        $('#main_main').html('');
                        React.renderComponent(
                            new Table({
                                collection: self.collection,
                                pagination: options.pagination
                            }), document.getElementById("main_main")
                        );
                    });
                });
            }
        });

        var initialize = function(CollectionModule, pagination_request, sort_request){
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

            if(sort_request){
                if(sort_request.sort_by){
                    console.info('===========/*\===========');
                    (debug)?console.warn(['sort_request.sort_by', sort_request.sort_by]):null;
                    (debug)?console.warn(['sort_request.sort_order', sort_request.sort_order]):null;
                    var sort_order = -1; //asc
                    if(sort_request.sort_order && sort_request.sort_order !='asc'){
                        sort_order = 1; //desc
                    }
                    Collection.setSorting(sort_request.sort_by, sort_order);
                }
            }

            Collection.state.pageSize = per_page;
            Collection.state.currentPage = page;

            Collection.getPage(page).done(function(collection, response, options){
                var paginator = null;
                console.info(['collection, response, options', collection, response, options]);
                console.info(['paginator', collection.paginator]);
                if(collection.paginator){
                    paginator = collection.paginator
                    console.info(['paginator', response.paginator]);
                }
                var View = new TableView({collection: Collection, pagination: paginator});
            });
        };

        return {
            initialize: initialize
        }
    }
);