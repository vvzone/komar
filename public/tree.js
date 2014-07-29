/** @jsx React.DOM */

var storage = {};


var TreeNodeBox = React.createClass({
    render: function(){
        var key='tree_box_name'+this.props.item.id;
        return(<span className="tree_box_node_name" key={key}>{this.props.item.name}</span>)
    }
});


var TreeNode = React.createClass({
    getInitialState: function () {
        return {
            visible: true,
            node: this.props.node
        };
    },
    componentDidMount: function(){
        if(this.props.node.childNodes!=null){
            this.setState({visible: false});
        }
    },
    dragStart: function(e) {
        this.dragged = e.currentTarget;
        //console.log(e.currentTarget);
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires dataTransfer data to be set
        e.dataTransfer.setData("text/html", e.currentTarget);

        var data = {id: e.currentTarget.id,
                    node: this.state.node};
        storage['dragged'] = data;
    },
    dragOver: function(e) {
        e.preventDefault(); // necessary!
        this.over = e.currentTarget;
        if(this.over == this.dragged){
            return;
        }
        $(this.over).addClass('tree_over_node');
    },
    dragLeave: function(e){
        e.preventDefault(); // necessary!
        $(this.over).removeClass('tree_over_node');
    },
    dragEnd: function(e) {
        e.preventDefault(); // necessary!
        $(this.over).removeClass('tree_over_node');
    },
    drop: function(e){
        e.preventDefault();
        console.warn('DROP');
        $(this.over).removeClass('tree_over_node');
        var droppedOn = e.currentTarget;

        if(droppedOn.id == storage['dragged']['id']){ //add same parent check
            console.warn('stop');
            return
        }

        var movedNode = {
            dragged: storage['dragged'],
            droppedOn_id: droppedOn.id
        };

        var customEvent = new CustomEvent("TreeNodeMove",  {
            detail: {movedNode: movedNode},
            bubbles: true
        });

        console.info('dispatch event');
        this.getDOMNode().dispatchEvent(customEvent);
    },
    nodeControlClicked: function(action){
        var customEvent = new CustomEvent("modalWindowOpen",  {
            detail: {
                action: action,
                entity: 'doc_kind_edit',
                current_id: this.props.node.id
                    },
            bubbles: true
        });
        this.getDOMNode().dispatchEvent(customEvent);
    },
    render: function () {
        var className = "";
        var style = {};
        if (!this.state.visible) {
            style.display = "none";
        }

        if (this.props.node.childNodes != null) {
            if(this.props.node.childNodes.length>0){
            className = "glyphicon togglable";
            if (this.state.visible) {
                className += " glyphicon-minus";
            } else {
                className += " glyphicon-plus";
            }
            var node_key = 'tree_box_node'+this.props.node.id;

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
                    </div>
                    <div className="tree_box_node_controls">
                        <ButtonAdd mini="true" clicked={this.nodeControlClicked} />
                        <ButtonEdit mini="true" clicked={this.nodeControlClicked} />
                        <ButtonDelete mini="true" clicked={this.nodeControlClicked} />
                    </div>
                    <div className="tree_childs" style={style}>
                        <MainTree source={null} childs={this.props.node.childNodes}/>
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
                        <TreeNodeBox item={this.props.node}/>
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
    }
});


var MainTree = React.createClass({
    getInitialState: function() {
        return {
            items: [] //array!!
        };
    },
    handleMyEvent: function(event){
        console.info(event);
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
    componentDidMount: function() {
        if(this.props.childs!=null){
            this.setState({items: this.props.childs});
        }else{
            $.get('http://zend_test/main/dockinds', function (result) {
                var items = [];
                items = result.data;
                this.setState({items: items});
            }.bind(this));
        }
    },
    render: function(){
        var tree = [];
        var tree_output = [];
        if(Object.prototype.toString.call(this.state.items) === '[object Array]'){
            var self = this;
            tree_output = this.state.items.map(function(node){
                return(<TreeNode key={node.id} node={node} />)
            });
            return(<ul className="tree">{tree_output}</ul>);
        }
    }
});