/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree_main',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus',
        'jsx!views/react/controls/tree_mixin',
        'jsx!views/react/controls/tree_node_box',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete'

    ],function($, _, Backbone, React, EventBus,
               TreeClassMixin, TreeNodeBox,
               ButtonAdd, ButtonEdit, ButtonDelete
        ){

        var TreeNode = React.createClass({
            mixins: [TreeClassMixin],
            getInitialState: function () {
                return {
                    visible: true,
                    model: this.props.model,
                    open: false,
                    dependency_items: []
                };
            },
            closeState: function(e){
                if(this.props.model.get('id')!=e.detail.id){
                    this.setState({open: false});
                }
            },
            componentWillMount: function(){
                console.log('Node WillMount -> this.props.model:');
                console.log(this.props.model);
                if(this.props.model.get('childNodes')!=null){
                    this.setState({visible: false});
                }
                window.addEventListener("closeWhoOpenEvent", this.closeState, true);
                console.log('Node WillMount -> add event =closeWhoOpenEvent=');
            },
            componentWillUnmount: function () {
                window.removeEventListener("closeWhoOpenEvent", this.closeState, true);
            },
            nodeControlClicked: function(action){
                var customEvent = new CustomEvent("modalWindowOpen",  {
                    detail: {
                        action: action,
                        entity: 'doc_type_groups_edit', //FIX!!!
                        model: this.props.model,
                        current_id: this.props.model.get('id')
                    },
                    bubbles: true
                });
                console.log('nodeControlClicked > dispatch event:');
                console.log(customEvent);
                this.getDOMNode().dispatchEvent(customEvent);
            },
            whenClicked: function(){
                this.setState({open: this.state.open==true? false: true});
                var closeWhoOpenEvent = new CustomEvent("closeWhoOpenEvent",  {
                    detail: {
                        id: this.props.model.get('id')
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(closeWhoOpenEvent);
            },
            getNodeTreeDependency: function(){
                console.info('===getNodeTreeDependency===');
                console.log('podpindosnost!');
                /*
                 if(typeof this.props.tree_dependency.id_name_in_dependency != 'undefined' ){
                 var url = 'http://zend_test/main/'
                 + this.props.tree_dependency.source
                 + '/search/'
                 + this.props.tree_dependency.id_name_in_dependency
                 + '/'
                 + this.props.node.id;
                 var data = '';
                 console.info('url: '+url);

                 $.get(url, function (result) {
                 var dependency_items = [];
                 dependency_items = result.data;
                 data = result.data;
                 }.bind(this));
                 return data;
                 }*/
            },
            render: function () {
                var className = "";
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }


                var dependency_box = [];
                console.log('Node Render');
                console.log('Node Render -> this.props.model');
                console.log(this.props.model);

                /*
                 if(typeof this.props.tree_dependency != 'undefined'){
                 //if(this.props.had_dependeny_items){
                 className = 'glyphicon';
                 if (this.state.open == true) {
                 className += " glyphicon-chevron-left";
                 } else {
                 className += " glyphicon-chevron-right";
                 }
                 dependency_box[0] = <div className="dependency_open_link"><span className={className} onClick={this.whenClicked}></span></div>;


                 if(this.state.open == true){
                 dependency_box[1] =
                 <div className="tree_dependency_box">
                 <div className="dependencies_list">
                 <EntityBlock
                 entity_name = {this.props.tree_dependency.entity_name}
                 db_prop_name={this.props.tree_dependency.id_name_in_dependency}
                 host={this.props.node} />
                 </div>
                 </div>;
                 }
                 }
                 */

                var tree_dependency ='';

                if (this.props.model.get('items')!= null) {
                    console.info('Node Render -> this.props.model.get(items)!=null');
                    console.log(this.props.model.get('items'));
                    if(this.props.model.get('items').length>0){
                        console.log('this.props.model.get(items).length= '+this.props.model.get('items').length);
                        className = "glyphicon togglable";
                        if (this.state.visible) {
                            className += " glyphicon-minus";
                        } else {
                            className += " glyphicon-plus";
                        }
                        var node_key = 'tree_box_node'+this.props.model.get('id');

                        //<TreeNodeBox item={this.props.model} />
                        //<MainTree source={null} childs={this.props.model.get('items')} tree_dependency={this.props.model.get('attr_dependency')} />
                        return(
                            <li>
                                <div className="tree_box_node"
                                draggable="true"
                                onDrop={this.drop}
                                onDragEnd={this.dragEnd}
                                onDragStart={this.dragStart}
                                onDragOver={this.dragOver}
                                onDragLeave={this.dragLeave}
                                key={node_key}
                                id={this.props.model.get('id')} >
                                    <span onClick={this.toggle} className={className}></span>
                                    <TreeNodeBox model={this.props.model} />
                        {dependency_box}
                                </div>
                                <div className="tree_box_node_controls">
                                    <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                                    <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                                    <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                                </div>
                                <div className="tree_childs" style={style}>
                                    <div>MainTree child</div>
                                </div>
                            </li>
                            );
                    }
                }
                return(
                    <li style={style}>
                        <div className="tree_box_node"
                        draggable="true"
                        onDragEnd={this.dragEnd}
                        onDragStart={this.dragStart}
                        onDragOver={this.dragOver}
                        onDragLeave={this.dragLeave}
                        onDrop={this.drop}
                        id={this.props.model.get('id')}>
                            <TreeNodeBox model={this.props.model} tree_dependency={tree_dependency}/>
                        {dependency_box}
                        </div>
                        <div className="tree_box_node_controls">
                            <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                            <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                            <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                        </div>
                    </li>
                    );
            },
            toggle: function () {
                this.setState({visible: !this.state.visible});
                var closeWhoOpenEvent = new CustomEvent("closeWhoOpenEvent",  {
                    detail: {
                        id: this.props.model.get('id')
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(closeWhoOpenEvent);
            }
        });

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
                console.log('MainTree DidMount');
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
                var tree_output = {};
                var self = this;
                var collection = this.state.collection;
                tree_output = this.state.collection.map(function(model){
                        return(<TreeNode key={model.get('id')} model={model} tree_dependency={model.attr_dependencies} />)
                        //return(<div>{model.get('name')}</div>)
                });
                return(<ul className="tree">{tree_output}</ul>);
            }
        });

        return MainTree;
    }
);


