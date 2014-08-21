define(
    'views/ranks_list',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'models/ranks_collection',
        'views/rank',
        
    ],function($, _, Backbone, React, RanksCollection, RankView){

        console.log('module views/ranks_list loaded');

        var RanksListView = Backbone.View.extend({
            el: '.list', // 2-do: extend from base-class
            tagName: 'ul',
            initialize: function() {
                console.log('RanksListView initialization...');
                _.bindAll(this, 'render');
                console.log('this.collection');
                console.log(this.collection);
                this.collection.bind('reset', this.render);
                this.render();
            },
            render: function(){
                console.log('render, this.collection:');
                console.log(this.collection);

                require(['views/react/controls/main_list'], function(MainList){
                    console.log('module returns MainList obj:');
                    console.log(MainList);
                });

                this.collection.each(function(rank){
                    console.log('collection.each, current model:');
                    console.log(rank);
                    var rankView = new RankView({ model: rank });
                    rankView.render();
                });

            }
        });

        var Ranks = new RanksCollection;
        console.log('trying fetch collection...');
        var p = Ranks.fetch({
            error: function(obj, response){
                console.warn('error, response: '+response);
            },
            success: function(){
                console.info('success & Current collection:');
                console.info(Ranks.toJSON());
                var View = new RanksListView({collection: Ranks});
            }
        });
    }
);