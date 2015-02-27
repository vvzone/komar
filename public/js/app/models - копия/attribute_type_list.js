define(
    'models/attribute_type_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config'
    ],function($, _, Backbone, React, apiUrl, Config){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/attribute_type_list loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                description: null,
                value: null // maybe there is no  need in this... who knows?
            },
            attr_rus_names: {
                name: 'Название',
                value: 'Значение',
                description: 'Описание'
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
                (debug)?console.info('Model init'):null;
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Model;
    }
);
