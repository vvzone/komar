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
    render: function () {
        var output = [];

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

        var instant_search_box = [];
        instant_search_box[0] = <InstantSearch source={this.props.source} searchReceived={this.searchReceived}/>;

        return(
            <div className="List">
                {instant_search_box}
                <div className="MainList">{output}</div>
            </div>
            )
    }
});

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
    componentDidMount: function () {
        this.setState({item: this.props.item});
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
    },
    componentWillUnmount: function () {
        window.removeEventListener("saveButtonClick", this.saveForm, true);
    },
    render: function () {
        var editable = this.props.prototype.editable_properties;

        var item = this.state.item;

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

        var self = this;
        for (var prop in item) {
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
        if(this.state.item.data){
            controls[0] = <ItemEditBox
            item={this.state.item.data[0]}
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