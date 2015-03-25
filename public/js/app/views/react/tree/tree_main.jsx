/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree/tree_main',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus',
        'config',
        'jsx!views/react/controls/tree/tree_mixin',
        'jsx!views/react/controls/tree/tree_node',
        'jsx!views/react/controls/tree/tree_node_box',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete'

    ],function($, _, Backbone, React, EventBus, Config,
               TreeClassMixin, TreeNode, TreeNodeBox,
               ButtonAdd, ButtonEdit, ButtonDelete
        ){

        console.log('views/react/controls/tree/tree_main.jsx loaded...');
        var debug = (Config['debug'] && Config['debug']['debug_tree'])? 1:null;

        var MainTree = React.createClass({
            getInitialState: function() {
                return {
                    collection: [], //array!!
                    plain_collection: [],
                    dependency_items: []
                };
            },
            componentWillMount: function() {
                (debug)?console.warn('MainTree -> componentWillMount'):null;
            },
            componentDidMount: function() {
                (debug)?console.warn('MainTree -> componentDidMount'):null;
                if(this.props.childs!=null){
                    (debug)?console.log('MainTree -> childrens'):null;
                    this.setState({plain_collection: this.props.childs});
                }else{
                    this.setState({plain_collection: this.props.collection});
                }
                var collection = this.props.collection;
                var clone = collection.clone();
                var tree = this.makeTreeFromFlat(clone);
                this.setState({collection: tree});
            },
            sortCollection: function(collection){
                var pre_sort = collection.groupBy(function(model){
                    return model.get('parent');
                });
                var sorted_collection = collection.sortBy(function(model){
                    return model.get('parent');
                });
                var nodes = sorted_collection.map(function(model){
                    return model;
                });

                return nodes;
            },
            makeTreeFromFlat: function(collection){
                var nodes = this.sortCollection(collection);

                var map = {}, node, roots = [];
                for (var i = 0; i < _.size(nodes); i += 1) {
                    if(typeof nodes[i] != 'undefined'){
                        //check for trash in collection
                        node = nodes[i];
                        (debug)?console.log('makeTreeFromFlat > cleanup items...'):null;
                        node.set({items: []}, {silent: true}); //items = [];

                        map[node.get('id')] = i; // use map to look-up the parents подобное сохранение не позволит сохранять возврат при произвольной сортировке
                        (debug)?console.log(['map['+node.get('id')+'] ='+i, map[node.get('id')]]):null;

                        if (node.get('parent')!= null) {
                            var num = map[node.get('parent')]; //нет в мап
                            (debug)?console.log('num='+num):null;
                            var items = nodes[num].get('items'); //так как нет в мап то num - undefined
                            items.push(node);
                            nodes[num].set('items', items);

                        } else {
                            roots.push(node);
                        }
                    }
                }
                (debug)?console.log(['Maked tree:',roots]):null;
                var tree_collection = collection.clone();
                tree_collection.reset();
                tree_collection.set(roots);
                (debug)?console.info(['MainTree -> makeTreeFromFlat -> result collection:', tree_collection]):null;
                return tree_collection;
            },
            cleanOldRelations: function(collection){
                var cleaned = {};
                return cleaned;
            },
            moved: function(event){
                (debug)?console.info('MainTree -> TreeNodeMove (listener) catch...'):null;
                var droppedOn_Id = event.droppedOn_id; //2
                (debug)?console.log('droppedOn_Id='+droppedOn_Id):null;
                var dragged = event.dragged;
                (debug)?console.log(['dragged:', dragged]):null;
                var new_items = this.state.plain_collection;
                var original_model = new_items.get(dragged.model.get('id'));
                original_model.set('parent', droppedOn_Id);
                var tree = this.makeTreeFromFlat(new_items);
                (debug)?console.info(['Main Tree -> moved, changed collection: ', tree]):null;
                this.setState({
                        collection: tree,
                        plain_collection: new_items
                    }); //FIX -> collection ,
            },
            componentWillUnmount: function() {
                window.removeEventListener("TreeNodeMove", this.handleMyEvent, true);
            },
            render: function(){
                var tree_output = <div className="info">Нет элементов</div>;
                var self = this;
                this.treeHeader();
                if(this.state.collection.length>0){
                    tree_output = this.state.collection.map(function(model){
                        return(
                            <TreeNode
                            key={model.get('id')}
                            model={model}
                            tree_dependency={model.attr_dependencies}
                            move={self.moved}
                            />
                            );
                    });
                }
                return(
                    <div>
                        {this.treeControlPanel()}
                        <ul className="tree">{tree_output}</ul>
                    </div>
                );
            },
            /* -= template methods =- */
            addItem: function(){
                var new_model = this.props.collection.model.prototype.clone(); //!silent - don't force re-render before save model to server
                console.info(['new_model', new_model]);
                EventBus.trigger('item-add', new_model);
            },
            newElementButton: function(){
                return(
                    <div className="btn_add"><ButtonAdd clicked={this.addItem} /></div>
                );
            },
            treeHeader: function(){
                var collection = this.props.collection;
                if(collection.collection_rus_name){
                    $('#main_top').html('<h2>Каталог &laquo;'+collection.collection_rus_name+'&raquo;</h2>');
                }else{
                    $('#main_top').html('<h2>Название каталога не задано.</h2>');
                }
            },
            switchToPlain: function(){
                var collection = this.props.collection;
                var switch_view = '';
                if(collection.may_tree){
                    var view_as_plain_url ='#'+collection.collection_name+'_plain';
                    switch_view = <div className="switch_view">Отображать: [ <a href={view_as_plain_url} className="underline">Списком</a> / Деревом ]</div>;
                }
                return switch_view;
            },
            treeControlPanel: function(){
                return(
                    <div className="tree_control_panel">
                    {this.switchToPlain()}
                    {this.newElementButton()}
                    </div>
                );
            }
        });

        return MainTree;
    }
);


