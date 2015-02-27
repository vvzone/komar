define(
    'models/units_collection',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'models/unit'
    ],function($, _, Backbone, React, apiUrl, Model){

        console.log('models/units_collection loaded');

        var Collection = Backbone.PageableCollection.extend({
            model: Model,
            collection_rus_name: 'Подразделения',
            collection_name: 'units',
            url: function() {
                return apiUrl('units');
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
