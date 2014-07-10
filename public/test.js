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
sys[0] = 'country';
sys[1] = 'sys1';
sys[2] = 'sys2';

var rank = [];
rank[0] = 'rank';

var position = [];
position[0] = 'position';
position[1] = 'rank_position';

var screen_entities = {};

screen_entities['test_screen'] = test_screen;
screen_entities['sys'] = sys;
screen_entities['rank'] = rank;
screen_entities['position'] = position;


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
                    <li><CatTreeLinksList source={null} childs={link.childNodes}/></li>
                );
        }else{
            return(
                    <li><a href={src}>{link.name}</a></li>
                );
        }
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

var ButtonEdit = React.createClass({
    handleClick: function (e) {
        var action = 'edit';
        this.props.clicked(action);
    },
    render: function () {
        return ( <button className="ButtonEdit" type="button" onClick={this.handleClick}>Edit</button> );
    }
 });

var ButtonDelete = React.createClass({
    handleClick: function (e) {
        var action = 'delete';
        this.props.clicked(action);
    },
    render: function () {
        return ( <button className="ButtonDelete" type="button" onClick={this.handleClick}>Delete</button> );
    }
});s

var ListItems = React.createClass({
   /*
   * <ListItem item=[] key='' action={this.whenListItemsAction} />
   * props:
   * item = []; required: 'name', 'id'
   * key - unique;
   * */
    z
     whenClicked: function(){
         this.props.itemdisplay(this.props.item.id);
     },
     whenClickedCP: function(action){
       var itaction = [];
       itaction['action'] = action;
       itaction['id'] = this.props.item.id;
       //console.log('whenClicked'+itaction['action']+' action[id]='+ itaction['id']);
       this.props.itemaction(itaction);
   },
   render: function(){
       var delete_key= 'delete/'+this.props.item.id;
       var edit_key= 'edit/'+this.props.item.id;
       return(
           <div className="item">
               <div className="item_name"><ItemLink name={this.props.item.name} clicked={this.whenClicked} /></div>
               <div className="item_cp">
                   <ButtonEdit clicked={this.whenClickedCP} id={this.props.item.id} key={edit_key}/>
                   <ButtonDelete clicked={this.whenClickedCP} id={this.props.item.id} key={delete_key}/>
               </div>
           </div>
       )
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
    render: function(){
        var cat = this.props.cat;
        var source = './react/get/cat/'+cat;
        return(
                <CatTreeLinksList source={source} childs={null}/>
        );
    }
});


React.renderComponent(
    <CatScreen cat="base"/>,
    document.getElementById('left_panel')
);

React.renderComponent(
    <BaseScreen screen_name='rank' />,
    document.getElementById('main_window')
);
