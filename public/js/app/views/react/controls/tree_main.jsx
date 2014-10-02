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
                var self = this;
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

                var current_childs = this.props.model.get('items');
                if (current_childs != null && current_childs.length > 0) { // after tree-making this is may be not null
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

                        var childs = this.props.model.get('items');
                        console.info('childs --->:');
                        console.log(childs);
                        //child_box = <MainTree childs={childs} />;

                        var child_box ={} ;

                        child_box = childs.map(function(child){
                            return <TreeNode model={child} move={self.props.move}/>; //{child.get('name')}
                        });
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
                                    <ul>
                                    {child_box}
                                    </ul>
                                </div>
                            </li>
                            );
                    }
                }else{
                    console.warn('regular Node w/out childs:');
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
                                <TreeNodeBox model={this.state.model} tree_dependency={tree_dependency}/>
                        {dependency_box}
                            </div>
                            <div className="tree_box_node_controls">
                                <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                                <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                                <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                            </div>
                        </li>
                        );
                }
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

                var collection = this.props.collection;
                var tree = this.makeTreeFromFlat(collection);
                /*var processed_collection = collection.reset();
                processed_collection = collection(tree);
                console.info('MainTree -> componentDidMount -> processed_collection:');
                console.info(processed_collection);*/
                //this.setState({collection: processed_collection});
                this.setState({collection: tree});
            },
            makeTreeFromFlat: function(collection){
                var nodes = collection.map(function(model){
                    return model;
                });

                var map = {}, node, roots = [];
                for (var i = 0; i < nodes.length; i += 1) {
                    node = nodes[i];
                    node.set({items: []}, {silent: true}); //items = [];
                    //console.log('node');
                    //console.log(node);
                    map[node.get('id')] = i; // use map to look-up the parents
                    //console.log('map['+node.get('id')+'] ='+i);
                    //console.log(map[node.get('id')]);
                    if (node.get('parent')!= null) {
                        var num = map[node.get('parent')];
                        //console.log('num='+num);
                        //nodes[num].items.push(node);
                        var items = nodes[num].get('items');
                        items.push(node);
                        nodes[num].set('items', items);

                    } else {
                        roots.push(node);
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
            moved: function(event){
                console.info('MainTree -> TreeNodeMove (listener) catch...');
                var items = [];
                items = this.state.collection;
                var droppedOn_Id = event.droppedOn_id;
                console.log('droppedOn_Id='+droppedOn_Id);
                var dragged = event.dragged;
                console.log('dragged:');
                console.log(dragged);
                //var clean_items = this.itemRemoveFromArrayById(dragged.id , dragged.model, droppedOn_Id); //bug with "no-same level node"
                //var new_items = this.itemAddInArrayById(droppedOn_Id , dragged.model, clean_items);
                console.info('current collection:');
                console.log(this.state.collection);
                console.info('change collection on: ');
                console.log(new_items);
                //this.setState({collection: new_items}); //FIX -> collection
            },
            itemRemoveFromArrayById: function(value, model, droppedOn_Id){
                //var collection = this.state.collection; //WRONG! This is parent collection just accidentally
                var collection = model.collection;
                console.log('collection, before remove moved:');
                console.log(collection);
                collection.remove(model);
                console.warn('collection after remove moved');
                console.log(collection);

                return collection;
                //this.setState({collection: collection}); //fix this: force re-render on collectionchange
                /*
                var array = this.state.collection;
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
                */
            },
            itemAddInArrayById: function(droppedOn_Id, new_child_model, clean_items){

                var dropped_on_model = '';
                var collection = this.state.collection;
                dropped_on_model = collection.map(
                    function(model){
                        if(model.get('id') == droppedOn_Id){
                            return model;
                        }else{
                            if(model.get('items')!=null){

                            }
                        }
                    }
                );
                dropped_on_model = clean_items.get(droppedOn_Id); //WRONG! This is collection just accidentally
                console.log('dropped_on_model:');
                console.log(dropped_on_model);

                var dropped_on_childs_collection = dropped_on_model.get('items'); //may be null
                if(dropped_on_childs_collection == null){
                    //no collection-class present
                    console.log('EMPTY COLLECTION ITEMS');
                    var empty_collection = clean_items.clone();
                    dropped_on_childs_collection = empty_collection.reset();
                }else{

                }
                console.log('dropped_on_childs_collection');
                console.log(dropped_on_childs_collection);

                dropped_on_childs_collection.add(new_child_model);
                console.log('dropped_on_childs_collection -> after add');
                console.log(dropped_on_childs_collection);

                dropped_on_model.set({items: dropped_on_childs_collection});
                console.log('setting new items collection to model..., dropped_on_model:');
                console.log(dropped_on_model);

                var new_items = clean_items.add(dropped_on_model);

                return new_items;
                /*var array = {};
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
                return array;*/
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
                return(<ul className="tree">{tree_output}</ul>);
            }
        });

        return MainTree;
    }
);


