define(
    'models/doc_type_groups_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/doc_type_group'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, DocTypeGroup){

        console.log('models/doc_type_groups_collection');

        var MenuCollection = Backbone.PageableCollection.extend({
            model: DocTypeGroup,
            collection_rus_name: 'Группы типов документов',
            collection_name: 'doc_type_groups',
            may_tree: true,
            url: function() {
                return apiUrl('doc_type_groups');
            },
            initialize: function(){
                this.on('change', function(){
                    console.warn('!!!-Collection Changed-!!!');
                    console.warn('models/doc_type_groups_collection');
                }, this);
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return MenuCollection;
    }
);
