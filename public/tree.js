/** @jsx React.DOM */

var storage = {};

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

        //console.info('===this====');
        //console.info(this.state.node);
        var data = {id: e.currentTarget.id,
                    node: this.state.node};

        storage['dragged'] = data;
        //e.dataTransfer.setData("text/html", e.currentTarget);
        //e.dataTransfer.setData('text', id);
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
    },
    drop: function(e){
        e.preventDefault();
        console.warn('DROP');
        var droppedOn = e.currentTarget;

        /*//var parentDroppedOn = $(droppedOn).parent().parent().parent().find('div.tree_box_node');
        console.info('parentDroppedOn');
        console.info(parentDroppedOn);*/
        if(droppedOn.id == storage['dragged']['id']){ //add same parent check
            console.warn('stop');
            return
        }
        $(droppedOn).append('<div>'+droppedOn.id+' dragged='+storage['dragged']['id']+'</div>');

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

        //throw event instead
        //this.props.moveNode(movedNode);
    },
    render: function () {
        var className = "";

        var style = {};
        if (!this.state.visible) {
            style.display = "none";
        }

        if (this.props.node.childNodes != null) {
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
                    <div className="tree_childs" style={style}>
                        <MainTree source={null} childs={this.props.node.childNodes}/>
                    </div>
                </li>
                );
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

        var droppedOn = this.getItemById(droppedOn_Id);
        console.log('droppedOn');
        console.log(droppedOn);
    },
    getItemById: function(value){
        var array = this.state.items;
        var catcher = [];
        for(var i = 0; i < array.length; i++){
            //console.log('array[i]');
            //console.log(array[i]);
            if(array[i].id == value){
                catcher.push(array[i]);
            }
            if(array[i]['childNodes'] !=  undefined){
                var array_childs = array[i].childNodes;
                //console.log('have childs='+array_childs.length);
                for(var k = 0; k < array_childs.length; k++){
                    //console.log('array[k].id = '+ array_childs[k].id);
                    if(array_childs[k].id == value){
                        catcher.push(array_childs[k]);
                    }
                }
            }
        }
        return catcher.length == 1 ? catcher[0] : catcher;
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
            $.get('http://zend_test/main/index/dockinds', function (result) {
                var items = [];
                items = result.data;
                this.setState({items: items});
            }.bind(this));
        }
    },
    moveNode: function(movedNode){

        alert('main_move_node');
        console.info('this.state.items');
        console.info(this.state.items);
        /*var items = this.state.items;

        //delete items[movedNode.dragged_id];

        items.map(function(tree){
            if(){

            }
        });

        var newItemsArrange = {};
        this.setState({items: newItemsArrange});
        //save to database*/
    },
    render: function(){
        var tree = [];
        //tree = this.state.items;
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