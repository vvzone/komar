define(
    'models/country',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/country loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                code: null,
                name: null,
                full_name: null
            },
            attr_rus_names: {
                name: 'Название',
                code: 'Код',
                full_name: 'Полное название'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'country',
            model_rus_name: 'Страна',
            url: function() {
                return apiUrl('country', this.id);
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
