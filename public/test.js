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
            links: '',
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

        //console.log(links);
        links.forEach(function(link){
            //console.info(link);
            links_output.push(<CatLink screen ={link} key={link.id} />)
        });
        return(
            <ol>{links_output}</ol>
        );
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
    document.getElementById('content')
);

