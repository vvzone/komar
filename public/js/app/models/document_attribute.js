define(
    'models/document_attribute',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/document_attribute loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                data: null,
                attribute_type: null,
                children: null
            },
            attr_rus_names: {
                name: 'Название',
                data: 'Значение',
                attribute_type: 'Тип',
                children: 'Дочерние'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'document_attribute',
            model_rus_name: 'Атрибут документа',
            form:{
                name: 'tiny_text',
                data: 'textarea', //зависит от type
                attribute_type: 'model'
            },
            url: function() {
                return apiUrl('document_attribute', this.id);
            }
        });

        return Model;
    }
);

