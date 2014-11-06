define(
    'views/react/prototypes/nodes_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/nodes_collection_two');

        /*var node_state_first = {
            node_state_code: 3,
            node_state_name: 'Прочитано'
        };
        var node_state_second = {
            node_state_code: 2,
            node_state_name: 'Назначено'
        };

         var nodes = [
            {id: 3007, node_level_id: 101, sort_order: 0, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1},
            {id: 3008, node_level_id: 102, sort_order: 0, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1},
            {id: 3006, node_level_id: 102, sort_order: 1, recipient_type: 1, client: 99000,
                 task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1},
            {id: 3009, node_level_id: 103, sort_order: 0, recipient_type: 1, client: 99000,
                task: 'Проверить', node_state: node_state_first, period_type: 1, time_stamp: null, period_length: 1}
        ];*/

        var NodeModel = Backbone.Model.extend({
            defaults: {
                id: null,
                node_level_id: null,
                sort_order: 0,
                recipient_type: 1,
                client: null,
                task: 'Подтвердить',
                node_state: 0,
                period_type: 1,
                period_length: 1,
                time_stamp: null
            },
            attr_rus_names: {
                node_level_id: 'Уровень узла',
                sort_order: 'Сортировка на уровне',
                recipient_type: 'Тип получателя',
                client: 'Клиент',
                task: 'Задача',
                node_state: 'Текущее состояние',
                period_type: 'Тип периода',
                period_length: 'Длина периода',
                time_stamp: 'Временной штамп'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'test_model_two',
            model_rus_name: '',
            url: function() {
                return apiUrl('test_model_two', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                /*this.on('change', function(){
                    console.error('model -> change');
                }, this);*/
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        var NodesCollection = Backbone.Collection.extend({
            model: NodeModel,
            collection_rus_name: 'Коллекция нод',
            collection_name: 'nodes_collection',
            url: function() {
                return apiUrl('nodes_collection');
            },
            comparator: function(model){
                return model.get('sort_order');
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

        //return new TestCollectionTwo(nodes);
        return NodesCollection;
    }
);