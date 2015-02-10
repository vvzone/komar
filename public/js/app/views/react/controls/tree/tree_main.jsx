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
            /*
            * props:
            * childs, collection (same)
            * */
            getInitialState: function() {
                return {
                    collection: [], //array!!
                    plain_collection: [],
                    dependency_items: []
                };
            },
            componentWillMount: function() {
                console.warn('MainTree -> componentWillMount');
                //this will throw all components handle
                //window.addEventListener("TreeNodeMove", this.handleMyEvent, true);
            },
            componentDidMount: function() {
                console.warn('MainTree -> componentDidMount');
                if(this.props.childs!=null){
                    console.log('MainTree -> childrens');
                    this.setState({plain_collection: this.props.childs});
                }else{
                    this.setState({plain_collection: this.props.collection});
                }
                console.info('this.state.plain_collection:');
                console.info(this.state.plain_collection);
                var collection = this.props.collection;
                var clone = collection.clone();
                var tree = this.makeTreeFromFlat(clone);
                this.setState({collection: tree});
            },
            makeTreeFromFlat: function(collection){


                var pre_sort = collection.groupBy(function(model){
                   return model.get('parent');
                });

                console.info('pre_sort');
                console.info(pre_sort);

                var sorted_collection = collection.sortBy(function(model){
                    console.log(model.get('name')+'.get(parent)('+model.get('id')+')='+model.get('parent'));
                    return model.get('parent');
                });

                var slepok = sorted_collection.map(function(model){
                    var record = model.get('name')+', id='+model.get('id')+' parent='+model.get('parent');
                    return record;
                });
                console.log('slepok -> sorted_collection');
                console.log(slepok);

                var nodes = sorted_collection.map(function(model){
                    return model;
                });

                console.info('makeTreeFromFlat, received collection:');
                console.info(collection);
                console.info('makeTreeFromFlat, received nodes');
                console.info(nodes);

                var map = {}, node, roots = [];
                for (var i = 0; i < _.size(nodes); i += 1) { //nodes.length
                    console.warn('size' + _.size(nodes));
                    console.log('map');
                    console.log(map);
                    if(typeof nodes[i] != 'undefined'){
                        //check for trash in collection
                        node = nodes[i];
                        if(node.get('items')!=null){
                            console.log('makeTreeFromFlat > cleanup items...');
                            node.set({items: null}, {silent: true}); //?what tha f...?
                        }

                        if(node.get('items') == null){
                            node.set({items: []}, {silent: true}); //items = [];
                        }
                        console.log('node');
                        console.log(node);
                        map[node.get('id')] = i; // use map to look-up the parents подобное сохранение не позволит сохранять возврат при произвольной сортировке
                        console.log('map['+node.get('id')+'] ='+i);
                        console.log(map[node.get('id')]);
                        if (node.get('parent')!= null) {
                            var num = map[node.get('parent')]; //нет в мап
                            console.log('num='+num);
                            var items = nodes[num].get('items'); //так как нет в мап то num - undefined
                            items.push(node);
                            nodes[num].set('items', items);

                        } else {
                            roots.push(node);
                        }
                    }
                }
                console.log('Maked tree:');
                console.log(roots);
                var tree_collection = collection.clone();
                tree_collection.reset();
                tree_collection.set(roots);
                console.info('MainTree -> makeTreeFromFlat -> result collection:');
                console.info(tree_collection);
                return tree_collection;
            },
            cleanOldRealationship: function(collection){
                var cleaned = {};
                return cleaned;
            },
            moved: function(event){
                console.info('MainTree -> TreeNodeMove (listener) catch...');
                var droppedOn_Id = event.droppedOn_id; //2
                console.log('droppedOn_Id='+droppedOn_Id);
                var dragged = event.dragged;
                console.log('dragged:');
                console.log(dragged);
                var new_items = this.state.plain_collection;
                var slepok = new_items.map(function(model){
                    var record = model.get('name')+', id='+model.get('id')+' parent='+model.get('parent');
                    return record;
                });
                console.log('slepok -> plain_collection');
                console.log(slepok);


                var original_model = new_items.get(dragged.model.get('id'));
                console.log('new_items.get('+dragged.model.get('id')+')');

                console.log('original_model, slepok:');
                console.log(original_model.get('name')+', id='+original_model.get('id')+' parent='+original_model.get('parent'));

                original_model.set('parent', droppedOn_Id);

                console.log('original_model, slepok , after set parent='+droppedOn_Id);
                console.log(original_model.get('name')+', id='+original_model.get('id')+' parent='+original_model.get('parent'));

                console.info('Main Tree -> moved, current collection:');
                console.log(this.state.collection);
                console.log('flat new_items');
                console.log(new_items);

                var slepok_2 = new_items.map(function(model){
                    var record = model.get('name')+', id='+model.get('id')+' parent='+model.get('parent');
                    return record;
                });
                console.log('slepok_2 -> plain_collection');
                console.log(slepok_2);

                var tree = this.makeTreeFromFlat(new_items);
                console.info('Main Tree -> moved, changed collection: ');
                console.log(tree);
                this.setState({
                        collection: tree,
                        plain_collection: new_items
                    }); //FIX -> collection ,                        plain_collection: new_items
            },
            componentWillUnmount: function() {
                window.removeEventListener("TreeNodeMove", this.handleMyEvent, true);
            },
            treeSearch: function(node){
                if(typeof node.childNodes != 'undefined'){
                    return node.id;
                }else{
                    this.treeSearch(node.id);
                }
            },
            render: function(){
                var tree = [];
                var tree_output = {};
                var self = this;
                var collection = this.props.collection;
                if(collection.collection_rus_name){
                    $('#main_top').html('<h2>Каталог &laquo;'+collection.collection_rus_name+'&raquo;</h2>');
                }else{
                    $('#main_top').html('<h2>Название каталога не задано.</h2>');
                }

                var switch_view = '';
                if(collection.may_tree){
                    var view_as_plain_url ='#'+collection.collection_name+'_plain';
                    switch_view = <div className="switch_view">Отображать: [ <a href={view_as_plain_url} className="underline">Списком</a> / Деревом ]</div>;
                }

                tree_output = this.state.collection.map(function(model){
                        return(
                                <TreeNode
                                key={model.get('id')}
                                model={model}
                                tree_dependency={model.attr_dependencies}
                                move={self.moved}
                                />
                            );
                        //return(<div>{model.get('name')}</div>)
                });
                return(<div>{switch_view}<ul className="tree">{tree_output}</ul></div>);
            }
        });

        return MainTree;
    }
);


