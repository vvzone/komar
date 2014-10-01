define(
    'views/tree',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus'

    ],function($, _, Backbone, React, EventBus){

        var test = [
            {"id": 1, "parent": null, "name": "\u0413\u0440\u0443\u043f\u043f\u044b \u0442\u0438\u043f\u043e\u0432 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432", "shortname": "\u041f\u0425", "is_service": true},
            {"id": 2, "parent": 1, "name": "\u0421\u0438\u0433\u043d\u0430\u043b\u044b", "shortname": "\u0421", "is_service": false},
            {"id": 3, "parent": 1, "name": "\u041f\u0440\u0438\u043a\u0430\u0437\u044b", "shortname": "\u041f", "is_service": false},
            {"id": 4, "parent": 1, "name": "\u0421\u043b\u0443\u0436\u0435\u0431\u043d\u044b\u0435", "shortname": "\u0441\u0438\u0441\u0442.", "is_service": true},
            {"id": 100, "parent": 2, "name": "\u0411\u043e\u0435\u0432\u044b\u0435", "shortname": "\u041f\u0411", "is_service": false},
            {"id": 110, "parent": 2, "name": "\u0425\u043e\u0437\u044f\u0439\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0435", "shortname": "\u041f\u0425", "is_service": false},
            {"id": 1101, "parent": 110, "name": "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b", "shortname": "\u041f\u0411", "is_service": false},
            {"id": 1102, "parent": 110, "name": "\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0447\u0430\u0441\u0442\u044c", "shortname": "\u041f\u0425", "is_service": false},
            {"id": 1001, "parent": 100, "name": "\u041e\u0431\u0449\u0435\u0432\u043e\u0439\u0441\u043a\u043e\u0432\u044b\u0435", "shortname": "\u041f\u0411", "is_service": false},
            {"id": 1002, "parent": 100, "name": "\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u044b\u0435", "shortname": "\u041f\u0425", "is_service": false}
        ]

        console.log('module views/menu loaded');

        var TreeView = Backbone.View.extend({
            //el: $('div#left_panel'), // 2-do: extend from base-class
            /*tagName: 'ul',*/
            template: '<div id="main_list_header"></div>' +
                '<div id="menu_view"></div>',
            initialize: function() {
                console.info('TreeView initialization...');
                _.bindAll(this, 'render');
                console.log('init, this.collection:');
                console.log(this.collection);
                this.collection.bind('destroy', this.render, this);
                this.collection.bind('change', this.changeCollection, this);
                this.collection.bind('reset', this.render, this);
                this.render();
            },
            changeCollection: function(){
                console.warn('TreeView -> collection.change.event');
                this.render;
            },
            render: function(){
                console.log('TreeView -> render, this.collection:');
                console.log(this.collection);
                var self = this;
                $(document).ready(function(){
                     require(['jsx!views/react/controls/tree_main'], function(TreeMain){
                         console.log('trying set collection 2 obj:');
                         console.info(self.collection);

                         React.renderComponent(
                             new TreeMain({
                                    collection: self.collection
                                }), document.getElementById("main_main")
                         );
                     });
                });
            }
        });

        var initialize = function(CollectionModule){
            console.log('start loaded...');
            var Collection = new CollectionModule;
            console.log('CollectionModule');
            console.log(CollectionModule);
            console.log('Collection');
            console.log(Collection);
            console.log('trying fetch collection...');
            var p = Collection.fetch({
                data: {recursive: 1},
                error: function(obj, response){
                    console.warn('error, response: '+response);
                    EventBus.trigger('error', 'Ошибка', 'Невозможно получить коллекцию.', response);
                },
                success: function(){
                    console.info('success & Current collection:');
                    console.info(Collection.toJSON());
                    var View = new TreeView({collection: Collection});
                }
            });
        };

        return {
            initialize: initialize
        };
    }
);