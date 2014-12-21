define(
    'models/route',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/route loaded');


        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null
            },
            attr_rus_names: {
                name: 'Название'
            },
            attr_dependencies: [], //for recursive objects
            model_name: 'route',
            model_rus_name: 'Маршрут',
            url: function() {
                return apiUrl('route', this.id);
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

