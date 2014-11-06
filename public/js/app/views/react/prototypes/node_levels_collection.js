define(
    'views/react/prototypes/node_levels_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'views/react/prototypes/nodes_collection'
    ],function($, _, Backbone, React, apiUrl, NodesCollection){

        console.log('models/test_collection');

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

        var nodes_one = [
            {id: 3007, node_level_id: 101, sort_order: 0, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1}
        ];
        var nodes_two = [
            {id: 3008, node_level_id: 102, sort_order: 0, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1},
            {id: 3006, node_level_id: 102, sort_order: 1, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1}
        ];
        var nodes_three = [
            {id: 3009, node_level_id: 103, sort_order: 0, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1}
        ];

        var node_levels = [
            {id: 101, route: 1, level_order: 1, level_type: level_type_one, name: 'Согласование 1', nodes: nodes_one},
            {id: 103, route: 1, level_order: 3, level_type: level_type_two, name: 'Исполняющие', nodes: nodes_two},
            {id: 102, route: 1, level_order: 2, level_type: level_type_three, name: 'Согласование 2', nodes: nodes_three}
        ];

        var NodeLevelModel = Backbone.Model.extend({
            defaults: {
                id: null,
                route: null,
                level_order: null,
                level_type: null,
                name: null,
                nodes: []
            },
            attr_rus_names: {
                route: 'Маршрут',
                level_order: 'Порядок в пределах маршрута',
                level_type: 'Тип уровня',
                name: 'Название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'test_model',
            model_rus_name: '',
            url: function() {
                return apiUrl('test_model', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                /*this.on('change', function(){
                    console.error('model -> change');
                }, this);*/
                console.info('model init, this:');
                console.info(this);

                // Для продакшена заменить на аналогичные действия в parse
                if(_.size(this.get('nodes'))>0){
                    console.warn('_size(nodes)>0');
                    this.set('nodes', new NodesCollection(this.get('nodes')));
                }else{
                    console.info('this.get(nodes):');
                    console.info(this.get('nodes'));
                    this.set('nodes', new NodesCollection(null));
                }
            },
            parse: function(response, xhr){
                console.info('NodeLevelModel -> parse, response:');
                console.log(response);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        var NodeLevelCollection = Backbone.Collection.extend({
            model: NodeLevelModel,
            collection_rus_name: 'Коллекция для тестирования',
            collection_name: 'test_collection',
            url: function() {
                return apiUrl('test_collection');
            },
            comparator: function(model){
                return model.get('level_order');
            },
            initialize: function(){
                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return new NodeLevelCollection(node_levels);
        //return new TestCollection(null);
    }
);