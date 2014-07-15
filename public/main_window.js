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
        return(
            <div className="PositionBox">
                <MainList source="positions" />
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
        return(<input type="text" size="15" id="child2" value="test for FormEntRankPosition" />)
    }
});

var EntityBlock = React. createClass({
    render: function(){
        var class_name = this.props.entity_name;
        //console.info(class_name);
        switch(class_name) {
            case 'rank':
                return(<FormEntRank />)
                break;
            case 'position':
                return(<FormEntPosition />)
                break;
            case 'rank_position':
                return(<FormEntRankPosition />)
                break;

        };
        return(<div>&nbsp;</div>)
    }
});

var BaseScreen = React. createClass({
    getInitialState: function() {
        return {
            screen_name: '',
            entities: []
        };
    },
    componentDidMount: function() {
        if(this.props.screen_name==null){
            this.setState({screen_name: 'welcome'})
        }
        this.setState({screen_name: this.props.screen_name});
        var entities = screen_entities;
        this.setState({entities: entities});
    },
    render: function(){
        //var render_entities = [];
       // var screens_arr = this.state.entities;
        //var screen_name = this.state.screen_name;

        //var entities_arr=screens_arr[screen_name];

        var render_entities = this.state.entities.map(function(ent){
            return(<EntityBlock entity_name={ent} key={ent} />);
        });

        for(var key in entities_arr){
            //render_entities.push(<EntityBlock entity_name={entities_arr[key]} key={key} />)

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