define(
    'models/nodes_collection',
    [
        'jquery',
        'underscore',
        'backbone', 'backbone_paginator',
        'react',
        'apiUrl',
        'models/node'
    ],function($, _, Backbone, BackbonePaginator, React, apiUrl, NodeModel){

        console.log('models/nodes_collection ');

        var NodesCollection = Backbone.PageableCollection.extend({
            model: NodeModel,
            collection_rus_name: 'Коллекция нод',
            collection_name: 'nodes_collection',
            url: function() {
                return apiUrl('nodes_collection');
            },
            comparator: function(model){
                return model.get('sort_order');
            },
            initialize: function(){
                this.on('destroy', function(){
                    this.liluDallas;
                }, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        //return new TestCollectionTwo(nodes);
        return NodesCollection;
    }
);