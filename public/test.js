/** @jsx React.DOM */


var CatLink = React. createClass({
    getInitialState: function() {
        return {
            visible: true
        };
    },
    componentDidMount: function() {
        if(this.props.screen.childNodes!=null){
            this.setState({visible: false});
        }
    },
    whenClicked: function(screen){
        //console.log(screen);
        this.props.test(screen)
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
                    <li style={style}><ItemLink item={link} clicked={this.whenClicked}/></li>
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
    whenReaction: function(screen){
        this.props.reaction = screen ;
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
            $.get('http://zend_test/main/index/ajax', function(result) {
                var links = [];
                links = result;
                this.setState({links: links});
            }.bind(this));
        }
    },
    render: function(){
        var links_output = [];
        var links = this.state.links;

        links.forEach(function(link){
            //if(!link.isNonIndependent){
                links_output.push(<CatLink screen ={link} key={link.id} test={this.whenReaction} />)
            //}
        });
        return(
            <ul className="nav nav-sidebar cattree">{links_output}</ul>
        );
    }
});





var MainList = React. createClass({
    /* Props
    *
    * source - server data-controller action
    * */
    getInitialState: function() {
        return {
            items: []
        }
    },
    componentDidMount: function() {
            var source = this.props.source;
            $.get('http://zend_test/main/index/'+source, function(result) {
                this.setState({items: result});
            }.bind(this));
    },
    whenListItemsClick: function(id){
            //somehow call MainScreen width cur id
        //this.props.itemclick(id);
        //??? does this really need?
        console.log(' whenListItemsClick');
    },
    whenListItemsAction: function(action){
        /* 2do
        *  action 2 ajax
        * */

        //console.warn('whenListItemsCpAction'+ action['action']+' k='+action['id']);


        //$.get('http://zend_test/main/index/no', function(result){
        $.get('http://zend_test/main/index/yes', function(result){
            if(result['response'] == true){
                alert('Success');
            }else{
                alert('Error');
            }
        });
    },
    render: function(){
        var items_arr = this.state.items;
        var output =[];

        for(var item in items_arr){
            console.log(items_arr[position]);
           output.push(<ListItems item={items_arr[item]} key={items_arr[item].id} itemaction={this.whenListItemsAction} itemdisplay={this.whenListItemsClick} />);
        }

        return(
            <div className="MainList">{output}</div>
        )
    }
});

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
        var render_entities = [];
        var screens_arr = this.state.entities;
        var screen_name = this.state.screen_name;

        var entities_arr=screens_arr[screen_name];
        for(var key in entities_arr){
            //console.info('entities_arr[key]='+entities_arr[key]+ ' (key='+key+') {entities_arr='+entities_arr+'}');
            render_entities.push(<EntityBlock entity_name={entities_arr[key]} key={key} />)
        }

        return(<div>{render_entities}</div>)
    }
});


var CatScreen = React. createClass({
    whenReaction: function(screen){

    },
    render: function(){
        var cat = this.props.cat;
        var source = './react/get/cat/'+cat;
        return(
            <div className="well"><CatTreeLinksList source={source} childs={null} reaction={this.whenReaction }/></div>
        );
    }
});



React.renderComponent(
    <CatScreen cat="base"/>,
    document.getElementById('left_panel')
);


/*
React.renderComponent(
    <BaseScreen screen_name='rank' />,
    document.getElementById('main_window')
);
*/