define(
    'models/document',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/document loaded');


        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                /*
                document_author: null,
                document_type: null,
                document_attributes: null,
                current_node_level: null,
                allowed_nodes_levels: null*/
                name: null,
                document_author: null,
                date: null,
                secrecy_type: null,
                urgency_type: null,
                document_type_id: null,
                is_service: null,
                presentation: null,
                route: null, //simple_select
                current_node: null,
                document_attributes: null
            },
            attr_rus_names: {
                name: 'Название',
                document_type: 'Тип документа',
                document_author: 'Автор',
                date: 'Дата',
                secrecy_type: 'Секретность',
                urgency_type: 'Срочность',
                current_node: 'Текущий этап маршрута',
                document_attribute_types: 'Аттрибуты документа'
            },
            view_only:{
                'current_node': 'current_node'
            },
            edit_only:{
                'document_type':'document_type'
            },
            attr_dependencies: {
                'document_type': 'document_type'
            }, //for recursive objects
            dependency_values_fields: {
                document_attribute_types: 'document_attribute_types'
            },
            model_name: 'document_attribute_type',
            model_rus_name: 'Документ',
            url: function() {
                return apiUrl('document', this.id);
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

