/** @jsx React.DOM */



var SearchBox = React.createClass({
    doSearch:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.startSearch(query);
    },
    render: function(){
        return(
            <div><input type="text" ref="searchInput" placeholder="Поиск" value={this.props.query} onChange={this.doSearch} /></div>
        )
    }
});


var InstantSearch = React.createClass({
    /*getInitialState: function() {
        return {
            current_entity: '',
            items: []
        }
    },*/
    startSearch: function(query){
        $.ajax({
            type: "POST",
            url: 'http://zend_test/main/index/'+this.props.source,
            data: query,
            success: function(data) {
                        //this.setState({items: data})
                        this.props.searchReceived(data)
                     }.bind(this),
            dataType: 'json'
        });
        console.log('query='+query);
    },
    componentDidMount: function() {
        /* not screen, maybe many on one page */
        this.setState({current_entity: this.props.entity_name});
    },
    render: function(){
        //startSearch={this.startSearch}
        return(<SearchBox startSearch={this.startSearch}/>)
    }
});
