define(
    'models/collections_router',
    [
        'jquery',
        'underscore',
        'backbone',
        'event_bus',
        'views/list',
        'views/tree'
    ],
    function($, _, Backbone, EventBus, ListView, TreeView){
        var initialize = function(view, id, param){
            console.log('collection_router initialization...');
            var ViewCollection = 'undefined';

            switch(view){
                case('ranks'):
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
                break;
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
                case('doc_types'):
                    if(!Collection){
                        console.warn('!Collection -> require loading');
                        var Collection =require(['models/doc_types_collection'], function(Collection){
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
            }

            /*
           if(view){
               if(id){
                   console.log('getting module views/'+view);
                   require(['views/'+view], function(ViewItem){
                       console.log('module returned ViewItem-obj:');
                       console.log(ViewItem);

                       //ViewItem.initialize();
                   });
               }else{
                   console.log('getting module views/'+view+'_list (collection)');

                   console.info('dynamic variable stat');
                   console.info(window['views/'+view+'_list']);

                   if(window['views/'+view+'_list']!='undefined'){
                       console.log('NO registered variable '+'views/'+view+'_list');
                       require(['views/'+view+'_list'], function(ViewCollection){
                           console.log('module returns ViewCollection-obj:');
                           console.log(ViewCollection);

                           //ViewCollection.initialize(); //-second time init (auto)
                       });
                   }else{
                       console.log('already HAVE registered variable '+'views/'+view+'_list');
                   }
               }
           }*/

        };
        return {
            initialize: initialize
        };
    });