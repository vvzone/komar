define(
    'models/commander_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/commander_type loaded');

        var Model = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                priority: null
            },
            attr_rus_names: {
                name: 'Название',
                priority: 'Приоритет'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'commander_type',
            model_rus_name: 'Тип руководителя',
            url: function() {
                return apiUrl('commander_type', this.id);
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
