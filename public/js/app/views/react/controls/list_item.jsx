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
                this.setState({model: this.props.model});
            },
            whenClickedCP: function(action){
                console.log('whenClickedCP, action -'+action);
                /*if(action){
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
                }*/
            },
            render: function(){
                console.log('ListItem render, item');
                console.log(this.state.model);

                var editable = this.state.model.attr_rus_names;
                /*var delete_key= 'delete/'+this.props.item.id;
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
                    )*/
                //var self = this;
                var editable_controls = [];
                if(this.state.open == true){
                    for(var attr in editable){
                        editable_controls.push(
                            <div className="Edit_Form">
                                <div className="control_name">{editable[attr]}</div>
                                <div className="control">{this.state.model.get(attr)}</div>
                            </div>
                        );
                    }
                }

                var edit_form = <div className="EditItemForm">{editable_controls}</div>;
                return(
                    <div className="item" key={'item'+this.state.model.get('id')}>
                        <div className="item_name">{this.state.model.get('name')}</div>
                        <div className="item_cp">
                            <ButtonEdit clicked={this.whenClickedCP} id={this.state.model.get('id')} key={'edit' +this.props.model.get('id')} mini="false" />
                            <ButtonDelete clicked={this.whenClickedCP} id={this.state.model.get('id')} key={'delete'+this.props.model.get('id')} mini="false" />
                        </div>
                    {edit_form}
                    </div>
                );
            }
        });
        return ListItem;
    }
);
