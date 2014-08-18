define(
    'models/position',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        var Position = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                name_min: null,
                description: null
            },
            pole_names: {
               name: 'Название',
               name_min: 'Сокращенное название',
               description: 'Описание'
            },
            url: function() {
                return apiUrl('position', this.id);
            }
        });

        return Position;
    }
);
