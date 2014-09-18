define(
    'models/doc_type_group',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/doc_type_group');

        var Menu = Backbone.Model.extend({
            defaults: {
                id: null,
                name: null,
                short_name: null,
                is_service: false,
                parent: null,
                childNodes: null,
                items: null
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Краткое название',
                is_service: 'Системная'
            },
            attr_dependencies: null, //for recursive objects
            url: function() {
                return apiUrl('doc_type_group', this.id);
            },
            initialize: function(){
                console.info('Model init');
                if (Array.isArray(this.get('childNodes'))) {
                    console.log('model init -> has child\'s');
                    if(!DocTypeGroupsCollection){
                        console.log('loading sub-collection for child\'s');
                       var DocTypeGroupsCollection = require("models/doc_type_groups_collection");
                    }
                    var ChildCollection = new DocTypeGroupsCollection(this.get('childNodes'));
                    this.set({items: ChildCollection});
                }
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return Menu;
    }
);
