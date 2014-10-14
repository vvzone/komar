define(
    'models/attribute_type_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/attribute_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                code: null // maybe there is no  need in this... who knows?
            },
            attr_rus_names: {
                name: 'Название',
                description: 'Описание',
                code: 'Код'
                /*parent: 'Состоит из типов атрибутов:'*/
            },
            model_name: 'attribute_type_list',
            model_rus_name: 'Тип атрибута, подтип - список',
            attr_dependencies: null,
            hidden_fields: null,
            url: function() {
                return apiUrl('attribute_type', this.id); //there is no url
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
