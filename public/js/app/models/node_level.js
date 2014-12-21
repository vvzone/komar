/** @jsx React.DOM */

define(
    'models/node_level',
    [
        'jquery',
        'react',
        'jsx!views/react/controls/controls_mixin',
        'models/nodes_collection'
    ],function($, React, ControlsMixin, NodesCollection){
        var NodeLevelModel = Backbone.Model.extend({
            defaults: {
                id: null,
                route: null,
                level_order: null,
                level_type: null,
                name: null,
                nodes: []
            },
            attr_rus_names: {
                name: 'Название',
                nodes: 'Узлы'
            },
            attr_dependencies: null, //for recursive objects
            model_name: 'test_model',
            model_rus_name: '',
            url: function() {
                return apiUrl('test_model', this.id);
            },
            initialize: function(){
                console.info('Model init');
                this.on('destroy', this.baDaBum);
                if(_.size(this.get('nodes'))>0){
                    console.warn('_size(nodes)>0');
                    this.set('nodes', new NodesCollection(this.get('nodes')));
                }else{
                    console.info('this.get(nodes):');
                    console.info(this.get('nodes'));
                    //this.set('nodes', new NodesCollection(null));
                }
            },
            parse: function(response, xhr){
                console.info('NodeLevelModel -> parse, response:');
                console.log(response);
            },
            baDaBum: function(){
                console.warn('KABOOM!');
            }
        });

        return NodeLevelModel;
    }
);

        
        