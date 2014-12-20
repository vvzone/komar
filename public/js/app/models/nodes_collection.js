define(
    'views/react/prototypes/nodes_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'model/client'
    ],function($, _, Backbone, React, apiUrl, Client){

        console.log('models/nodes_collection ');

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

                if(_.size(this.get('client'))>0){
                    console.warn('_size(nodes)>0');
                    this.set('client', new Client(this.get('client')));
                }else{
                    console.info(this.get('client'));
                    this.set('client', new Client(null));
                }
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