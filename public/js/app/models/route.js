define(
    'models/route',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
        //'models/node_levels_collection'
        //'models/node_levels_collection'
    ],function($, _, Backbone, React, apiUrl){// NodeLevelsCollection
        console.log('models/route loaded');


        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                document_type: null,
                node_levels: null
            },
            attr_rus_names: {
                name: 'Название',
                document_type: 'Тип документа',
                node_levels: 'Этапы маршрута'
            },
            attr_dependencies: {
                document_type: 'document_types'
            },
            model_name: 'route',
            model_rus_name: 'Маршрут',
            url: function() {
                return apiUrl('route', this.id);
            },
            initialize: function(){
                /*
                if (_.size(this.get('node_levels'))>0) {
                    console.log('Route has node_levels');
                    if(!NodeLevelsCollection){
                        console.log('loading "NodeLevelsCollection" sub-collection');
                        var NodeLevelsCollection = require("models/node_levels_collection");
                    }
                    var NodeLevelsCollection = new NodeLevelsCollection(this.get('node_levels'));
                    this.set({node_levels: NodeLevelsCollection});
                }
                */
            }
        });

        return Model;
    }
);

