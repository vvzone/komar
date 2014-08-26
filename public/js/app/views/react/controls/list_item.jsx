define(
    'views/react/controls/list_item',
    [
        'jquery',
        'react',
        'jsx!views/react/search',
        'jsx!views/react/base/btn_add',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete',
        'models/rank'
    ],function($, React, InstantSearch, ButtonAdd, ButtonEdit, ButtonDelete, Rank){

        var MainList = React.createClass({
            componentWillMount: function(){
                //2-do: search
                console.log('MainList WillMount');
            },
            actionHandle: function(action){
                if(action == 'delete'){
                    //console.log('MainList -> delete -> id = '+this.state.model.get('id'));
                    //this.state.model.destroy;
                }
            },
            render: function(){
                var collection = this.props.collection;
                var items = collection.map(function(model){
                    console.log('MainList -> collection.map, model:');
                    console.log(model);

                    return <ListItem model={model} />
                });
                return(
                    <ul>{items}</ul>
                    );
            }
        });

        var ListItem = React.createClass({
            getInitialState: function(){
                return {
                    open: false
                }
            },
            whenClicked: function(){
                this.setState({open: this.state.open==true? false: true});
            },
            componentWillMount: function(){
                console.log('ListItem WillMount, model:');
                console.log(this.props.model);
                //this.setState({model: this.props.model});
            },
            whenClickedCP: function(action){
                console.log('whenClickedCP, action -'+action);
                if(action){
                    //this.props.action(action);
                    if(action == 'delete'){
                        console.log('ListItem -> delete -> id = '+this.props.model.get('id'));
                        //var thisInCollection = this.state.model.collection.get(this.state.model.get('id'));
                        //thisInCollection.remove();
                        this.props.model.destroy();
                    }
                }
            },
            render: function(){
                console.log('ListItem render, item');
                console.log(this.props.model);

                var editable = this.props.model.attr_rus_names;

                var editable_controls = [];
                if(this.state.open == true){
                    for(var attr in editable){
                        editable_controls.push(
                            <div className="Edit_Form">
                                <div className="control_name">{editable[attr]}</div>
                                <div className="control">{this.props.model.get(attr)}</div>
                            </div>
                        );
                    }
                }

                var edit_form = <div className="EditItemForm">{editable_controls}</div>;
                return(
                    <div className="item" key={'item'+this.props.model.get('id')}>
                        <div className="item_name" clicked={this.whenClicked}>{this.props.model.get('name')}</div>
                        <div className="item_cp">
                            <ButtonEdit clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'edit' +this.props.model.get('id')} mini="false" />
                            <ButtonDelete clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'delete'+this.props.model.get('id')} mini="false" />
                        </div>
                    {edit_form}
                    </div>
                );
            }
        });
        return MainList;
    }
);
