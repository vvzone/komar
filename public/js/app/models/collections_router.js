define(
    'models/collections_router',
    [
        'jquery',
        'underscore',
        'backbone',
        'event_bus',
        'config',

        'views/list',
        'views/client_list',
        'views/tree',
        'views/table'
    ],
    function($, _, Backbone, EventBus, Config,
             ListView, ClientListView, TreeView, TableView){

        var initialize = function(view, parameters){
            console.log('collection_router initialization...');
            var debug = (Config['debug'] && Config['debug']['debug_collection_router'])? 1:null;
            (debug)? console.info('debug for collection router are ON'):null;
            var ViewCollection = 'undefined';
            var route_collection_array = Config['collections_router'];

            var pagination_request  =  {};
            var sort_request = {};
            if(parameters){
               if(parameters.page){
                   pagination_request.page = parseInt(parameters.page);
               }
               if(parameters.limit){
                   pagination_request.per_page = parseInt(parameters.limit);
               }
               if(parameters.sort_by){
                   sort_request.sort_by = parameters.sort_by;
                   if(parameters.sort_order){
                       sort_request.sort_order = parameters.sort_order;
                   }
               }
            }
            var search = _.each(route_collection_array, function(route_name){
                if(route_name[view]){
                    if(!Collection){
                        (debug)?console.log('!Collection -> loading...'):null;
                        var collection_name = 'models/'+view+'_collection';
                        (debug)?console.log('try to load '+ collection_name):null;
                        var Collection = require([collection_name], function(Collection){
                            switch(route_name[view]){
                                case('list'):
                                    (debug)?console.log('will use ListView for collection output...'):null;
                                    ListView.initialize(Collection, pagination_request);
                                    return Collection;
                                break;
                                case('tree'):
                                    (debug)?console.log('will use TreeView for collection output...'):null;
                                    TreeView.initialize(Collection);
                                    return Collection;
                                break;
                                case('client_list'):
                                    (debug)?console.log('will use ClientListView for collection output...'):null;
                                    ClientListView.initialize(Collection);
                                    return Collection;
                                break;
                                case('table'):
                                    (debug)?console.log('will use TableView for collection output...'):null;
                                    TableView.initialize(Collection, pagination_request, sort_request);
                                    return Collection;
                                break;
                                default:
                                    console.error('can\'t resolve output type for collection '+collection_name);
                                break
                            }
                        })
                    }else{
                        if(debug){
                            console.error('Collection already loaded O_O');
                            console.info('current collection:');
                            console.info(Collection);
                        }
                    }
                }
            });
        };
        return {
            initialize: initialize
        };
    });