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
        return ( <button className="ButtonMoveLeft btn btn-xs btn-primary" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-left"></span></button> );
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
        return ( <button className="ButtonMoveRight btn btn-xs btn-primary" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-chevron-right"></span></button> );
    }
});



var ListBoxLeft = React.createClass({
    getInitialState: function() {
        return {
            items: [],
            selected: ''
        }
    },
    componentDidMount: function() {
        this.setState({item: this.props.items})
    },
    handleClick: function(event){
        console.info(event);
    },
    handleClickButton: function(action){

    },
    render: function(){
        var list_box_items=[];
        for(var key in this.state.items){
            //console.log('key'+key+' name'+this.props.items[key]['name']+' id='+this.props.items[key]['id']);
            list_box_items.push(<option value={this.state.items[key]['id']} id={this.state.items[key]['id']} onClick={this.handleClick}>{this.state.items[key]['name']}</option>);
        }

        return(
            <div className="listBox">
                <select multiple="" size="10">{list_box_items}</select><ButtonListBoxLeft clicked={this.handleClickButton} />
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
    componentDidMount: function() {

        $.get('http://zend_test/main/index/'+this.props.source_left, function(result) {
            this.setState({items_left: result.data});
        }.bind(this));

        console.log('source_left');
        console.log(this.props.source_left);
        console.log('result');
        console.log(this.state.items_left);

        /*$.get('http://zend_test/main/index/'+this.props.source_right, function(result) {
            this.setState({items_right: result.data});
        }.bind(this));*/

        console.log('source_right');
        console.log(this.props.source_right);
        console.log('result');
        console.log(this.state.items_right);
    },
    render: function(){
        var combined = [];
        combined[0] = <ListBoxLeft items={this.state.items_left} />;
        combined[1] = <ListBoxLeft items={this.state.items_right} />;

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
            <div className="item_attr">Звания соответствующие должности:
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