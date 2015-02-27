define(
    'models/node_levels_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/node_level'
    ],function($, _, Backbone, React, apiUrl, NodeLevelModel){
        console.log('models/node_level_collection');

        var NodeLevelCollection = Backbone.Collection.extend({
            model: NodeLevelModel,
            collection_rus_name: 'Этапы маршрута',
            collection_name: 'node_level_collection',
            url: function() {
                return apiUrl('node_level_collection');
            },
            comparator: function(model){
                return model.get('level_order');
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

        return NodeLevelCollection;
    }
);