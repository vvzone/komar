define(
    'views/react/prototypes/node_levels_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'views/react/prototypes/nodes_collection',
        'models/client'
    ],function($, _, Backbone, React, apiUrl, NodesCollection, ClientModel){
        console.log('models/test_collection');

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
        //return new TestCollection(null);
    }
);