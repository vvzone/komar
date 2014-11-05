define(
    'views/react/prototypes/test_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/commander_type loaded');

        var TestModel = Backbone.Model.extend({
            defaults: {
                id: null,
                route: null,
                level: null,
                level_type: null,
                name: null
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
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        var TestCollection = Backbone.Collection.extend({
            model: TestModel,
            collection_rus_name: 'Модель для тестирования',
            collection_name: 'test_collection',
            url: function() {
                return apiUrl('test_collection');
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

        return TestCollection;
    }
);