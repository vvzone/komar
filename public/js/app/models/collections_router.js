define(
    'models/collections_router',
    [
        'jquery',
        'underscore',
        'backbone',
        'event_bus',
        'views/list'
    ],
    function($, _, Backbone, EventBus, ListView){
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
                case('positions'):
                    if(!PositionsCollection){
                        console.warn('!PositionsCollection -> require loading');
                        var PositionsCollection =require(['models/positions_collection'], function(PositionsCollection){
                            console.log('loaded...');
                            ListView.initialize(PositionsCollection);
                            return PositionsCollection;
                        });
                    }else{
                        console.warn('PositionsCollection -> no needed to load');
                        ListView.initialize(PositionsCollection);
                    }
                break;
                default:
                    var msg = 'Вид для коллекции '+view+' не задан.';
                    EventBus.trigger('error', '404', msg);
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