/** @jsx React.DOM */

    /*
    * base - Базовые определения: звания, должности, типы документов
    *   --> rank - звания
    *   --> position - должность + соотв
    *   --> pass_doc_types
    *   --> sys - основные настройки: страны, сокр. пол,
    *   --> sys_docs - основные настройки документов
    *   --> address - тип адреса
    *   --> unit_lead_types
    *   -->
    * staff - Персонал
    *   --> person - личная карточка + история званий, должностей, адрес, роль,
    *   --> pass_docs
    *   -->
    *   -->
    *   -->
    * doc - Документы
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    *   -->
    * unit - Подразделение
    *   --> client
    *   --> unit
    *   --> unit_lead
    *   -->
     *  -->
    * */

/*
var screen_entities = {
    'test_screen' : {},
    'sys': {}
}*/

var test_screen = {};
test_screen[1] = 'test_entity';
test_screen[2] = 'child_test1';
test_screen[3] = 'child_test2';

var sys = {};
sys[0] = 'rank';
sys[1] = 'position';
sys[2] = 'rank_position';

var screen_entities = {};

screen_entities[0] = test_screen;
screen_entities[1] = sys;


/*var test_rr = [
 {entity:'rank', screen:'base', name: 'Звания', id: 151},
 {entity:'rank', screen:'base', name: 'Звания', id: 153},
 {entity:'rank', screen:'base', name: 'Звания', id: 154}
 ];*/


var CatLink = React. createClass({
    render: function(){
        var link = this.props.screen;
        var src = './react/get/screen/'+link.screen;
        if(link.childNodes!=null){
            return(
                    <li><CatScreenLinksList source={null} childs={link.childNodes}/></li>
                );
        }else{
            return(
                    <li><a href={src}>{link.name}</a></li>
                );
        }
    }
});

var CatScreenLinksList = React. createClass({
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
            links_output.push(<CatLink screen ={link} key={link.id} />)
        });
        return(
            <ul>{links_output}</ul>
        );
    }
});

var CatScreenWindow = React. createClass({
    getInitialState: function() {
        return {
            entities: []
        };
    },
    componentDidMount: function() {
        var entities = [];
        this.setState(entities);
    },
    render: function(){
        /*return(
            this.state.entities.forEach(function(entity){
                entity111111
            }));*/
        return(<div>test</div>)
    }
});


var CatScreen = React. createClass({
    render: function(){
        var cat = this.props.cat;
        var source = './react/get/cat/'+cat;
        return(
                <CatScreenLinksList source={source} childs={null}/>,
                <CatScreenWindow screen='testscreen' />
        );
    }
});


React.renderComponent(
    <CatScreen cat="base"/>,
    document.getElementById('content')
);

