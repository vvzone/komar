define(
    'models/doc_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/doc_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                code: null,
                default_header: null,
                description: null,
                presentation: null,
                urgency_types: null,
                secrecy_types: null,
                attribute_types: [],
                route: null
            },
            attr_description: {
                urgency_types: 'Объект типа срочности',
                secrecy_types: 'Объект типа секретности',
                attribute_types: 'Массив объектов типов атрибутов'
            },
            attr_rus_names: {
                name: 'Название',
                code: 'Код',
                description: 'Описание',
                default_header: 'Заголовок по-умолчанию',
                presentation: 'Представление для печати',
                //urgency_types: 'Срочность',
                //secrecy_types: 'Секретность',
                attribute_types: 'Типы атрибутов',
                route: 'Маршрут'
            },
            attr_dependencies: {
                //'urgency_types': 'urgency_types',
                //'secrecy_types': 'secrecy_types',
                attribute_types: 'attribute_types',
                route: 'route'
            }, //for recursive objects
            model_name: 'doc_type',
            model_rus_name: 'Тип документа',
            url: function() {
                return apiUrl('doc_type', this.id);
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

        return Model;
    }
);
