
define(
    'views/react/controls/main_list',
    [
        'jquery',
        'react',
        'jsx!views/react/search'
    ],function($, React, InstantSearch){

var ListItem = React.createClass({
    /*
     * <ListItem item=[] key='' action={this.whenListItemsAction} />
     * props:
     * item = []; required: 'name', 'id'
     * key - unique;
     * */
    getInitialState: function() {
        return {
            item: [],
            item_dependencies: [],
            open: false
        }
    },
    whenClicked: function(){
        this.setState({open: this.state.open==true? false: true});
    },
    componentWillMount: function() {
        this.setState({item: this.props.item});
    },
    whenClickedCP: function(action){
        if(action){
            var customEvent = new CustomEvent("modalWindowOpen",  {
                detail: {
                    action: action,
                    source: this.props.source,
                    entity: this.props.entity.entity_name,
                    item: this.state.item,
                    current_id: this.props.item.id
                },
                bubbles: true
            });
            this.getDOMNode().dispatchEvent(customEvent);
        }
    },
    render: function(){
        var delete_key= 'delete/'+this.props.item.id;
        var edit_key= 'edit/'+this.props.item.id;

        var item_additional_info = [];
        var editable = this.props.prototype.editable_properties;

        if(this.state.open == true){
            var self=this;

            for(var prop in this.state.item){ // onClick output short info
                if(editable[prop]){
                    item_additional_info.push(
                        <div>{editable[prop]}:{this.state.item[prop]}</div>
                    )
                }
            }
        }

        var edit_properties_box = [];
        var items = this.state.item;

        return(
            <div className="item">
                <div className="item_name"><ItemLink item={this.props.item} onClick={this.whenClicked} /></div>
                <div className="item_cp">
                    <ButtonEdit clicked={this.whenClickedCP} id={this.props.item.id} key={edit_key} mini={this.props.non_base}/>
                    <ButtonDelete clicked={this.whenClickedCP} id={this.props.item.id} key={delete_key} mini={this.props.non_base}/>
                </div>
                {item_additional_info}
                {edit_properties_box}
            </div>
            )
    }
});


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
        console.error('this.props');
        console.log('this.props');
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
            console.info('this.props.entity');
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

    /*return MainList;*/
        return MainList;
/* </require-js> */
    }
);