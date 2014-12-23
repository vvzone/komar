define(
    'models/collections_router',
    [
        'jquery',
        'underscore',
        'backbone',
        'event_bus',
        'views/list',
        'views/client_list',
        'views/tree',
        'config'
    ],
    function($, _, Backbone, EventBus, ListView, ClientListView, TreeView, Config){
        var initialize = function(view, id, param){
            console.log('collection_router initialization...');
            var debug = (Config['debug'] && Config['debug_collection:router'])? 1:null;

            var ViewCollection = 'undefined';
            var route_collection_array = [
                {ranks: 'list'},
                {posts: 'list'},
                {documents: 'list'}
            ];
            var search = _.each(route_collection_array, function(route_name, output_component){
                if(route_name == view){
                    if(!Collection){
                        (debug)?console.log('!Collection -> loading...'):null;
                        var collection_name = 'models/'+route_name+'_collection';
                        (debug)?console.log('try to load '+ collection_name):null;
                        var Collection = require([collection_name], function(Collection){

                            switch(output_component){
                                case('list'):
                                    (debug)?console.log('will use ListView for collection output...'):null;
                                    ListView.initialize(Collection);
                                    return Collection;
                                break;
                                case('tree'):
                                    (debug)?console.log('will use TreeView for collection output...'):null;
                                    TreeView.initialize(Collection);
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

            console.info('search');
            console.info(search);




            switch(view){
                /*case('ranks'):
                    if(!RanksCollection){
                        console.warn('!RanksCollection -> require loading');
                        var RanksCollection = require(['models/ranks_collection'], function(RanksCollection){
                            console.log('loaded...');
                            ListView.initialize(RanksCollection);
                            return RanksCollection;
                        });
                    }else{
                        console.warn('RanksCollection -> no needed to load');
                        ListView.initialize(RanksCollection);
                    }
                break;*/
                case('posts'):
                    if(!PostsCollection){
                        console.warn('!PostsCollection -> require loading');
                        var PostsCollection =require(['models/posts_collection'], function(PostsCollection){
                            console.log('loaded...');
                            ListView.initialize(PostsCollection);
                            return PostsCollection;
                        });
                    }else{
                        console.warn('PostsCollection -> no needed to load');
                        ListView.initialize(PostsCollection);
                    }
                break;
                case('secrecy_types'):
                    if(!Collection){
                        console.warn('!Collection -> require loading');
                        var Collection =require(['models/secrecy_types_collection'], function(Collection){
                            console.log('loaded...');
                            ListView.initialize(Collection);
                            return Collection;
                        });
                    }else{
                        console.warn('Collection -> no needed to load');
                        ListView.initialize(Collection);
                    }
                break;
                case('urgency_types'):
                    if(!Collection){
                        console.warn('!Collection -> require loading');
                        var Collection =require(['models/urgency_types_collection'], function(Collection){
                            console.log('loaded...');
                            ListView.initialize(Collection);
                            return Collection;
                        });
                    }else{
                        console.warn('Collection -> no needed to load');
                        ListView.initialize(Collection);
                    }
                break;
                case('document_type'):
                    if(!Collection){
                        console.warn('!Collection -> require loading');
                        var Collection =require(['models/document_type_collection'], function(Collection){
                            console.log('loaded...');
                            ListView.initialize(Collection);
                            return Collection;
                        });
                    }else{
                        console.warn('Collection -> no needed to load');
                        ListView.initialize(Collection);
                    }
                    break;
                case('doc_type_groups'):
                    if(!DocTypeGroupsCollection){
                        console.warn('!DocTypeGroupsCollection -> require loading');
                        var DocTypeGroupsCollection =require(['models/doc_type_groups_collection'], function(DocTypeGroupsCollection){
                            console.log('loaded...');
                            TreeView.initialize(DocTypeGroupsCollection);
                            return DocTypeGroupsCollection;
                        });
                    }else{
                        console.warn('DocTypeGroupsCollection -> no needed to load');
                        TreeView.initialize(DocTypeGroupsCollection);
                    }
                break;
                case('doc_type_groups_plain'):
                    if(!DocTypeGroupsCollection){
                        console.warn('!DocTypeGroupsCollection -> require loading');
                        var DocTypeGroupsCollection =require(['models/doc_type_groups_collection'], function(DocTypeGroupsCollection){
                            console.log('loaded...');
                            ListView.initialize(DocTypeGroupsCollection);
                            return DocTypeGroupsCollection;
                        });
                    }else{
                        console.warn('DocTypeGroupsCollection -> no needed to load');
                        ListView.initialize(DocTypeGroupsCollection);
                    }
                break;
                default:
                    var msg = 'Вид для коллекции '+view+' не задан.';
                    EventBus.trigger('error', '404', msg);
                break;
                case('attribute_types'):
                    if(!AttributeTypesCollection){
                        console.warn('!AttributeTypesCollection -> require loading');
                        var AttributeTypesCollection =require(['models/attribute_types_collection'], function(AttributeTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(AttributeTypesCollection);
                            return AttributeTypesCollection;
                        });
                    }else{
                        console.warn('AttributeTypesCollection -> no needed to load');
                        ListView.initialize(AttributeTypesCollection);
                    }
                break;
                case('person_document_types'):
                    if(!PersonDocumentTypesCollection){
                        console.warn('!PersonDocumentTypesCollection -> require loading');
                        var PersonDocumentTypesCollection =require(['models/person_document_types_collection'], function(PersonDocumentTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(PersonDocumentTypesCollection);
                            return PersonDocumentTypesCollection;
                        });
                    }else{
                        console.warn('PersonDocumentTypesCollection -> no needed to load');
                        ListView.initialize(PersonDocumentTypesCollection);
                    }
                break;
                case('countries'):
                    if(!CountriesCollection){
                        console.warn('!CountriesCollection -> require loading');
                        var CountriesCollection =require(['models/countries_collection'], function(CountriesCollection){
                            console.log('loaded...');
                            ListView.initialize(CountriesCollection);
                            return CountriesCollection;
                        });
                    }else{
                        console.warn('CountriesCollection -> no needed to load');
                        ListView.initialize(CountriesCollection);
                    }
                break;
                case('address_types'):
                    if(!AddressTypesCollection){
                        console.warn('!AddressTypesCollection -> require loading');
                        var AddressTypesCollection =require(['models/address_types_collection'], function(AddressTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(AddressTypesCollection);
                            return AddressTypesCollection;
                        });
                    }else{
                        console.warn('AddressTypesCollection -> no needed to load');
                        ListView.initialize(AddressTypesCollection);
                    }
                break;
                case('region_types'):
                    if(!RegionTypesCollection){
                        console.warn('!RegionTypesCollection -> require loading');
                        var RegionTypesCollection =require(['models/region_types_collection'], function(RegionTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(RegionTypesCollection);
                            return RegionTypesCollection;
                        });
                    }else{
                        console.warn('RegionTypesCollection -> no needed to load');
                        ListView.initialize(RegionTypesCollection);
                    }
                break;
                case('regions'):
                    if(!RegionsCollection){
                        console.warn('!RegionsCollection -> require loading');
                        var RegionsCollection =require(['models/regions_collection'], function(RegionsCollection){
                            console.log('loaded...');
                            ListView.initialize(RegionsCollection);
                            return RegionsCollection;
                        });
                    }else{
                        console.warn('RegionsCollection -> no needed to load');
                        ListView.initialize(RegionsCollection);
                    }
                break;
                case('location_types'):
                    if(!LocationTypesCollection){
                        console.warn('!LocationTypesCollection -> require loading');
                        var LocationTypesCollection =require(['models/location_types_collection'], function(LocationTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(LocationTypesCollection);
                            return LocationTypesCollection;
                        });
                    }else{
                        console.warn('LocationTypesCollection -> no needed to load');
                        ListView.initialize(LocationTypesCollection);
                    }
                break;
                case('street_types'):
                    if(!StreetTypesCollection){
                        console.warn('!StreetTypesCollection -> require loading');
                        var StreetTypesCollection =require(['models/street_types_collection'], function(StreetTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(StreetTypesCollection);
                            return StreetTypesCollection;
                        });
                    }else{
                        console.warn('StreetTypesCollection -> no needed to load');
                        ListView.initialize(StreetTypesCollection);
                    }
                break;
                case('sex_types'):
                    if(!SexTypesCollection){
                        console.warn('!SexTypesCollection -> require loading');
                        var SexTypesCollection =require(['models/sex_types_collection'], function(SexTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(SexTypesCollection);
                            return SexTypesCollection;
                        });
                    }else{
                        console.warn('SexTypesCollection -> no needed to load');
                        ListView.initialize(SexTypesCollection);
                    }
                break;
                case('commander_types'):
                    if(!CommanderTypesCollection){
                        console.warn('!CommanderTypesCollection -> require loading');
                        var CommanderTypesCollection =require(['models/commander_types_collection'], function(CommanderTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(CommanderTypesCollection);
                            return CommanderTypesCollection;
                        });
                    }else{
                        console.warn('CommanderTypesCollection -> no needed to load');
                        ListView.initialize(CommanderTypesCollection);
                    }
                break;
                /* Настройки документов */
                case('period_types'):
                    if(!PeriodTypesCollection){
                        console.warn('!PeriodTypesCollection -> require loading');
                        var PeriodTypesCollection =require(['models/period_types_collection'], function(PeriodTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(PeriodTypesCollection);
                            return PeriodTypesCollection;
                        });
                    }else{
                        console.warn('PeriodTypesCollection -> no needed to load');
                        ListView.initialize(PeriodTypesCollection);
                    }
                break;
                case('enumeration_types'):
                    if(!EnumerationTypesCollection){
                        console.warn('!EnumerationTypesCollection -> require loading');
                        var EnumerationTypesCollection =require(['models/enumeration_types_collection'], function(EnumerationTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(EnumerationTypesCollection);
                            return EnumerationTypesCollection;
                        });
                    }else{
                        console.warn('EnumerationTypesCollection -> no needed to load');
                        ListView.initialize(EnumerationTypesCollection);
                    }
                break;
                /* Реальная нумерация */
                case('enumeration'):
                    if(!EnumerationCollection){
                        console.warn('!EnumerationCollection -> require loading');
                        var EnumerationCollection =require(['models/enumeration_collection'], function(EnumerationCollection){
                            console.log('loaded...');
                            ListView.initialize(EnumerationCollection);
                            return EnumerationCollection;
                        });
                    }else{
                        console.warn('EnumerationCollection -> no needed to load');
                        ListView.initialize(EnumerationCollection);
                    }
                break;
                case('node_types'):
                    if(!NodeTypesCollection){
                        console.warn('!NodeTypesCollection -> require loading');
                        var NodeTypesCollection =require(['models/node_types_collection'], function(NodeTypesCollection){
                            console.log('loaded...');
                            ListView.initialize(NodeTypesCollection);
                            return NodeTypesCollection;
                        });
                    }else{
                        console.warn('NodeTypesCollection -> no needed to load');
                        ListView.initialize(NodeTypesCollection);
                    }
                break;
                /* === Орг-штат === */



                case('persons'):
                    if(!RanksCollection){
                        console.warn('!RanksCollection -> require loading');
                        var RanksCollection = require(['models/persons_collection'], function(RanksCollection){
                            console.log('loaded...');
                            ListView.initialize(RanksCollection);
                            return RanksCollection;
                        });
                    }else{
                        console.warn('RanksCollection -> no needed to load');
                        ListView.initialize(RanksCollection);
                    }
                break;
                case('units'):
                    if(!DocTypeGroupsCollection){
                        console.warn('!DocTypeGroupsCollection -> require loading');
                        var DocTypeGroupsCollection =require(['models/units_collection'], function(DocTypeGroupsCollection){
                            console.log('loaded...');
                            ListView.initialize(DocTypeGroupsCollection);
                            return DocTypeGroupsCollection;
                        });
                    }else{
                        console.warn('DocTypeGroupsCollection -> no needed to load');
                        ListView.initialize(DocTypeGroupsCollection);
                    }
                    break;
                case('units_tree'):
                    if(!DocTypeGroupsCollection){
                        console.warn('!DocTypeGroupsCollection -> require loading');
                        var DocTypeGroupsCollection =require(['models/units_collection'], function(DocTypeGroupsCollection){
                            console.log('loaded...');
                            TreeView.initialize(DocTypeGroupsCollection);
                            return DocTypeGroupsCollection;
                        });
                    }else{
                        console.warn('DocTypeGroupsCollection -> no needed to load');
                        TreeView.initialize(DocTypeGroupsCollection);
                    }
                    break;
                case('clients'):
                    if(!ClientsCollection){
                        console.warn('!ClientsCollection -> require loading');
                        var ClientsCollection =require(['models/clients_collection'], function(ClientsCollection){
                            console.log('loaded...');
                            ListView.initialize(ClientsCollection);
                            return ClientsCollection;
                        });
                    }else{
                        console.warn('ClientsCollection -> no needed to load');
                        TreeView.initialize(ClientsCollection);
                    }
                break;
                case('units_plain'):
                    if(!DocTypeGroupsCollection){
                        console.warn('!DocTypeGroupsCollection -> require loading');
                        var DocTypeGroupsCollection =require(['models/units_collection'], function(DocTypeGroupsCollection){
                            console.log('loaded...');
                            ListView.initialize(DocTypeGroupsCollection);
                            return DocTypeGroupsCollection;
                        });
                    }else{
                        console.warn('DocTypeGroupsCollection -> no needed to load');
                        ListView.initialize(DocTypeGroupsCollection);
                    }
                break;
                case('documents'):
                    if(!DocumentsCollection){
                        console.warn('!DocumentCollection -> require loading');
                        var DocumentsCollection =require(['models/document_collection'], function(DocumentsCollection){
                            console.log('loaded...');
                            ListView.initialize(DocumentsCollection);
                            return DocumentsCollection;
                        });
                    }else{
                        console.warn('RegionsCollection -> no needed to load');
                        ListView.initialize(DocumentsCollection);
                    }
                break;
                case('route'):
                    if(!RouteCollection){
                        console.warn('!RouteCollection -> require loading');
                        var RouteCollection =require(['models/route_collection'], function(RouteCollection){
                            console.log('loaded...');
                            ListView.initialize(RouteCollection);
                            return RouteCollection;
                        });
                    }else{
                        console.warn('RegionsCollection -> no needed to load');
                        ListView.initialize(RouteCollection);
                    }
                break;
                case('very_urgency'):
                    if(!DocumentsCollection){
                        console.warn('!DocumentsCollection -> require loading');
                        var DocumentsCollection =require(['models/documents_collection'], function(DocumentsCollection){
                            console.log('loaded...');
                            ClientListView.initialize(DocumentsCollection);
                            return DocumentsCollection;
                        });
                    }else{
                        console.warn('RegionsCollection -> no needed to load');
                        ClientListView.initialize(DocumentsCollection);
                }
            }
        };
        return {
            initialize: initialize
        };
    });