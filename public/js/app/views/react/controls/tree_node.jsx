/** @jsx React.DOM */

var storage = {};

define(
    'views/react/controls/tree_node',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/controls/tree_mixin',
        'jsx!views/react/controls/tree_node_box'

    ],function($, _, Backbone, React, TreeClassMixin){

        var TreeNode = React.createClass({
            mixins: [TreeClassMixin],
            getInitialState: function () {
                return {
                    visible: true,
                    node: this.props.node,
                    open: false,
                    dependency_items: [],
                };
            },
            closeState: function(e){
                if(this.props.node.id!=e.detail.id){
                    this.setState({open: false});
                }
            },
            componentDidMount: function(){
                if(this.props.node.childNodes!=null){
                    this.setState({visible: false});
                }
                window.addEventListener("closeWhoOpenEvent", this.closeState, true);
            },
            componentWillUnmount: function () {
                window.removeEventListener("closeWhoOpenEvent", this.closeState, true);
            },
            nodeControlClicked: function(action){
                var customEvent = new CustomEvent("modalWindowOpen",  {
                    detail: {
                        action: action,
                        entity: 'doc_type_groups_edit',
                        item: this.props.node,
                        current_id: this.props.node.id
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(customEvent);
            },
            whenClicked: function(){
                this.setState({open: this.state.open==true? false: true});
                var closeWhoOpenEvent = new CustomEvent("closeWhoOpenEvent",  {
                    detail: {
                        id: this.props.node.id
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(closeWhoOpenEvent);
            },
            getNodeTreeDependency: function(){
                console.info('===getNodeTreeDependency===');
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
                }
            },
            render: function () {
                var className = "";
                var style = {};
                if (!this.state.visible) {
                    style.display = "none";
                }

                var dependency_box = [];
                console.info('this.props.tree_dependency');
                console.info(this.props.tree_dependency);

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
                    //dependency_box dependency_open_link + tree_dependency_box;
                    //}
                    //{this.props.tree_dependency.russian_name}
                }
                /*
                 if(this.state.open == true){

                 var dependency_items = this.getNodeTreeDependency;
                 var self=this;

                 for(var item in dependency_items){ // onClick output short info
                 //if(editable[prop]){
                 tree_dependency.push(
                 <div>{dependency_items.name}</div>
                 );
                 //}
                 }
                 }*/

                if (this.props.node.childNodes != null) {
                    if(this.props.node.childNodes.length>0){
                        className = "glyphicon togglable";
                        if (this.state.visible) {
                            className += " glyphicon-minus";
                        } else {
                            className += " glyphicon-plus";
                        }
                        var node_key = 'tree_box_node'+this.props.node.id;
                        var tree_dependency ='';
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
                                id={this.props.node.id} >
                                    <span onClick={this.toggle} className={className}></span>
                                    <TreeNodeBox item={this.props.node}/>
                        {dependency_box}
                                </div>
                                <div className="tree_box_node_controls">
                                    <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                                    <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                                    <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                                </div>
                                <div className="tree_childs" style={style}>
                                    <MainTree source={null} childs={this.props.node.childNodes} tree_dependency={this.props.tree_dependency}/>
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
                        id={this.props.node.id}>
                            <TreeNodeBox item={this.props.node} tree_dependency={tree_dependency}/>
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
                        id: this.props.node.id
                    },
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(closeWhoOpenEvent);
            }
        });
    }
);



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