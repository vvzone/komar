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
                parent: 'Идентификатор родительского элемента',
                children: 'Дочерние элементы на один уровень ниже',
                items: 'Служебное поле клиентской части'
            },
            attr_rus_names: {
                name: 'Название',
                short_name: 'Краткое название',
                is_service: 'Системная'
            },
            model_name: 'doc_type_group',
            model_rus_name: 'Группа типа документа',
            attr_dependencies: null, //for recursive objects
            url: function() {
                return apiUrl('doc_type_group', this.id);
            },
            initialize: function(){
                console.info('Model init');
                if (Array.isArray(this.get('children'))) {
                    console.log('model init -> has children');
                    if(!DocTypeGroupsCollection){
                        console.log('loading sub-collection for children');
                        var DocTypeGroupsCollection = require("models/doc_type_groups_collection");
                    }
                    var ChildCollection = new DocTypeGroupsCollection(this.get('children'));
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
