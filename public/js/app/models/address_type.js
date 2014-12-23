define(
    'models/address_type',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl',
        'config'
    ],function($, _, Backbone, React, apiUrl, Config){

        var debug = (Config['debug'] && Config['debug']['debug_models_and_collections'])? 1:null;
        console.log('models/address_type loaded');

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
            model_name: 'address_type',
            model_rus_name: 'Тип адреса',
            url: function() {
                return apiUrl('address_type', this.id);
            },
            initialize: function(){
                (debug)?console.info('Model init'):null;
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                (debug)?console.warn('KABOOM!'):null;
            }
        });

        return Model;
    }
);
