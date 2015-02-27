define(
    'models/node_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/node_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null
            },
            attr_rus_names: {
                name: 'Название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'node_type',
            model_rus_name: 'Тип точки маршрута',
            url: function() {
                return apiUrl('node_type', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                /*this.on('change', function(){
                    console.error('model -> change');
                }, this);*/
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        return Model;
    }
);
