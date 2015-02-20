define(
    'models/route_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/route'
    ],function($, _, Backbone, React, apiUrl, Model){
        console.log('models/route_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Маршрут',
            collection_name: 'route',
            url: function() {
                return apiUrl('route');
            },
            initialize: function(){
                this.on('destroy', this.liluDallas, this);
            },
            liluDallas: function(){
                console.warn('Multi-passport!');
            }
        });

        return Collection;
    }
);
