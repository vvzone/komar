define(
    'models/atc',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/attribute_type',
        'models/document_attributes_collection'
    ],function($, _, Backbone, React, apiUrl, AttributeType, DocumentAtrributesCollection){

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                attribute_type: null,
                document_attributes: null,
                min: null,
                max: null
            },
            attr_description:{
            },
            initialize: function(){
                this.set({attribute_type: new AttributeType(this.attribute_type)});
                this.set({document_attributes: new DocumentAtrributesCollection(this.document_attributes)});
            }
        });

        return Model;
    }
);
