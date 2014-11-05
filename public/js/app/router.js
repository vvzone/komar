define(
    'router',
    [
        'jquery',
        'underscore',
        'backbone',
        'models/collections_router',
        'react'
        //'views/menu_list'
    ],
    function($, _, Backbone, CollectionsRouter, React
       //Menu
        ){


    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home',
            'documentation': 'documentation',
            'react': 'react',
            'admin/:view/:id(/:param)': 'itemView',
            'admin/:view' : 'collectionView',
            '*action': 'no_route'
        },
        home: function(){
            console.log('home');
        },
        no_route: function(){
          console.warn('Route not found.');
        },
        itemView : function(view, id, param){
            console.info('view='+view+' id='+id+' param='+param);
            //Collections.initialize(view, id, param);
        },
        collectionView: function(view){
            console.info('Router->collectionView: collection='+view);
            //var MenuOutput = new Menu;
            CollectionsRouter.initialize(view, null, null);
        },
        documentation: function(){
            console.log('trying to documentate...');

            var Documentation = require(['service/documentate'], function(Documentation){
               return Documentation;
            });

        },
        react: function(){
            console.log('route to react test module...');
            var component_name = 'views/react/prototypes/levels';
            var collection_name = 'views/react/prototypes/test_collection';
            var collection_name_two = 'views/react/prototypes/test_collection_two';

            var node_state_first = {
                node_state_code: 3,
                node_state_name: 'Прочитано'
            };
            var node_state_four = {
                node_state_code: 4,
                node_state_name: 'Согласовано'
            };
            var node_state_five = {
                node_state_code: 5,
                node_state_name: 'Исполнено'
            };
            var level_type_two = {
                id: 945,
                level_type_name: 'Согласование'
                //, node_state_on_success: node_state_five
            };
            var level_type_one = {
                id: 943,
                level_type_name: 'Согласование'
                //, node_state_on_success: node_state_four
            };
            var level_type_three = {
                id: 944,
                level_type_name: 'Подпись'
                //, node_state_on_success: node_state_four
            };
            /*
            * 1	ID	Integer	Идентификатор объекта.
             2	Node_Level	Integer	Идентификатор уровня в составе маршрута
             3	Sort_Order	Integer	Сортировка узлов в пределах маршрута
             4	Recipient_Type	Integer	Тип получателя (тип «подразделение» невозможен)
             5	Client	Integer	Идентификатор получателя – подразделения или служащего
             6	Task	Text	Задание (описание задания)
             7	Node_State	Integer	Текущее состояние узла маршрута
             8	Period_Type	Integer	Тип периода
             9	Time_Stamp	TimeStamp	 Крайнее время получения ответа от Node
             5	Period_length	Integer	Длительность периода

             *
            * */
            var nodes = [
                {id: 3007, node_level_id: 1, sort_order: 0, recipient_type: 1, client: 99000,
                    task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1},
                {id: 3008, node_level_id: 1, sort_order: 1, recipient_type: 1, client: 99000,
                    task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1},
                {id: 3009, node_level_id: 2, sort_order: 0, recipient_type: 1, client: 99000,
                    task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1}
            ];

            var node_levels = [
                {id: 101, route: 1, level_order: 1, level_type: level_type_one, name: 'Согласование 1'},
                {id: 103, route: 1, level_order: 3, level_type: level_type_two, name: 'Исполняющие'},
                {id: 102, route: 1, level_order: 2, level_type: level_type_three, name: 'Согласование 2'}
            ];

            require([collection_name], function(LevelsCollection){
                require([collection_name_two], function(NodesCollection){

                    require(['jsx!'+component_name], function(Component){
                        React.renderComponent(
                            new Component({
                                levels_collection: new LevelsCollection(node_levels),
                                nodes_collection: new NodesCollection(nodes)
                            }), document.getElementById("main_main")
                        );
                    });
                    
                })
            });

        }
    });

    var initialize = function(){
        console.log('router initialization...');
        var app_router = new AppRouter;
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});