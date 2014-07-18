/** @jsx React.DOM */

var MainScreen = React.createClass({

    render: function(){
        return(
            <div className="MainScreen">
                <EntityAttributesList entity_id={this.props.entity_id} />
            </div>
            )
    }
});

var FormEntPosition = React. createClass({
    render: function(){

        var dependencies = [];
        dependencies[0] = 'rank_position';
        return(
            <div className="PositionBox">
                <MainList source="positions" dependencies={dependencies} />
            </div>
            )
    }
});

var FormEntRank = React. createClass({
    render: function(){
        return(
            <div className="RankBox">
                <MainList source="ranks" />
            </div>
            )
    }
});

var FormEntPassDocTypes = React. createClass({
    render: function(){
        return(
            <div className="PassDocTypesBox">
                <MainList source="passdoctypes" />
            </div>
            )
    }
});



/*
 var MainDropDown = React. createClass({

 });
 */

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
            list_box_items.push(<option key={this.props.items[key]['id']} value={this.props.items[key]['id']} id={this.props.items[key]['id']} onClick={this.handleClick}>{this.props.items[key]['name']}</option>);
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
        $.get('http://zend_test/main/index/'+this.props.source_left, function(result) {
            var arr = [];
            for(var item in result.data){
                arr[result.data[item]['id']] = result.data[item];
            }
            this.setState({items_left: arr});
        }.bind(this));

        $.get('http://zend_test/main/index/'+this.props.source_right, function(result) {
            var arr = [];
            for(var item in result.data){
                arr[result.data[item]['id']] = result.data[item];
            }
            this.setState({items_right: arr});
        }.bind(this));

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

        combined[0] = <ListBox key="combo" items={items_left} callback={this.listChange} type="left" />;
        combined[1] = <ListBox key="combo_right" items={items_right} callback={this.listChange} type="right" />;

        return(
            <div className="two-way-list-box">{combined}</div>
        )
    }
});


var FormEntRankPosition = React. createClass({
    render: function(){
        console.info(this.props.host_id);
        var source = [];
        source[0] = 'positionsranks';
        source[1] = 'ranks';

        return(
            <div className="item_attr">
                <div className="form_label">Звания соответствующие должности</div>
                <ListBoxTwoSide source_left={source[0]} source_right={source[1]} />
            </div>
            )
    }
});

/*
var FormEntRankPosition = React. createClass({
    render: function(){
        console.info(this.props.host_id);
        return(
            <div className="item_attr">Звания соответствующие должности:
                <MainList source="positionsranks" host_id={this.props.host_id} non_base="true" />
            </div>
        )
    }
});
*/
var EntityBlock = React. createClass({
    /* Router Class
    * props:
    * entity_name = '',
    * host_id - for dependencies
    * */
    render: function(){
        var class_name = this.props.entity_name;
        var host_id = this.props.host_id;
        switch(class_name) {
            case 'rank':
                return(<FormEntRank />)
                break;
            case 'position':
                return(<FormEntPosition />)
                break;
            case 'rank_position':
                return(<FormEntRankPosition host_id={host_id} />)
                break;
            case 'pass_doc_types':
                return(<FormEntPassDocTypes />)

        };
        var msg = "Не найден класс "+class_name;
        return(<div><ErrorMsg msg={msg} /></div>)
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
                //console.log('ent='+ent);
            });
        }else{
            var msg = 'Страница '+ this.props.screen_name +  ' не найдена';
            return(
                <ErrorMsg msg={msg} />
            )
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
    handleMyEvent: function(e) {;
        this.setState({screen_name: e.detail.screen_name});
    },
    componentWillMount: function() {
        window.addEventListener("catLinkClick", this.handleMyEvent, true);
    },
    componentWillUnmount: function() {
        window.removeEventListener("catLinkClick", this.handleMyEvent, true);
    },
    render: function(){
        return(<div><BaseScreen screen_name={this.state.screen_name} /></div>)
    }
});