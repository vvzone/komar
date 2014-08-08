/** @jsx React.DOM */

var SearchBox = React.createClass({displayName: 'SearchBox',
    doSearch:function(){
        var query=this.refs.searchInput.getDOMNode().value; // this is the search text
        this.props.startSearch(query);
    },
    render: function(){
        return(
            React.DOM.div(null, React.DOM.input({type: "text", ref: "searchInput", placeholder: "Поиск", value: this.props.query, onChange: this.doSearch}))
            )
    }
});

var InstantSearch = React.createClass({displayName: 'InstantSearch',
    /*getInitialState: function() {
     return {
     current_entity: '',
     items: []
     }
     },*/
    startSearch: function(query){
        $.ajax({
            type: "POST",
            url: 'http://zend_test/main/'+this.props.source,
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
        return(SearchBox({startSearch: this.startSearch}))
    }
});

Array.prototype.getObjectsById = function(x){
    var catcher = [], i = 0;
    for(var i = 0; i < this.length; i++){
        if(this[i].id == value){
            catcher.push(this[i]);
        }
        i++;
    }
    return catcher.length == 1 ? catcher[0] : catcher;
}
