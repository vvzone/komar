/** @jsx React.DOM */
/* some base elements */

var ErrorMsg = React.createClass({
    render: function () {
        //class="btn btn-sm btn-warning">
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
            return ( <button className="ButtonDiscard btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ban-circle"></span></button> )
        }
        return ( <button className="ButtonDiscard btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ban-circle"></span>  Сброс</button> );
    }
});


var ButtonSave = React.createClass({
    handleClick: function (e) {
        var action = 'save';
        this.props.clicked(action);
    },
    render: function () {
        if(this.props.mini == 'true'){
            return ( <button className="ButtonSave btn btn-xs btn-success" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ok"></span></button> )
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
            return ( <button className="ButtonEdit btn btn-xs btn-warning" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span></button> )
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
            return ( <button className="ButtonDelete btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span></button> );
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
        return(<a href={this.props.item.id} onClick={this.handleClick}>{this.props.item.name}</a>)
    }
});

var ControlTinyText = React.createClass({
    getInitialState: function() {
        return {
            value: this.props.value,
            discard: this.props.discard
        };
    },
    discardChanges: function(){
        this.setState({value: this.props.value});
    },
    componentDidMount: function() {
        this.setState({value: this.props.value});
        this.setState({discard: this.props.discard});
    },
    componentWillReceiveProps: function(prop){
        this.discardChanges();
    },
    handleChange: function(event){
        this.setState({value: event.target.value});
    },
    render: function(){
        var id = 'tiny_control_'+this.props.name;
        console.info('this.state.discard='+this.state.discard);
        return(<div className="form-group">
            <label htmlFor={id}>{this.props.name}</label>
            <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} />
        </div>)
    }
});

var ControlSmallText = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            discard: undefined
        };
    },
    discardChanges: function(){
        this.setState({value: this.props.value});
    },
    componentDidMount: function() {
        this.setState({value: this.props.value});
        this.setState({discard: this.props.discard});
    },
    componentWillReceiveProps: function(prop){
        this.discardChanges();
    },
    handleChange: function(event){
        this.setState({value: event.target.value});
    },
    render: function(){
        var id = 'small_control_'+this.props.name;
        console.info('this.state.discard'+this.state.discard);
        return(<div className="form-group">
            <label htmlFor={id}>{this.props.name}</label>
            <textarea className="form-control" id={id} value={this.state.value} onChange={this.handleChange} />
        </div>)
    }
});

var ControlBoolSelect = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            discard: undefined
        };
    },
    componentDidMount: function() {
        this.setState({value: this.props.value});
    },
    handleChange: function(event){
        this.setState({value: event.target.value});
    },
    render: function(){
        var id = 'bool_select_'+this.props.name;
        var selected = this.state.value;
        return(
            <div className="form-group">
                <label htmlFor={id}>{this.props.name}</label>
                <select value={selected} id={id} onChange={this.handleChange}>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                </select>
            </div>
        )
    }
});

/* Controls: text, selector, search */



var Control = React.createClass({
    /* Router
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
    componentDidMount: function() {
        this.setState({value: this.props.value});
        this.setState({discard: this.props.discard});

    },
    componentWillReceiveProps: function(prop){
        this.setState({discard: prop.discard});
    },
    render: function () {
        var type = this.props.type;
        var value = this.props.value;
        var name = this.props.name;
        var discard = this.props.discard;

        switch (type) {
            case('tiny_text'):
                return(<ControlTinyText value={value} name={name} discard={discard} />)
                break;
            case('small_text'):
                return(<ControlSmallText value={value} name={name} discard={discard} />)
                break;
            case('bool_select'):
                return(<ControlBoolSelect value={value} name={name} discard={discard} />)
                break;
        }

        return(<div></div>)
    }
});

/*
var ControlsList = React.createClass({
    getInitialState: function() {
        return {
            items: this.props.items,
            discard: false
        };
    },
    childrensDiscardChanges: function(){
        this.setState({discard: this.state.discard==true? false : true});
    },
    render: function(){
        var controls = [];
        var controls2 = [];
        var editable = this.props.editable;

        for(var prop in this.state.items){
            if(editable[prop]){
                var type=prop;
                controls.push(
                    <Control type={properties_types[type]} value={this.state.items[prop]} name={editable[prop]} discard={this.state.discard} />
                )
                console.log('type:'+type);
                console.log('control chosen:'+properties_types[type]);
            }
        };
        return(<form role="form" className="ControlsBox">{controls}<ButtonSave /><ButtonDiscard clicked={this.childrensDiscardChanges}/></form>)
    }
});*/

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
    componentDidMount: function() {
        this.setState({item: this.props.item});
    },
    itemAdditionalInfo : function(){

    },
    whenClickedCP: function(action){

        this.setState({open: this.state.open==true? false: false});
        if(action == 'edit'){
            this.setState({editing: this.state.editing==true? false: true});
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

        if(this.state.editing == true){
            var controls = [];
            var counter = 0;
            var dependencies_place = this.props.dependencies_place;
            var counter_trigger = [];

            // 2-do: //fix this
            if(Object.prototype.toString.call(dependencies_place) === '[object Array]'){
                    for(var key in dependencies_place){
                        counter_trigger[dependencies_place[key]] = dependencies_place[key];
                    }
            }

            for(var prop in items){
                if(Object.prototype.toString.call(dependencies_place) === '[object Array]'){
                    if(counter==counter_trigger[counter]){
                        controls.push(<EntityBlock entity_name={this.props.dependencies[key]} item={this.props.item} />);
                    }
                }
                if(editable[prop]){
                    var type=prop;
                    controls.push(
                        <Control type={properties_types[type]} value={items[prop]} name={editable[prop]} />
                    )
                    //console.log('type:'+type);
                    //console.log('control chosen:'+properties_types[type]);
                }
                counter++;
            };
            if(Object.prototype.toString.call(dependencies_place) != '[object Array]'){
                if(this.props.dependencies){
                    for(var key in this.props.dependencies){
                        controls.push(<EntityBlock entity_name={this.props.dependencies[key]} item={this.props.item} />);
                    }
                }
            }
            edit_properties_box.push(<form role="form" className="ControlsBox">{controls}<ButtonSave /></form>);
        }

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

        $.get('http://zend_test/main/index/'+this.props.source, function(result) {
                this.setState({items: result});
        }.bind(this))
        .error(function() {
                alert("Network Error.");
        })
    },
    whenListItemsAction: function(action){
        /* 2do
         *  action 2 ajax
         * */

        $.get('http://zend_test/main/index/yes', function(result){
            if(result['response'] == true){
                alert('Success');
            }else{
                alert('Error');
            }
        });
    },
    searchReceived: function(results){
        // exchange arrays
        this.setState({items: results});
    },
    render: function(){
        var items_arr =  [];
        items_arr = this.state.items.data;
        var output =[];
        var self = this;

        /*if(items_arr.length<1){
            var msg = 'Раздел пуст.';
            //return(<InfoMessage msg={msg}/>);
            return(<div>{msg}</div>);
        }*/

        for(var item in items_arr){
            output.push(
                <ListItem item={items_arr[item]} prototype={this.state.items.prototype} key={items_arr[item].id}
                dependencies={this.props.dependencies} dependencies_place={this.props.dependencies_place}/>);
        }

        return(
            <div className="List">
                <InstantSearch source={this.props.source} searchReceived={this.searchReceived}/>
                <div className="MainList">{output}</div>
            </div>
            )
    }
});
