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
                name: null
            },
            attr_rus_names: {
                name: 'Название'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'document_attribute',
            model_rus_name: 'Атрибут документа',
            url: function() {
                return apiUrl('document_attribute', this.id);
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

