
define(
    'views/react/controls/main_list',
    [
        'jquery',
        'react',
        'jsx!views/react/search',
        'jsx!views/react/controls/list_item',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete',
        'models/rank'
    ],function($, React, InstantSearch, ButtonAdd, ButtonEdit, ButtonDelete, Rank){

var MainList = React. createClass({
    /* Props
     *
     * source - server data-controller action (entity)
     * entity.host.id - id or other value for search dependency
     * entity.db_prop_name - name of pole for search
     *
     * 2 do: add-interface, msg for 0 results
     * */
    getInitialState: function() {
        return {
            items: []
        }
    },
    componentDidMount: function() {
        var url = '';
        console.info('MainList, mount, this.props');
        console.log(this.props);
        if(this.props.entity.host){
            var pole_name = 'id';
            if(this.props.entity.db_prop_name){
                pole_name = this.props.entity.db_prop_name;
            }
            url = 'http://zend_test/main/'
                + this.props.source
                +'/search/'
                + pole_name+'/'
                + this.props.entity.host.id;
        }else{
            url = 'http://zend_test/main/'+this.props.source;
        }

        $.get(url, function(response) {
                this.setState({items: response});
            }.bind(this))
            .error(function() {
                alert("Network Error.");
            });
    },
    searchReceived: function(results){
        // exchange arrays
        this.setState({items: results});
    },
    whenClickedCP: function(action){
        if(action){
            console.info('MainList, whenClickedCP, this.props.entity');
            console.info(this.props.entity);
            var customEvent = new CustomEvent("modalWindowOpen",  {
                detail: {
                    action: action,
                    source: this.props.source,
                    entity: this.props.entity.entity_name// check this!
                    /*item: this.state.item, // undefined
                    current_id: this.props.item.id //undefined*/
                },
                bubbles: true
            });
            this.getDOMNode().dispatchEvent(customEvent);
        }
    },
    render: function () {
        var output = [];
        var self = this;

        console.log('this.state.items.data');
        console.log(this.state.items.data);
        for (var item in this.state.items.data) {
            output.push(
                <ListItem
                    source={this.props.source}
                    item={this.state.items.data[item]}
                    prototype={this.state.items.prototype}
                    key={this.state.items.data[item].id}
                    entity={this.props.entity}
                    dependencies={this.props.dependencies}
                />);
            console.log('item key='+this.state.items.data[item].id+"\n");
        }

        return(
            <div className="List">
                <div className="ListHeader">
                    <div className="InstantSeacrh">
                        <InstantSearch key="instant_search" source={this.props.source} searchReceived={this.searchReceived}/>
                    </div>
                    <div className="ButtonAdd">
                        <ButtonAdd key="button_add" clicked={self.whenClickedCP} />
                    </div>;
                </div>
                <div className="MainList">{output}</div>
            </div>
            )
    }
});

        var init = function(test){
            console.info('AUG TEST');
            //React.renderComponent(<MainList entity={collection}/>, document.getElementById("main_container"));
        };

        return MainList;
    /*return MainList;*/

        /*return MainList;*/
/* </require-js> */
    }
);