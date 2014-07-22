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



/*
 var MainDropDown = React. createClass({

 });
 */




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