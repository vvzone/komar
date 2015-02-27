define(
    'models/region_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/region_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Краткое название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'region_type',
            model_rus_name: 'Тип региона',
            url: function() {
                return apiUrl('region_type', this.id);
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
