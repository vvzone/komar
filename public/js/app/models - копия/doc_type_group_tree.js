define(
    'models/doc_type_group_tree',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'apiUrl'
    ],function($, _, Backbone, React, apiUrl){

        console.log('models/doc_type_group_tree');

        var DocTypeGroup= Backbone.Model.extend({
            defaults: {
                id: null,
                parent: null,
                name: null,
                short_name: null,
                is_service: false,
                children: null,
                items: null
            },
            attr_description: {
                children: 'Дерево дочерних элементов '
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Краткое название',
                is_service: 'Системная'
            },
            model_description: 'Возвращается в виде дерева',
            model_name: 'doc_type_group_tree',
            model_rus_name: 'Дерево групп типов документа',
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
                /*else{
                    console.log('model init -> NO child\'s EMPTY COLLECTION SET');
                    if(!DocTypeGroupsCollection){
                        console.log('loading sub-collection for child\'s');
                        var DocTypeGroupsCollection = require("models/doc_type_groups_collection");
                    }
                    var ChildCollection = new DocTypeGroupsCollection(null);
                    this.set({items: ChildCollection});
                }*/
                this.on('destroy', this.baDaBum);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }

        });

        return DocTypeGroup;
    }
);
