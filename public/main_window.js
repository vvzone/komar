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
        //dependencies[0] = 'FormEntRankPosition';
        //dependencies[1] = 'FormEntRank';
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

var EntityBlock = React. createClass({
    /* Router Class */
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
        return(<div><ErrorMsg msg="Не определена конечная сущность" /></div>)
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