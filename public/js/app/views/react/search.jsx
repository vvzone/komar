/** @jsx React.DOM */

define(
    //'views/react/controls/main_list',
    'views/react/search',
    [
        'jquery',
        'react',
        'config'
    ],function($, React, Config){

        var SearchBox = React.createClass({
            doSearch:function(){
                var query=this.refs.searchInput.getDOMNode().value; // this is the search text
                this.props.startSearch(query);
            },
            render: function(){
                return(
                    <div className="search"><input type="text" ref="searchInput" placeholder="Поиск" value={this.props.query} onChange={this.doSearch} /></div>
                )
            }
        });

        var InstantSearch = React.createClass({
            startSearch: function(query){
                console.info(['SearchBox', this.props]);

                var search_url= this.props.source+'?search='+query; //
                console.info(['search_url', search_url]);

                $.ajax({
                    type: "GET",
                    url: search_url,
                    //data: query,
                    success: function(data) {
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
                console.info(['SearchBox', this.props]);
                //startSearch={this.startSearch}
                return(<SearchBox startSearch={this.startSearch} />)
            }
        });

        return InstantSearch;
    }
);


