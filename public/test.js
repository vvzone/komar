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

var test_screen = [];
test_screen[0] = 'test_entity';
test_screen[1] = 'child_test1';
test_screen[2] = 'child_test2';

var sys = [];
sys[0] = 'rank';
sys[1] = 'position';
sys[2] = 'rank_position';

var screen_entities = {};

screen_entities['test_screen'] = test_screen;
screen_entities['sys'] = sys;


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

var FormEntTest = React. createClass({
    render: function(){
        return(<input type="text" size="40" id="test" value="test" />)
    }
});

var FormEntTestChild1 = React. createClass({
    render: function(){
        return(<input type="text" size="20" id="child1"/>)
    }
});

var FormEntTestChild2 = React. createClass({
    render: function(){
        return(<input type="text" size="5" id="child2"/>)
    }
});

var CatScreenEntity = React. createClass({
    render: function(){
        var class_name = this.props.entity_name;
        console.info(class_name);
        switch(class_name) {
             case 'child_test1':
                 return(<FormEntTestChild1 />)
                 break;
             case 'child_test2':
                 return(<FormEntTestChild2 />)
                 break;

        };
        return(<div>&nbsp;</div>)
    }
});

var CatScreenWindow = React. createClass({
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
            render_entities.push(<CatScreenEntity entity_name={entities_arr[key]} key={key} />)
        }

        return(<div>{render_entities}</div>)
    }
});


var CatScreen = React. createClass({
    render: function(){
        var cat = this.props.cat;
        var source = './react/get/cat/'+cat;
        return(
                <CatScreenLinksList source={source} childs={null}/>
        );
    }
});


React.renderComponent(
    <CatScreen cat="base"/>,
    document.getElementById('left_panel')
);

React.renderComponent(
    <CatScreenWindow screen_name='test_screen' />,
    document.getElementById('main_window')
);
