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
                document_author: 'Автор',
                date: 'Дата',
                secrecy_type: 'Секретность',
                urgency_type: 'Срочность',
                current_node: 'Текущий этап маршрута'
            },
            attr_dependencies: [], //for recursive objects
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

