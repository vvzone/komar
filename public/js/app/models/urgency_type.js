define(
    'models/urgency_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/urgency_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Сокр. название'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'urgency_type',
            model_rus_name: 'Тип срочности',
            url: function() {
                return apiUrl('urgency_type', this.id);
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
