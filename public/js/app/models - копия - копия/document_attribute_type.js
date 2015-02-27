define(
    'models/document_attribute_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/document_attribute_type loaded');

        /*
         id long - глобальный ID;
         document_type DocumentType / document_type_id Long - ID ссылка на связанный объект document_type;
         attribute_type AttributeType / attribute_type_id Long - ID ссылка на связанный объект attribute_type;
         min_count Integer - Минимальное возможное количество атрибутов данного типа;
         max_count Integer - Максимальное возможное количество атрибутов данного типа;
        */

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null
            },
            attr_rus_names: {
                name: 'Название'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'document_attribute_type',
            model_rus_name: 'Атрибуты документа',
            url: function() {
                return apiUrl('document_attribute_type', this.id);
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

