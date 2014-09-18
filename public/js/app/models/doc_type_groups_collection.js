define(
    'models/doc_type_groups_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/doc_type_group'
    ],function($, _, Backbone, React, apiUrl, DocTypeGroup){

        console.log('models/doc_type_groups_collection');

        var MenuCollection = Backbone.Collection.extend({
            model: DocTypeGroup,
            url: function() {
                return apiUrl('doc_type_groups');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return MenuCollection;
    }
);
