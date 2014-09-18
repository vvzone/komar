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
                    items: [], //array!!
                    dependency_items: []
                };
            },
            handleMyEvent: function(event){
                //console.info(event);
                var items = [];
                items = this.state.items;
                var droppedOn_Id = event.detail.movedNode.droppedOn_id;
                var dragged =  event.detail.movedNode.dragged;

                var clean_items = this.itemRemoveFromArrayById(dragged.id , dragged.node, droppedOn_Id);
                var new_items = this.itemAddInArrayById(droppedOn_Id , dragged.node, clean_items);
                this.setState({items: new_items});
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
            componentWillMount: function() {
                window.addEventListener("TreeNodeMove", this.handleMyEvent, true);
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
            componentDidMount: function() {
                console.log('=*= Tree Mount =*=');
                if(this.props.childs!=null){
                    this.setState({items: this.props.childs});
                }else{
                    var url = 'http://zend_test/main/' + this.props.source;
                    var items = [];
                    var items_ids_for_check = [];
                    var self = this;

                    $.ajax({
                        type: "GET",
                        url: ''+url+'',
                        success: function(result) {
                            items = result.data;
                            this.setState({items: items});
                            items.map(function(item){ //????
                                items_ids_for_check.push(item.id);
                            });

                            console.log('items_ids_for_check: ');
                            console.log(items_ids_for_check);

                            $.ajax({
                                type: "POST",
                                url: 'http://zend_test/main/'
                                    +this.props.tree_dependency.source
                                    +'/dependency/'
                                    + this.props.tree_dependency.id_name_in_dependency,
                                data: result.data.map(function(item){

                                    console.log('item');
                                    console.log(item);
                                    return item.id;
                                }),
                                success: function(data) {
                                    console.log('dependencies data received: ');
                                    console.log(data);
                                }.bind(this),
                                dataType: 'json'
                            });

                        }.bind(this),
                        dataType: 'json'
                    });

                    /*
                     var url_dependency = 'http://zend_test/main/';
                     $.get(url_dependency, function (result) {
                     var dependency_items = [];
                     dependency_items = result.data;
                     this.setState({dependency_items: dependency_items});
                     }.bind(this));*/
                }
            },
            /*
             checkDidIdOwnDependency: function(node_id){
             var url = 'http://zend_test/main/'
             + this.props.tree_dependency.source
             +'/check/'
             + this.props.tree_dependency.id_name_in_dependency
             + '/'
             + node_id;

             console.log('checkDidIdOwnDependency, url: '+url);

             $.get(url, function (result) {
             var items = [];
             items = result.data;
             this.setState({items: items});
             }.bind(this));
             },*/
            render: function(){
                var tree = [];
                var tree_output = [];
                if(Object.prototype.toString.call(this.state.items) === '[object Array]'){
                    var self = this;

                    /*var dependency_owners_id = {};
                     if(this.props.tree_dependency){
                     dependency_owners_id = this.state.items.map(function(node){
                     var o_node = self.checkDidIdOwnDependency(node.id);
                     if(o_node == true){
                     return node.id
                     }
                     });
                     }
                     console.log('dependency_owners_id');
                     console.log(dependency_owners_id);*/

                    tree_output = this.state.items.map(function(node){
                        //console.log('self.props.tree_dependency');
                        //console.log(self.props.tree_dependency);
                        return(<TreeNode key={node.id} node={node} tree_dependency={self.props.tree_dependency} />)
                    });
                    return(<ul className="tree">{tree_output}</ul>);
                }
            }
        });

        return MainTree;
    }
);


