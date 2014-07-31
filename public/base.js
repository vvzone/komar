/** @jsx React.DOM */
/* some base elements */


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
            open: false,
            editing: false
        }
    },
    whenClicked: function(){
        this.setState({open: this.state.open==true? false: true});
    },
    componentWillMount: function() {
        this.setState({item: this.props.item});
    },
    whenClickedCP: function(action){

        /*this.setState({open: this.state.open==true? false: false});
        if(action == 'edit'){
            this.setState({editing: this.state.editing==true? false: true});
        }*/

        if(action){
            var customEvent = new CustomEvent("modalWindowOpen",  {
                detail: {
                    action: action,
                    entity: this.props.entity.name,
                    item: this.state.item,
                    source: this.props.source,
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
     * 2 do: add-interface, msg for 0 results
     * */
    getInitialState: function() {
        return {
            items: []
        }
    },
    componentDidMount: function() {
       $.get('http://zend_test/main/'+this.props.source, function(result) {
                    this.setState({items: result});
                }.bind(this))
                .error(function() {
                    alert("Network Error.");
                })
    },
    searchReceived: function(results){
        // exchange arrays
        this.setState({items: results});
    },
    render: function () {
        var items_arr = [];
        items_arr = this.state.items.data;
        var output = [];
        var self = this;


        for (var item in items_arr) {
            output.push(
                <ListItem
                item={items_arr[item]}
                prototype={this.state.items.prototype}
                key={items_arr[item].id}
                dependencies={this.props.dependencies}
                source={this.props.source}
                entity={this.props.entity}
                />);
        }

        return(
            <div className="List">
                <InstantSearch source={this.props.source} searchReceived={this.searchReceived}/>
                <div className="MainList">{output}</div>
            </div>
            )
    }
});

var ItemEditBox = React.createClass({
    getInitialState: function () {
        return {
            item: [],
            item_dependencies: []
        }
    },
    componentDidMount: function () {
        this.setState({item: this.props.item});
    },
    saveForm: function () {
        console.info('item to save');
        console.info(this.state.item);
    },
    itemUpdate: function (property) {
        console.info('itemUpdate');
        console.log('property')
        console.log(property);

        var current_item = this.state.item;
        for (var key in property) {
            current_item[key] = property[key];
        }
        current_item[property.name] = property.value;
        this.setState({item: current_item});
    },
    componentWillMount: function () {
        window.addEventListener("saveButtonClick", this.saveForm, true);
    },
    componentWillUnmount: function () {
        window.removeEventListener("saveButtonClick", this.saveForm, true);
    },
    render: function () {
        var editable = this.props.prototype.editable_properties;

        var item = this.state.item;

        var controls = [];
        var counter = 0;
        var counter_trigger = {};

        // 2-do: //fix this
        // dependencies arrays are nightmare

        var dependencies = {};
        dependencies = this.props.dependencies;
        if (Object.prototype.toString.call(dependencies) === '[object Object]') {
            for(var key in dependencies){
                var new_key = dependencies[key].place;
                counter_trigger[new_key] = dependencies[key];
            }
        }

        for (var prop in item) {
            if (Object.prototype.toString.call(dependencies) === '[object Object]') {
                if (typeof counter_trigger[counter] !== 'undefined' && typeof counter_trigger[counter].place !== 'undefined') {
                        if (counter == counter_trigger[counter].place) {

                            console.log('========this.props.item========');
                            console.log(this.props.item);

                            controls.push(<EntityBlock
                            entity_name={counter_trigger[counter].class_name}
                            name={counter_trigger[counter].db_prop_name}
                            item={item}
                            current_id={prop[counter_trigger[counter].db_prop_name]}
                            callback={this.itemUpdate} />);
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
        var controls ='';
        console.log('this.state.item');
        console.log(this.state.item);
        var key ='edit_'+this.props.entity.name+'_'+1;
        if(this.state.item.data){
            controls = <ItemEditBox
            item={this.state.item.data}
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

});