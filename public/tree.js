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
        //$(droppedOn).append('<div>'+droppedOn.id+' dragged='+storage['dragged']['id']+'</div>');

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
        var dragged =  event.detail.movedNode.dragged;

        // var droppedOn = this.itemAddInArrayById(droppedOn_Id);

        var clean_items = this.itemRemoveFromArrayById(dragged.id);
        var new_items = this.itemAddInArrayById(droppedOn_Id , dragged.node, clean_items);

        //this.setState({items: new_items});

        //console.log('clean_items');
        //console.log(clean_items);
        //this.setState({items: clean_items});

        console.log('===========[NEW_ITEMS]===========');
        console.log(new_items);
        console.log('===========+++++++++++===========');
        this.setState({items: new_items});
    },
    itemRemoveFromArrayById: function(value){
        var array = this.state.items;
        var catcher = [];
        for(var i = 0; i < array.length; i++){
            if(array[i]){
                console.warn('array.length= '+array.length+' i='+i+' array[i].id='+array[i]['id']+' value= '+value);
                if(array[i].id == value){
                    console.warn('array[i].id');
                    console.warn(array[i].id);
                    console.error('=========delete==========');
                    console.warn(array[i]);
                    console.warn('=========================');
                    delete array[i];
                    return array;
                }
                else{
                    console.warn('else');
                    console.warn(array[i]['childNodes']);
                    if(array[i]['childNodes']){
                        console.warn('anyway childNodes:');
                        console.warn(array[i]['childNodes'])
                        for(var k = 0; k < array[i].childNodes.length; k++){
                            if(array[i]['childNodes'][k].id == value){
                                console.error('=========delete==========');
                                console.warn(array[i]['childNodes'][k]);
                                console.warn('=========================');
                                delete array[i]['childNodes'][k];
                                return array;
                            }
                        }
                    }
                }
            }
        }
        return array;
    },
    itemAddInArrayById: function(value, new_child, clean_items){
        var array = {};
        new_child.parent_id = parseInt(value);
        //array = this.state.items;
        array = clean_items;
        var catcher = [];
        for(var i = 0; i < array.length; i++){
            if(array[i]){
                console.info('array.length= '+array.length+' i='+i+' array[i].id='+array[i]['id']+' value= '+value);
                if(array[i].id == value){
                    console.info('array[i].id');
                    console.info(array[i].id);

                    if(array[i]['childNodes']){
                        console.info('====add===add====add====');
                        console.info('array[i].childNodes');
                        console.info(array[i].childNodes);
                        console.info('new_child');
                        console.info(new_child);

                        var num = array[i]['childNodes'].length;
                        num++;
                        console.info('num= '+num);


                        var childs = {}; // truly magic
                        childs = array[i]['childNodes'];
                        childs.push(new_child);

                        console.info('childs');
                        console.info(childs);

                        array[i]['childNodes'].push(new_child);
                        console.info('after push');
                        console.info(array[i]['childNodes']);
                        console.info('array');
                        console.info(array[i].childNodes);
                        console.info('=========================');
                        return array;
                        break;
                    }else{
                        console.info('==========[ADD]===========');
                        array[i]['childNodes'] = [];
                        array[i]['childNodes'].push(new_child);
                        break;
                    }
                }
                else{
                    console.log('else');
                    //console.log(array[i]['childNodes']);

                    if(array[i]['childNodes']){
                        console.log('anyway childNodes:');
                        console.log(array[i]['childNodes']);
                        for(var k = 0; k < array[i].childNodes.length; k++){
                            if(array[i]['childNodes'][k].id == value){

                                console.info('===========FINDED');
                                var childs = {};
                                childs = array[i]['childNodes'][k]['childNodes'];
                                childs.push(new_child);
                                
                                array[i]['childNodes'][k]['childNodes'].push(new_child);
                                //delete array[i]['childNodes'][k];
                                //return array;
                            }
                        }
                    }
                }
            }
        }
        return array;
    },
    /*itemAddInArrayById: function(value, new_child, clean_items){
        var array = clean_items;
        var catcher = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].id == value){
                array[i]['childNodes'].push(new_child);
            }
            if(array[i]['childNodes'] !=  undefined){
                for(var k = 0; k < array[i].childNodes.length; k++){
                    if(array[i]['childNodes'][k].id == value){
                        array[i]['childNodes'][k]['childNodes'].push(new_child);
                    }
                }
            }
        }
        return array;
    },*/
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
        /*console.info('RENDER STATE ITEMS');
        console.info(this.state.items);
        console.info('==================');*/
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