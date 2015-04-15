define(
    'models/document_attribute',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/atc_collection'
    ],function($, _, Backbone, React, apiUrl, ATC_Collection){

        console.log('models/document_attribute loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                data: null,
                attribute_type: null,
                atc_collection: null
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
            url: function() {
                return apiUrl('document_attribute', this.id);
            },
            initialization: function(){
                this.set({atc_collection: new ATC_Collection(this.atc_collection)});
            }
        });

        return Model;
    }
);

