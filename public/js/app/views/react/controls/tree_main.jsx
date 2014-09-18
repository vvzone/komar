/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree_main',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/controls/tree_node',
        'event_bus'

    ],function($, _, Backbone, React, TreeNode, EventBus){

        var MainTree = React.createClass({
            getInitialState: function() {
                return {
                    collection: [], //array!!
                    dependency_items: []
                };
            },
            componentWillMount: function() {
                window.addEventListener("TreeNodeMove", this.handleMyEvent, true);
            },
            componentDidMount: function() {
                console.log('MainTree -> mounting');
                if(this.props.childs!=null){
                    console.log('MainTree -> childrens');
                    this.setState({collection: this.props.childs});
                }else{
                    this.setState({collection: this.props.collection});
                }
            },
            handleMyEvent: function(event){
                var items = [];
                items = this.state.items;
                var droppedOn_Id = event.detail.movedNode.droppedOn_id;
                var dragged =  event.detail.movedNode.dragged;
                var clean_items = this.itemRemoveFromArrayById(dragged.id , dragged.node, droppedOn_Id);
                var new_items = this.itemAddInArrayById(droppedOn_Id , dragged.node, clean_items);

                this.setState({items: new_items}); //FIX -> collection
            },
            itemRemoveFromArrayById: function(value, node, droppedOn_Id){
                var array = this.state.items;
                var catcher = [];
                for(var i = 0; i < array.length; i++){
                    if(array[i]){
                        if(array[i].id == value){
                            delete array[i];
                            return array;
                        }
                    }
                }
                return array;
            },
            itemAddInArrayById: function(droppedOn_Id, new_child, clean_items){
                var array = {};
                var old_parent = new_child.parent_id;
                new_child.parent_id = parseInt(droppedOn_Id);
                array = clean_items;
                var catcher = [];
                for(var i = 0; i < array.length; i++){
                    if(array[i]){
                        console.info('array.length= '+array.length+' i='+i+' array[i].id='+array[i]['id']+' droppedOn_Id= '+droppedOn_Id);
                        if(array[i].id == droppedOn_Id ){
                            //old_parent!=droppedOn_Id
                            if(array[i]['childNodes']){
                                var childs = {}; // truly magic
                                childs = array[i]['childNodes'];
                                childs.push(new_child);
                                array[i]['childNodes'].push(new_child);
                                return array;
                                break;
                            }else{
                                array[i]['childNodes'] = [];
                                array[i]['childNodes'].push(new_child);
                                break;
                            }
                        }
                    }
                }
                return array;
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
                var tree_output = [];
                var self = this;
                tree_output = this.state.items.map(function(node){
                        return(<TreeNode key={node.id} node={node} tree_dependency={self.props.tree_dependency} />)
                });
                return(<ul className="tree">{tree_output}</ul>);
            }
        });

        return MainTree;
    }
);


