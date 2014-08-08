/** @jsx React.DOM */

var ControlsMixin = function () {
    return{
        discardChanges: function(){
            this.setState({value: this.props.value});
        },
        componentWillMount: function() {
            this.setState({value: this.props.value});
            this.setState({discard: this.props.discard});
        },
        handleChange: function(event){
            this.setState({value: event.target.value});
            var property = {};
            property[this.props.name] = event.target.value;
            this.props.callback(property);
        }
    }
}();/** @jsx React.DOM */

var ControlTinyText = React.createClass({
    mixins: [ControlsMixin],
    getInitialState: function() {
        return {
            value: this.props.value,
            discard: this.props.discard
        };
    },
    render: function(){
        var id = 'tiny_control_'+this.props.russian_name;
        return(<div className="form-group">
            <label htmlFor={id}>{this.props.russian_name}</label>
            <input type="text" className="form-control" name={this.props.name} value={this.state.value} onChange={this.handleChange} />
        </div>)
    }
});

var ControlSmallText = React.createClass({
    mixins: [ControlsMixin],
    getInitialState: function() {
        return {
            value: '',
            discard: undefined
        };
    },
    render: function(){
        var id = 'small_control_'+this.props.russian_name;
        return(<div className="form-group">
            <label htmlFor={id}>{this.props.russian_name}</label>
            <textarea className="form-control" id={id} name={this.props.name} value={this.state.value} onChange={this.handleChange} />
        </div>)
    }
});

var ControlBoolSelect = React.createClass({
    mixins: [ControlsMixin],
    getInitialState: function() {
        return {
            value: '',
            discard: undefined
        };
    },
    render: function(){
        var id = 'bool_select_'+this.props.russian_name;
        var selected = this.state.value;
        return(
            <div className="form-group">
                <label htmlFor={id}>{this.props.russian_name}</label>
                <select value={selected} name={this.props.name} id={id} onChange={this.handleChange}>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </div>
            )
    }
});

/* Controls: text, selector, search */


var ControlRouter = React.createClass({
    /* Router  fix this as soon as some free time ;)
     * ---
     * props: value, type (route)
     *
     * */
    getInitialState: function() {
        return {
            value: '',
            discard: false
        };
    },
    componentWillReceiveProps: function(prop){
        this.setState({discard: prop.discard});
    },
    callBack: function(property){
        this.props.callback(property);
    },
    render: function () {
        var type = this.props.type;
        var value = this.props.value;
        var name = this.props.name;
        var russian_name = this.props.russian_name;
        var discard = this.props.discard;
        var self = this;
        switch (type) {
            case('tiny_text'):
                return(<ControlTinyText value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                break;
            case('small_text'):
                return(<ControlSmallText value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                break;
            case('bool_select'):
                return(<ControlBoolSelect value={value} name={name} russian_name={russian_name} discard={discard} callback={self.callBack} />);
                break;
        }

        return(<div></div>)
    }
});

;/** @jsx React.DOM */

ButtonListBoxLeft = React.createClass({
    handleClick: function (e) {
        var action = 'move_left';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonMoveLeft btn btn-xs btn-primary" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-left"></span></button> )
        }
        return ( <button className="ButtonMoveLeft btn btn-xs btn-link btn-block" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-left"></span></button> );
    }
});

ButtonListBoxRight = React.createClass({
    handleClick: function (e) {
        var action = 'move_right';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonMoveRight btn btn-xs btn-primary" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-right"></span></button> )
        }
        return ( <button className="ButtonMoveRight btn btn-xs btn-link btn-block" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-right"></span></button> );
    }
});


/* Select */

var SimpleSelect = React.createClass({
    /*
    * props: selected, source
    * */
     getInitialState: function() {
        return {
            options: [],
            selected: ''
        }
    },

    handleChange: function(event){
        this.setState({selected: event.target.value});
        var property = {};
        console.error(this.props.entity.db_prop_name);
        property[this.props.entity.db_prop_name] = event.target.value;
        this.props.callback(property);
    },
    componentDidMount: function() {
        this.setState({selected: this.props.selected});
        console.log('WillMount selected='+this.props.selected);
        console.log('===========this.props=========');
        console.log(this.props);

        $.get('http://zend_test/main/'+this.props.source, function(result) {
            var arr = [];
            for(var item in result.data){
                arr[result.data[item]['id']] = result.data[item];
            }
            this.setState({options: arr});
        }.bind(this));

    },
    render: function(){
        var options = [];
        var selected = 0;
        if(this.state.selected){
            selected = this.state.selected;
            console.log('SELECTED');
            console.log(selected);
        }

        for(var key in this.state.options){
            options.push(<option key={this.state.options[key]['id']}
            value={this.state.options[key]['id']}
            id={this.state.options[key]['id']}
            onClick={this.handleClick}>
                {this.state.options[key]['name']}
            </option>);
        }

        return(<select value={selected} onChange={this.handleChange}>{options}</select>)
    }
});

/* ListBOX*/

var ListBox = React.createClass({
    getInitialState: function() {
        return {
            selected: []
        }
    },
    handleClickButton: function(action){
        var callback = [];
        callback['action'] = action;
        callback['id'] = this.state.selected;
        var callback_item=[];
        callback_item = this.props.items[callback['id']];
        callback['item'] = callback_item;
        this.props.callback(callback);
        this.forceUpdate();
    },
    handleChange: function(event){
        this.setState({selected: event.target.value});
    },
    render: function(){
        var list_box_items=[];
        for(var key in this.props.items){
            list_box_items.push(
                <option
                key={this.props.items[key]['id']}
                value={this.props.items[key]['id']}
                id={this.props.items[key]['id']}
                onClick={this.handleClick}
                >
                {this.props.items[key]['name']}
                </option>
            );
        }
        if(this.props.type == 'right'){
            return( <div className="list_box">
                <div className="list_box_select">
                    <select multiple="" size="10" onChange={this.handleChange}>{list_box_items}</select>
                </div>
                <div className="list_box_cp">
                    <ButtonListBoxLeft clicked={this.handleClickButton} />
                </div>
            </div>)
        }
        return(
            <div className="list_box">
                <div className="list_box_select">
                    <select multiple="" size="10" onChange={this.handleChange}>{list_box_items}</select>
                </div>
                <div className="list_box_cp">
                    <ButtonListBoxRight clicked={this.handleClickButton} />
                </div>
            </div>
        )
    }
});

var ListBoxTwoSide = React.createClass({
    getInitialState: function() {
        return {
            items_left: [],
            items_right: []
        }
    },
    listChange: function(callback){
        var current_list = [];
        var target_list = [];
        if(callback['action']=='move_left'){
            current_list = this.state.items_right;
            target_list = this.state.items_left;
        }else{
            current_list = this.state.items_left;
            target_list = this.state.items_right;
        }

        delete current_list[callback['id']];
        target_list[callback['id']] = callback['item'];


        if(callback['action']=='move_left'){
            this.setState({items_right: current_list});
            this.setState({items_left: target_list});

        }else{
            this.setState({items_left: current_list});
            this.setState({items_right: target_list});
        }
    },
    componentDidMount: function() {
        var arr_items_2_select = [];
        $.get('http://zend_test/main/'+this.props.source_right, function(result) {
            var arr = [];
            for(var item in result.data){
                arr[result.data[item]['id']] = result.data[item];
            }
            arr_items_2_select = arr;
            this.setState({items_right: arr});
        }.bind(this));

        $.get('http://zend_test/main/'+this.props.source_left, function(result) {
            var arr = [];
            for(var item in result.data){
                arr[result.data[item]['id']] = arr_items_2_select[result.data[item]['id']];
            }
            this.setState({items_left: arr});
        }.bind(this));

        //add listener because it's another table, so this is need to save separately, but with post current_id
        /*
        * save:
        * to source+left
        * this.state.items_left
        * for
        * this.props.entity.current_id.id
        *
        * only add new, remove those who not send but in db on server-side
        *
        * */

    },
    render: function(){
        var combined = [];
        var items_left = this.state.items_left;
        var items_right = this.state.items_right;

        for(var id in items_left){
            console.log('id='+id);
            console.log('2 delete='+items_right[id]);
            delete items_right[id];
        }

        combined[0] = <ListBox key="combo" key_prefix="left" items={items_left} callback={this.listChange} type="left" />;
        combined[1] = <ListBox key="combo_right" key_prefix="right" items={items_right} callback={this.listChange} type="right" />;

        console.info('LIST BOX PROPS');
        console.info(this.props);
        return(
            <div className="two-way-list-box">{combined}</div>
        )
    }
});
;/** @jsx React.DOM */

var ListItem = React.createClass({
    /*
     * <ListItem item=[] key='' action={this.whenListItemsAction} />
     * props:
     * item = []; required: 'name', 'id'
     * key - unique;
     * */
    getInitialState: function() {
        return {
            item: [],
            item_dependencies: [],
            open: false
        }
    },
    whenClicked: function(){
        this.setState({open: this.state.open==true? false: true});
    },
    componentWillMount: function() {
        this.setState({item: this.props.item});
    },
    whenClickedCP: function(action){
        if(action){
            var customEvent = new CustomEvent("modalWindowOpen",  {
                detail: {
                    action: action,
                    source: this.props.source,
                    entity: this.props.entity.entity_name,
                    item: this.state.item,
                    current_id: this.props.item.id
                },
                bubbles: true
            });
            this.getDOMNode().dispatchEvent(customEvent);
        }
    },
    render: function(){
        var delete_key= 'delete/'+this.props.item.id;
        var edit_key= 'edit/'+this.props.item.id;

        var item_additional_info = [];
        var editable = this.props.prototype.editable_properties;

        if(this.state.open == true){
            var self=this;

            for(var prop in this.state.item){ // onClick output short info
                if(editable[prop]){
                    item_additional_info.push(
                        <div>{editable[prop]}:{this.state.item[prop]}</div>
                    )
                }
            }
        }

        var edit_properties_box = [];
        var items = this.state.item;

        return(
            <div className="item">
                <div className="item_name"><ItemLink item={this.props.item} onClick={this.whenClicked} /></div>
                <div className="item_cp">
                    <ButtonEdit clicked={this.whenClickedCP} id={this.props.item.id} key={edit_key} mini={this.props.non_base}/>
                    <ButtonDelete clicked={this.whenClickedCP} id={this.props.item.id} key={delete_key} mini={this.props.non_base}/>
                </div>
                {item_additional_info}
                {edit_properties_box}
            </div>
            )
    }
});


var MainList = React. createClass({
    /* Props
     *
     * source - server data-controller action (entity)
     * entity.host.id - id or other value for search dependency
     * entity.db_prop_name - name of pole for search
     *
     * 2 do: add-interface, msg for 0 results
     * */
    getInitialState: function() {
        return {
            items: []
        }
    },
    componentDidMount: function() {
        var url = '';
        console.error('this.props');
        console.log('this.props');
        console.log(this.props);
        if(this.props.entity.host){
            var pole_name = 'id';
            if(this.props.entity.db_prop_name){
                pole_name = this.props.entity.db_prop_name;
            }
            url = 'http://zend_test/main/'
                + this.props.source
                +'/search/'
                + pole_name+'/'
                + this.props.entity.host.id;
        }else{
            url = 'http://zend_test/main/'+this.props.source;
        }

        $.get(url, function(response) {
                this.setState({items: response});
            }.bind(this))
            .error(function() {
                alert("Network Error.");
            });
    },
    searchReceived: function(results){
        // exchange arrays
        this.setState({items: results});
    },
    whenClickedCP: function(action){
        if(action){
            console.info('this.props.entity');
            console.info(this.props.entity);
            var customEvent = new CustomEvent("modalWindowOpen",  {
                detail: {
                    action: action,
                    source: this.props.source,
                    entity: this.props.entity.entity_name// check this!
                    /*item: this.state.item, // undefined
                    current_id: this.props.item.id //undefined*/
                },
                bubbles: true
            });
            this.getDOMNode().dispatchEvent(customEvent);
        }
    },
    render: function () {
        var output = [];
        var self = this;

        console.log('this.state.items.data');
        console.log(this.state.items.data);
        for (var item in this.state.items.data) {
            output.push(
                <ListItem
                    source={this.props.source}
                    item={this.state.items.data[item]}
                    prototype={this.state.items.prototype}
                    key={this.state.items.data[item].id}
                    entity={this.props.entity}
                    dependencies={this.props.dependencies}
                />);
        }

        var list_header = [];
        var instant_search_box = [];
        instant_search_box[0] = <div className="InstantSeacrh"><InstantSearch source={this.props.source} searchReceived={this.searchReceived}/></div>;

        list_header[0] = instant_search_box;
        list_header[1] = <div className="ButtonAdd"><ButtonAdd clicked={self.whenClickedCP}/></div>;
        return(
            <div className="List">
                <div className="ListHeader">{list_header}</div>
                <div className="MainList">{output}</div>
            </div>
            )
    }
});;/** @jsx React.DOM */

var storage = {};

var TreeClassMixin = function () {
    return{
        dragStart: function(e) {
            this.dragged = e.currentTarget;
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
            this.getDOMNode().dispatchEvent(customEvent);
        }
    }
}()

var TreeNodeBox = React.createClass({
    render: function(){
        var key='tree_box_name'+this.props.item.id;
        return(<span className="tree_box_node_name" key={key}>{this.props.item.name}</span>)
    }
});


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
});;/** @jsx React.DOM */

var BootstrapModalMixin = function () {
    var handlerProps =
        ['handleShow', 'handleShown', 'handleHide', 'handleHidden'];

    var bsModalEvents = {
        handleShow: 'show.bs.modal',
        handleShown: 'shown.bs.modal',
        handleHide: 'hide.bs.modal',
        handleHidden: 'hidden.bs.modal'
    };

    return {
        propTypes: {
            handleShow: React.PropTypes.func,
            handleShown: React.PropTypes.func,
            handleHide: React.PropTypes.func,
            handleHidden: React.PropTypes.func,
            backdrop: React.PropTypes.bool,
            keyboard: React.PropTypes.bool,
            show: React.PropTypes.bool,
            remote: React.PropTypes.string
        },
        getDefaultProps: function () {
            return {
                backdrop: true,
                keyboard: true,
                show: true,
                remote: ''
            }
        },
        componentDidMount: function () {
            var $modal = $(this.getDOMNode()).modal({
                backdrop: this.props.backdrop,
                keyboard: this.props.keyboard,
                show: this.props.show,
                remote: this.props.remote
            });
            handlerProps.forEach(function (prop) {
                if (this[prop]) {
                    $modal.on(bsModalEvents[prop], this[prop])
                }
                if (this.props[prop]) {
                    $modal.on(bsModalEvents[prop], this.props[prop])
                }
            }.bind(this));
        },
        componentWillUnmount: function () {
            var $modal = $(this.getDOMNode())
            handlerProps.forEach(function (prop) {
                if (this[prop]) {
                    $modal.off(bsModalEvents[prop], this[prop])
                }
                if (this.props[prop]) {
                    $modal.off(bsModalEvents[prop], this.props[prop])
                }
            }.bind(this))
        },
        hide: function () {
            $(this.getDOMNode()).modal('hide');
            var customEvent = new CustomEvent("modalWindowClose");
            this.getDOMNode().dispatchEvent(customEvent);
        },
        show: function () {
            $(this.getDOMNode()).modal('show');
        },
        toggle: function () {
            $(this.getDOMNode()).modal('toggle');
        },
        renderCloseButton: function () {
            var inner_html = {__html: '&times'};
            return <button
            type="button"
            className="close"
            onClick={this.hide}
            dangerouslySetInnerHTML={inner_html}
            />
        }
    }
}();/** @jsx React.DOM */

var ModalWindowAdd = React.createClass({
    getInitialState: function() {
        return {
            var: ''
        };
    },
    handleShowModal: function () {
        this.refs.modal.show();
    },
    handleExternalHide: function () {
        this.refs.modal.hide();
    },
    render: function(){
        var buttons = [
            {type: 'success', text: 'Добавить', handler: this.handleDoingNothing},
            {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Новая запись в "; //+this.entity.name;

        var content = <EntityBlock entity_name={this.props.entity} item={this.props.current_id} />; //очень плохое решение с передачей в виде отдельных свойств
        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring
            <ModalWindowBase
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
            >
            {content}
            </ModalWindowBase>
            );

    }
});

var ModalWindowEdit = React.createClass({
    getInitialState: function() {
        return {
            var: ''
        };
    },
    handleShowModal: function () {
        this.refs.modal.show();
    },
    handleExternalHide: function () {
        this.refs.modal.hide();
    },
    throwSave: function(){
        var customEvent = new CustomEvent("saveButtonClick",  {
            detail: {id: this.props.current_id},
            bubbles: true
        });
        this.getDOMNode().dispatchEvent(customEvent);
    },
    render: function(){
        var buttons = [
            {type: 'success', text: 'Сохранить', handler: this.throwSave},
            {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Редактировать "; //+this.entity.name;

        console.log('modal and current:');
        console.log(this.props.current_id);

        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring

            <ModalWindowBase
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
            >
                <EntityBlock entity_name={this.props.entity} item={this.props.current_id} />
            </ModalWindowBase>
            );

    }
});

var ModalWindowDelete = React.createClass({
    getInitialState: function() {
        return {
            var: ''
        };
    },
    handleShowModal: function () {
        this.refs.modal.show();
    },
    handleExternalHide: function () {
        this.refs.modal.hide();
    },
    throwDelete: function(){

    },
    render: function(){
        var buttons = [
            {type: 'success', text: 'Удалить', handler: this.throwDelete},
            {type: 'default', text: 'Отмена', handler: this.handleExternalHide}
        ];
        var header = "Вы уверены?"; //+this.entity.name;

        console.log('Delete');
        console.log(this.props);

        var msg = "Будет удален обьект «" +  this.props.item.name + "»";
        if(this.props.item.childNodes){
            var childs = '';
            /*var childNodes = this.props.item.childNodes;
            console.log('this.props.item.childNodes');
            console.log(this.props.item.childNodes);
            for(var key in childNodes){

                childs = childs + childNodes[key].name +', ';
            }*/
            //msg = msg + 'Следующие дочерние обьекты будут удалены: '+childs;
            msg = msg + ', а также все дочерние обьекты.';
        }else{
            msg = msg + '.'
        }

        return(
            /* Entity */
            // 2 do: BaseWindow,
            // entity form refactoring
            <ModalWindowDeleteConfirmation
            ref="modal"
            show={false}
            header={header}
            buttons={buttons}
            msg={msg}
            >
            </ModalWindowDeleteConfirmation>
            );
    }
});

var ModalWindowBase = React.createClass({
    mixins: [BootstrapModalMixin],
    componentDidMount: function() {
        this.show();
    },
    render: function () {
        var buttons = this.props.buttons.map(function (button) {
            return (
                <button type="button" className={'btn btn-' + button.type} onClick={button.handler} key={button.type}>
                    {button.text}
                </button>
                );
        });
        return(
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                             {this.renderCloseButton()}
                            <strong>{this.props.header}</strong>
                        </div>
                        <div className="modal-body">
                        {this.props.children}
                        </div>
                        <div className="modal-footer">
                       {buttons}
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});


var ModalWindowDeleteConfirmation = React.createClass({
    mixins: [BootstrapModalMixin],
    componentDidMount: function() {
        this.show();
    },
    render: function () {
        var buttons = this.props.buttons.map(function (button) {
            return (
                <button type="button" className={'btn btn-' + button.type} onClick={button.handler} key={button.type}>
                    {button.text}
                </button>
                );
        });

        var msg ='';
        if(this.props.msg){
            msg = <div className="modal-body">
                     {this.props.msg}
                </div>;
        }
        return(
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content alert-warning">
                        <div className="modal-header">
                             {this.renderCloseButton()}
                            <strong>{this.props.header}</strong>
                        </div>
                        {msg}
                        <div className="modal-footer">
                       {buttons}
                        </div>
                    </div>
                </div>
            </div>
            );
    }
});

;/** @jsx React.DOM */

/*
 * base - ������� �����������: ������, ���������, ���� ����������
 *   --> rank - ������
 *   --> position - ��������� + �����
 *   --> pass_doc_types
 *   --> sys - �������� ���������: ������, ����. ���,
 *   --> sys_docs - �������� ��������� ����������
 *   --> address - ��� ������
 *   --> unit_lead_types
 *   -->
 * staff - ��������
 *   --> person - ������ �������� + ������� ������, ����������, �����, ����,
 *   --> pass_docs
 *   -->
 *   -->
 *   -->
 * doc - ���������
 *   --> person_document
 *   -->
 *   -->
 *   -->
 *   -->
 *   -->
 *   -->
 * unit - �������������
 *   --> client
 *   --> unit
 *   --> unit_lead
 *   -->
 *  -->
 * */

/*
 Rank -> base -> ranks -> ranks
 Post -> base -> position -> positions
 PostRank -> base -> position_rank -> positions
 PersonDocType -> base -> pass_doc_types -> pass_doc_types

 AddressType -> base -> address_types -> sys

 SexType -> base -> sex_types -> sys
 Country -> base -> countries -> sys

 CommanderType -> base -> commander_type -> sys_units

 PeriodType -> base -> period_types -> sys_docs
 EnumerationType -> base -> enumeration_types -> sys_docs
 DocType -> base -> doc_types -> sys_docs
 NodeType -> base -> route_node_types -> sys_docs
 (?)DocTypeAttribute -> base -> doc_attribute_types -> sys_docs
 (!!???)Enumeration -> unit -> enumeration -> sys_docs
 ==================================================================

 Person -> staff -> person -> person
 PersonPost -> staff -> person_position_history -> person
 PersonRank -> staff -> person_rank_history -> person
 Address -> staff -> person_address -> person
 Role -> staff -> person_role -> person

 ==================================================================

 Document -> doc -> doc -> doc
 PersonDocument -> doc -> pass_docs -> pass_docs
 Route -> doc -> route -> doc?
 Node -> doc -> route_node -> route?
 NodeAttribute -> doc -> route_node_attribute ->(?) route_node
 Attribute -> doc -> doc_attribute - > doc

 ==================================================================

 Client -> unit -> client -> unit?        !!!
 -> staff? -> client -> person     !!!

 Unit -> unit -> unit -> unit
 UnitComander -> unit -> unit_comander -> unit
 UnitPost -> unit -> unit_positions -> unit

 Unit_DocType -> unit -> unit_doc_types -> unit
 Unit_Route -> unit -> unit_routes -> unit
 Unit_Enumeration -> unit -> unit_enumeration -> unit

 */



var test_screen = [];
test_screen[0] = 'test_entity';
test_screen[1] = 'child_test1';
test_screen[2] = 'child_test2';

var sys = [];
sys[0] = 'country';
sys[1] = 'sys1';
sys[2] = 'sys2';

var rank = [];
rank[0] = 'rank';

var position = [];
position[0] = 'position';

var pass_doc_types = [];
pass_doc_types[0] = 'pass_doc_types';

var address_types =[];
address_types[0] = 'address_types';

var countries = [];
countries[0] = 'countries';

var region_types = [];
region_types[0] = 'region_types';

var regions = [];
regions[0] = 'regions';

var location_types = [];
location_types[0] = 'location_types';

var street_types = [];
street_types[0] = 'street_types';


var sex_types = [];
sex_types[0] = 'sex_types';

var commander_types = [];
commander_types[0] = 'commander_types';


var screen_entities = {};
screen_entities['test_screen'] = test_screen;
screen_entities['sys'] = sys;
screen_entities['rank'] = rank;
screen_entities['pass_doc_types'] = pass_doc_types;
screen_entities['position'] = position;
screen_entities['address_types'] = address_types;
screen_entities['countries'] = countries;
screen_entities['region_types'] = region_types;
screen_entities['regions'] = regions;
screen_entities['location_types'] = location_types;
screen_entities['street_types'] = street_types;
screen_entities['sex_types'] = sex_types;
screen_entities['commander_types'] = commander_types;



var properties_types = [];


properties_types['name'] = 'tiny_text';
properties_types['name_min'] = 'tiny_text';
properties_types['description'] = 'small_text';

/* pass_doc_types */
properties_types['seriesMask'] = 'tiny_text';
properties_types['numberMask'] = 'tiny_text';

properties_types['isFull'] = 'bool_select';
properties_types['isMain'] = 'bool_select';
properties_types['isSeries'] = 'bool_select';

/* address_types */
properties_types['priority'] = 'tiny_text';

/* countries */
properties_types['code'] = 'tiny_text';
properties_types['fullname'] = 'small_text';

/* ? many */
properties_types['shortname'] = 'tiny_text';

/* docs */
properties_types['mask'] = 'tiny_text';
properties_types['isPeriodic'] = 'bool_select';
properties_types['period_length'] = 'tiny_text';
properties_types['start_date'] = 'tiny_text'; /* Заменить на календарь! */
properties_types['min_index'] = 'tiny_text';
properties_types['isDraft'] = 'bool_select';
properties_types['singleNumeration'] = 'bool_select';
properties_types['isService'] = 'bool_select';


var config_search = [];


/* */

/*var test_rr = [
 {entity:'rank', screen:'base', name: '������', id: 151},
 {entity:'rank', screen:'base', name: '������', id: 153},
 {entity:'rank', screen:'base', name: '������', id: 154}
 ];*/;/** @jsx React.DOM */
/* some base elements */


var ItemEditBox = React.createClass({
    /*
    * Props:
    * item - item array
    * prototype.editable_properties - from server
    * dependencies - from entity
    *
    * */
    getInitialState: function () {
        return {
            item: [],
            item_dependencies: []
        }
    },
    saveForm: function () {
        console.info('item to save');
        console.info(this.state.item);
    },
    itemUpdate: function (property) {
        //console.info('itemUpdate');
        var current_item = this.state.item;
        for (var key in property) {
            current_item[key] = property[key];
        }
        current_item[property.db_prop_name] = property.value;
        this.setState({item: current_item});
    },
    componentWillMount: function () {
        window.addEventListener("saveButtonClick", this.saveForm, true);
        this.setState({item: this.props.item});
    },
    componentWillUnmount: function () {
        window.removeEventListener("saveButtonClick", this.saveForm, true);
    },
    render: function () {
        var editable = this.props.prototype.editable_properties;

        var item = null;
        if(this.state.item){
            var item = this.state.item; //может быть и undefined для новых
        }

        var controls = [];
        var counter = 0;
        var dependencies_by_place = {};

        // 2-do: //fix this
        // dependencies arrays are nightmare
        var dependencies = {};
        dependencies = this.props.dependencies;

        //console.info('Object.prototype.toString.call(dependencies)='+Object.prototype.toString.call(dependencies));
        //console.info('typeof(dependencies)'+typeof(dependencies));
        if (typeof(dependencies) == 'object') {
            for(var key in dependencies){
                var place_key = dependencies[key].place;
                console.info('place_key= '+place_key);
                dependencies_by_place[place_key] = dependencies[key];
            }
        }

        console.log('Editable');
        var self = this;
        for (var prop in editable) { // старое item - ошибочно так как выводило только не undefined поля текущего экземпляра обьекта
            if (typeof(dependencies) == 'object') {
                if (typeof dependencies_by_place[counter] != 'undefined' && typeof dependencies_by_place[counter].place != 'undefined') {
                        if (counter == dependencies_by_place[counter].place) {
                            controls.push(<EntityBlock
                                entity_name={dependencies_by_place[counter].class_name}
                                db_prop_name={dependencies_by_place[counter].db_prop_name}
                                item={item}
                                current_id={this.props.item[dependencies_by_place[counter].db_prop_name]}
                                callback={self.itemUpdate} />);
                        }
                }
            }
            if (editable[prop]) {
                var type = prop;
                controls.push(
                    <ControlRouter type={properties_types[type]} value={item[prop]} name={type} russian_name={editable[prop]} callback={this.itemUpdate} key={editable[prop]} />
                );
            }
            counter++;
        }

        if(controls.length == 0){
            return(<ErrorMsg msg="Не найдено ни одного контрола" />);
        }

        var edit_properties_box = [];
        edit_properties_box.push(<form role="form" className="ControlsBox">{controls}</form>);
        return(
            <div className="item">
                {edit_properties_box}
            </div>
            )
    }
});

var MainItemEdit = React. createClass({
    getInitialState: function() {
        return {
            item: []
        }
    },
    componentWillMount: function() {
        var self = this;
        $.ajax({
            type: "POST",
            url: 'http://zend_test/main/' + this.props.source+'/'+this.props.entity.current_id,
            data: ''+this.props.entity.current_id+'',
            success: function(response){
                console.info('response');
                console.info(response);
                self.setState({item : response});
            }
        })
            .error(function () {
                alert("Network Error.");
            });
    },
    render: function(){
        var controls = [];
        var key ='edit_'+this.props.entity.name+'_'+1;
        var item = [];
        if(this.state.item.data){
            item = this.state.item.data[0];
        }

        if(this.state.item.prototype){ //старое item.data - может быть и undefined для add-action
            controls[0] = <ItemEditBox
            item={item}
            prototype={this.state.item.prototype}
            key={key}
            dependencies={this.props.dependencies}
            entity={this.props.entity}
            />;
        }
        return(
            <div>
                {controls}
            </div>
        );
    }

});;/** @jsx React.DOM */

var ErrorMsg = React.createClass({
    render: function () {
        var message = '';
        var header = '';
        (this.props.header == undefined)? header= 'Ошибка' : header = this.props.header;
        (this.props.msg == undefined)? message= 'Неизвестная ошибка': message = this.props.msg;

        return (
            <div className="alert alert-error">
                <a href="#" className="close" data-dismiss="alert">&times;</a>
                <strong>{header}</strong>
                <br />{message}
            </div>
            );
    }
});

var ButtonDiscard = React.createClass({
    handleClick: function (e) {
        var action = 'save';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonDiscard btn btn-xs btn-danger btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ban-circle"></span></button> )
        }
        return ( <button className="ButtonDiscard btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ban-circle"></span>  Сброс</button> );
    }
});


var ButtonAdd = React.createClass({
    handleClick: function (e) {
        var action = 'add';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonSave btn btn-xs btn-success btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-plus"></span></button> )
        }
        return ( <button className="ButtonSave btn btn-xs btn-success" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-plus"></span>  Добавить</button> );
    }
});

var ButtonSave = React.createClass({
    handleClick: function (e) {
        var action = 'save';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonSave btn btn-xs btn-success btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ok"></span></button> )
        }
        return ( <button className="ButtonSave btn btn-xs btn-success" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ok"></span>  Сохранить</button> );
    }
});

var ButtonEdit = React.createClass({
    handleClick: function (e) {
        var action = 'edit';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonEdit btn btn-xs btn-warning btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span></button> )
        }
        return ( <button className="ButtonEdit btn btn-xs btn-warning" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span>  Редактировать</button> );
    }
});



var ButtonDelete = React.createClass({
    handleClick: function (e) {
        var action = 'delete';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonDelete btn btn-xs btn-danger btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span></button> );
        }
        return ( <button className="ButtonDelete btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span>  Удалить</button> );
    }
});

var ItemLink = React. createClass({
    /*
     * props: name, clicked(), id
     *
     * */

    handleClick: function(e){
        e.preventDefault();
        this.props.onClick(this.props.item);
    },
    render: function(){
        return(<a draggable="false" href={this.props.item.id} onClick={this.handleClick}>{this.props.item.name}</a>)
    }
});
;/** @jsx React.DOM */


var EntityBlock = React. createClass({
    /* Router Class
     * props:
     * entity_name = '',
     * host - for dependencies (whole array of item, inc id, and all fields)
     * */
      render: function () {
        var class_name = this.props.entity_name;
        var current_id = this.props.current_id;

        var entity = {};
        entity['entity_name'] = this.props.entity_name;
        entity['db_prop_name'] = this.props.db_prop_name;

        entity['host'] = this.props.host; //для вывода списка в дереве

        entity['current_id'] = this.props.item; //для редактирования, нужно для хранения current_id для REST запросов вида /entity/{id}

        //entity['current_id'] = this.props.current_id;
        entity['item'] = this.props.item;



       console.log('===ACCEPTED===');
       console.log('==this.props==');
       console.log(this.props);



        switch (class_name) {
            case 'ranks':
                return(<FormEntRanks entity={entity}  callback={this.handleCallback} />);
                break;
            case 'positions':
                return(<FormEntPositions entity={entity}  callback={this.handleCallback} />);
                break;
            case 'rank_position':
                return(<FormEntRankPosition host_id={current_id} callback={this.handleCallback} />);
                break;
            case 'pass_doc_types':
                return(<FormEntPassDocTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'address_types':
                return(<FormEntAddressTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'countries':
                return(<FormEntCountries entity={entity}  callback={this.handleCallback} />);
                break;
            case 'region_types':
                return(<FormEntRegionTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'region_types_selector':
                return(<SelectorRegionTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'regions':
                return(<FormEntRegions entity={entity}  callback={this.handleCallback} />);
                break;
            case 'location_types':
                return(<FormEntLocationTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'street_types':
                return(<FormEntStreetTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'sex_types':
                return(<FormEntSexTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'commander_types':
                return(<FormEntCommanderTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'period_types':
                return(<FormEntPeriodTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'period_types_selector':
                return(<SelectorPeriodTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'enumeration_types':
                return(<FormEntEnumerationTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_type_groups':
                return(<TreeDocTypeGroups entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_type_groups_edit':
                return(<FormEntDocTypeGroups entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_secrecy_types':
                return(<FormEntDocSecrecyTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_secrecy_types_selector':
                return(<SelectorDocSecrecyTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_urgency_types':
                return(<FormEntDocUrgencyTypes entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_urgency_types_selector':
                return(<SelectorDocUrgencyTypes selected={current_id} entity={entity}  callback={this.handleCallback} />);
                break;
            case 'doc_types':
                return(<FormEntDocTypes entity={entity}  callback={this.handleCallback} />);
                break;
        };
        var msg = "Не найден класс "+class_name;
        return(<div><ErrorMsg msg={msg} /></div>)
    },
    handleCallback: function(callback){
        this.props.callback(callback);
    }
});

var CurrentClassMixin = function () {
    return {
        editMainListRoute: function(source, entity, dependencies){
            console.log('entity[current_id]');
            console.log(entity['current_id']);

            if(entity['current_id']){
                console.log('MainItemEdit');

                if(entity['current_id'] == 'new'){
                    delete entity['current_id'];
                    return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} />);
                }else{
                    return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} />);
                }
            }else{
                console.log('*=*=MainList=*=*');
                return(<MainList source={source} entity={entity} dependencies={dependencies} />);
            }
        },
        editMainTreeRoute: function(source, entity, dependencies){
            if(entity['current_id']){
                console.log('MainItemEdit');
                return(<MainItemEdit source={source} entity={entity} dependencies={dependencies} />);
            }else{
                console.log('^=^=MainTree=^=^');
                return(<MainTree source={source} entity={entity} tree_dependency={dependencies} />); //real arg is tree_dependency
            }
        },
        handleCallback: function(callback){
            this.props.callback(callback);
        }
    }
}()



var FormEntRanks = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('ranks', this.props.entity, null);
        console.log('FormEntRanks->this.props.entity');
        console.log(this.props.entity);
        return(
            <div className="RankBox">
                 {output}
            </div>
            )
    }
});

var FormEntPositions = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var dependencies = [];
        dependencies[0] = {
            class_name: 'rank_position',
            place: 2,
            db_prop_name: 'id'
        };

        var output = this.editMainListRoute('positions', this.props.entity, dependencies);
        return(
            <div className="PositionBox">
                {output}
            </div>
            )
    }
});

var FormEntRankPosition = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        console.log('FormEntRankPosition');
        var source = [];
        source[0] = 'positionsranks';
        source[1] = 'ranks';

        return(
            <div className="item_attr">
                <div className="form_label">Звания соответствующие должности</div>
                <ListBoxTwoSide source_left={source[0]} source_right={source[1]} entity={this.props.entity} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntPassDocTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('passdoctypes', this.props.entity, null);
        return(
            <div className="PassDocTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntAddressTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('addresstypes', this.props.entity, null);
        return(
            <div className="AddressBox">
                {output}
            </div>
            )
    }
});

var FormEntCountries = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('countries', this.props.entity, null);
        return(
            <div className="CountriesBox">
                {output}
            </div>
            )
    }
});

var FormEntRegionTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('regiontypes', this.props.entity, null);
        return(
            <div className="RegionTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorRegionTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector RegionTypes">
                <label>Тип региона</label>
                <SimpleSelect source="regiontypes" selected={this.props.selected} current_id={this.props.entity.current_id} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntRegions = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){

        var dependencies ={};
        dependencies[0] = {
            class_name: 'region_types_selector',
            place: 2,
            db_prop_name: 'region_type'
        };

        var output = this.editMainListRoute('regions', this.props.entity, dependencies);
        return(
            <div className="RegionsBox">
                {output}
            </div>
            )
    }
});

var FormEntLocationTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('locationtypes', this.props.entity, null);
        return(
            <div className="LocationTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntStreetTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('streettypes', this.props.entity, null);
        return(
            <div className="StreetTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntSexTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('sextypes', this.props.entity, null);
        return(
            <div className="SexTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntCommanderTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('commandertypes', this.props.entity, null);
        return(
            <div className="CommanderTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntPeriodTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('periodtypes', this.props.entity, null);
        return(
            <div className="PeriodTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorPeriodTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector PeriodTypes">
                <label>Тип периода:</label><SimpleSelect source="periodtypes" selected={this.props.selected} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntEnumerationTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){

        var dependencies = {};
        dependencies[0] = {
            class_name: 'period_types_selector',
            place: 3,
            db_prop_name: 'period_type'
        };

        var output = this.editMainListRoute('enumerationtypes', this.props.entity, dependencies);
        return(
            <div className="EnumerationTypesBox">
                {output}
            </div>
            )
    }
});

var FormEntDocTypeGroups = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainTreeRoute('doctypegroups', this.props.entity, null);
        return(
            <div className="DocKindsBox">
                {output}
            </div>
        )
    }
});

var TreeDocTypeGroups = React. createClass({
    mixins: [CurrentClassMixin],

    render: function(){
        var tree_dependency = {};
        tree_dependency = {
            source: 'doctypes',
            entity_name: 'doc_types',
            id_name_in_dependency: 'doc_group_id',
            russian_name: 'типы документов'
        };
        var output = this.editMainTreeRoute('doctypegroups', this.props.entity, tree_dependency); //MainTree !!!
        return(
            <div className="DocKindsBox">
                {output}
            </div>
            )
    }
});

var FormEntDocSecrecyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('docsecrecytypes', this.props.entity, null);
        return(
            <div className="DocSecrecyTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorDocSecrecyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector DocSecrecyTypes">
                <label>Секретность</label>
                <SimpleSelect source="docsecrecytypes" selected={this.props.selected} entity={this.props.entity} callback={this.handleCallback} />
            </div>
            )
    }
});

var FormEntDocUrgencyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        var output = this.editMainListRoute('docurgencytypes', this.props.entity, null);
        return(
            <div className="DocUrgencyTypesBox">
                {output}
            </div>
            )
    }
});

var SelectorDocUrgencyTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){
        return(
            <div className="selector DocurgencyTypes">
                <label>Срочность</label>
                <SimpleSelect source="docurgencytypes" selected={this.props.selected} entity={this.props.entity} callback={this.handleCallback}/>
            </div>
            )
    }
});



var FormEntDocTypes = React. createClass({
    mixins: [CurrentClassMixin],
    render: function(){

        var dependencies = {};
        dependencies[0] = {
            class_name: 'doc_secrecy_types_selector',
            place: 5,
            db_prop_name: 'secrecy_type'
        };

        dependencies[1] = {
            class_name: 'doc_urgency_types_selector',
            place: 6,
            db_prop_name: 'urgency_type'
        };

        var output = this.editMainListRoute('doctypes', this.props.entity, dependencies);

        return(
            <div className="DocTypesBox">
                {output}
            </div>
            )
    }
});
;/** @jsx React.DOM */


var CatLink = React. createClass({
    getInitialState: function() {
        return {
            visible: true,
            click: undefined,
            screen: []
        };
    },
    componentDidMount: function() {
        if(this.props.screen.childNodes!=null){
            this.setState({visible: false});
        }
    },
    whenClicked: function(link){
        var customEvent = new CustomEvent("catLinkClick",  {
            detail: {screen_name: link.screen},
            bubbles: true
        });
        this.getDOMNode().dispatchEvent(customEvent);
    },
    render: function(){
        var link = this.props.screen;
        var src = './react/get/screen/'+link.screen;

        var className = "";
        var style = {};
        if (!this.state.visible) {
            style.display = "none";
        }

        if(link.childNodes!=null){
            className = "glyphicon togglable";
            if (this.state.visible) {
                className += " glyphicon-minus";
            } else {
                className += " glyphicon-plus";
            }

            if(link.isNotScreen!=null){
                return(
                    <li>
                        <span onClick={this.toggle} className={className}></span>
                        <div className="childs" onClick={this.toggle}>{link.name}</div>
                        <div style={style}><CatTreeLinksList source={null} childs={link.childNodes}/></div>
                    </li>
                    );
            }
            return(
                <li><span onClick={this.toggle} className={className}></span>
                    <a className="childs" href={src}>{link.name}</a>
                    <div style={style}>
                        <CatTreeLinksList source={null} childs={link.childNodes}/>
                    </div>
                </li>
                );
        }

        return(
            //<li style={style}><a href={src}>{link.name}</a></li>
            <li style={style}><ItemLink item={link} onClick={this.whenClicked}/></li>
            );

    },
    toggle: function() {
        this.setState({visible: !this.state.visible});
    }
});

var CatTreeLinksList = React. createClass({
    getInitialState: function() {
        return {
            links: [], //array!!
            screens: '',
            entities: ''
        };
    },
    componentDidMount: function() {
        if(this.props.childs!=null){
            //array
            console.log('childrens');
            var links = [];
            var links = this.props.childs;
            this.setState({links: links})
        }else{
            //console.log('ajax!');
            $.get('http://zend_test/main/ajax', function(result) {
                var links = [];
                links = result;
                this.setState({links: links});
            }.bind(this));
        }
    },
    handleClick: function(){
      console.log('handle click');
    },
    render: function(){
        var links_output = [];
        var links = this.state.links;
        if(Object.prototype.toString.call(this.state.links) === '[object Array]'){
            var self = this;
            links_output = this.state.links.map(function(l){
                if(l.isNotScreen && l.childNodes==null){
                    return(<li><div className="tree_not_link">{l.name}</div></li>);
                }
                if(!l.isNonIndependent){
                    return(<CatLink screen={l} key={l.id} onClick={self.handleClick}/>)
                }
            });
            return(
                    <ul className="nav nav-sidebar cattree">{links_output}</ul>
                );
        }
        return(
            <ErrorMsg msg="Неправильный формат ответа сервера" />
        )
    }
});


var CatScreen = React. createClass({
    whenReaction: function(screen){
        //console.log('when_reaction');
    },
    render: function(){
        var cat = this.props.cat;
        var source = './react/get/cat/'+cat;
        return(
            <div className="well"><CatTreeLinksList source={source} childs={null} reaction={this.whenReaction}/></div>
        );
    }
});;/** @jsx React.DOM */

var SearchBox = React.createClass({
    doSearch:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.startSearch(query);
    },
    render: function(){
        return(
            <div><input type="text" ref="searchInput" placeholder="Поиск" value={this.props.query} onChange={this.doSearch} /></div>
        )
    }
});

var InstantSearch = React.createClass({
    /*getInitialState: function() {
        return {
            current_entity: '',
            items: []
        }
    },*/
    startSearch: function(query){
            $.ajax({
                type: "POST",
                url: 'http://zend_test/main/'+this.props.source,
                data: query,
                success: function(data) {
                    //this.setState({items: data})
                    this.props.searchReceived(data)
                }.bind(this),
                dataType: 'json'
            });
            console.log('query='+query);
    },
    componentDidMount: function() {
        /* not screen, maybe many on one page */
        this.setState({current_entity: this.props.entity_name});
    },
    render: function(){
        //startSearch={this.startSearch}
        return(<SearchBox startSearch={this.startSearch}/>)
    }
});
;/** @jsx React.DOM */

var MainScreen = React.createClass({

    render: function(){
        return(
            <div className="MainScreen">
                <EntityAttributesList entity_id={this.props.entity_id} />
            </div>
            )
    }
});

var BaseScreen = React. createClass({
    getInitialState: function() {
        return {
            screen_name: '',
            entities: []
        };
    },
    componentWillMount: function() {
        if(this.props.screen_name==null){
            this.setState({screen_name: 'welcome'})
        }
        this.setState({screen_name: this.props.screen_name});
        var entities = screen_entities;
        this.setState({entities: entities});
    },
    render: function(){


        var render_entities = [];
        console.info(this.state.entities);
        console.info(this.props.screen_name);

        /* Вывод множественных сущностей для одного экрана. Пока хз зачем */

        if(Object.prototype.toString.call(this.state.entities[this.props.screen_name]) === '[object Array]'){
            console.info('yes');
            render_entities =this.state.entities[this.props.screen_name].map(function(ent){
                return(<EntityBlock entity_name={ent} key={ent} />);
            });
        }else{
            /*  пробовать найти класс все равно*/

            return(<EntityBlock entity_name={this.props.screen_name} key={this.props.screen_name} />);

            /*var msg = 'Страница '+ this.props.screen_name +  " не найдена. Возможно не указана в arrays_and_docs?";
            return(
                <ErrorMsg msg={msg} />
            )*/
        }

        return(<div>{render_entities}</div>)
    }
});


var MainWindow = React.createClass({
    getInitialState: function() {
        return {
            screen_name: ''
        };
    },
    handleCatLinkClick: function(e) {
        this.setState({screen_name: e.detail.screen_name});
    },
    componentWillMount: function() {
        if(this.props.screen_name!=null){
            this.setState({screen_name: this.props.screen_name});
        }
        window.addEventListener("catLinkClick", this.handleCatLinkClick, true);
    },
    componentWillUnmount: function() {
        window.removeEventListener("catLinkClick", this.handleCatLinkClick, true);
    },
    render: function(){
        return(<div>
            <BaseScreen screen_name={this.state.screen_name} />
            <ModalWindowRouter />
        </div>)
    }
});

var ModalWindowRouter = React.createClass({
    getInitialState: function() {
        return {
            action: '',
            entity: '',
            current_id: '',
            item: ''
        };
    },
    modalOpen: function(event) {
        this.setState({
            action: event.detail.action,
            entity: event.detail.entity,
            current_id: event.detail.current_id,
            item: event.detail.item
        });
        console.log('event.detail');
        console.log(event.detail);
    },
    modalClose: function(){
        this.setState({
            action: '',
            entity: '',
            current_id: '',
            item: ''
        });
    },
    componentWillMount: function() {
        window.addEventListener("modalWindowOpen", this.modalOpen, true);
        window.addEventListener("modalWindowClose", this.modalClose, true);
    },
    componentWillUnmount: function() {
        window.removeEventListener("modalWindowOpen", this.modalOpen, true);
        window.addEventListener("modalWindowClose", this.modalClose, true);
    },
    render: function(){
        switch(this.state.action){
            case 'add':
                console.log('modal->add');
                return(<ModalWindowAdd entity={this.state.entity} item="new" current_id="new" />);
            break;
            case 'edit':
                console.log('modal->edit and state:');
                console.log(this.state.current_id);
                return(<ModalWindowEdit entity={this.state.entity} current_id={this.state.current_id} />);
            break;
            case 'delete':
                console.log('modal->delete');
                return(<ModalWindowDelete entity={this.state.entity} current_id={this.state.current_id} item={this.state.item} />);
            break;
            case 'save':
                console.log('modal->save');
                return(<ModalWindowSave />);
            break;
        }
        return(<div>&nbsp;</div>);
    }
});

;/** @jsx React.DOM */

/*
 var React  = require('react');

 var TestEntityBlock = require('./test_entity.jsx');

 var TestEntity = React.createClass({
 getInitialState: function() {
 return {
 entity: function(){
 }
 }
 },
 entityRouter: function(obj, componentName){

 componentName = '<'+componentName+' />';

 React.renderComponent(componentName,
 document.getElementById('main_main'));
 },
 render: function(){
 var obj = this.props.entity_name;
 //var entity = this.entityRouter(obj, this.props.entity_name);

 var Component = this.props.entity_name;
 return(
 <div>{Component}></div>
 );
 }
 });

 var FunctionName = React.createClass({
 render: function(){
 return(<div>Done!</div>)
 }
 });
 */

React.renderComponent(
    CatScreen({cat: "base"}),
    document.getElementById('left_panel')
);


React.renderComponent(
    MainWindow({screen_name: "ranks"}), //screen_name="doc_kinds"
    document.getElementById('main_main')
);

/*
 React.renderComponent(
 <TestEntity entity_name="FunctionName" />,
 document.getElementById('main_main')
 );
 */



