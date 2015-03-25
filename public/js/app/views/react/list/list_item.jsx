define(
    'views/react/list/list_item',
    [
        'jquery',
        'react',
        'config',
        'jsx!views/react/base/btn_edit',
        'jsx!views/react/base/btn_delete',
        'event_bus'
    ],function($, React, Config,  ButtonEdit, ButtonDelete, EventBus){

        var debug = (Config['debug'] && Config['debug']['debug_list_item'])? 1:null;
        console.log('module views/react/controls/list_item loaded');

        var ListItem = React.createClass({
            getInitialState: function(){
                return {
                    open: false,
                    edited: false,
                    action_error: null
                }
            },
            whenClicked: function(){
                this.setState({open: this.state.open==true? false: true});
            },
            whenClickedCP: function(action){
                (debug)?console.log('whenClickedCP, action -'+action):null;
                if(action){
                    if(action == 'delete'){
                        EventBus.trigger('item-delete', this.props.model);
                    }

                    if(action == 'edit'){
                        EventBus.trigger('item-edit', this.props.model);
                    }
                }
            },
            getItemName: function(){
                if(this.props.model.list_output){
                    var field = this.props.model.list_output.name;
                    var name = this.props.model.get(field);
                    var max_limit = Config['component_list']['max_name_length'];
                    if(name.length> max_limit){
                        name = name.substr(0, max_limit)+'...';
                    }
                    return name;
                }
                return this.props.model.get('name');
            },
            render: function(){
                var editable = this.props.model.get('attr_rus_names');
                var editable_controls = [];
                if(this.state.edited == true){
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

                var error_box = '';
                if(this.state.action_error){
                    EventBus.trigger('error', 'Ошибка', this.state.action_error.response);
                }
                return(
                    <li className="item" key={'item'+this.props.model.get('id')}>
                        <div className="item_name" clicked={this.whenClicked}>{this.getItemName()}</div>
                        <div className="item_cp">
                            <ButtonEdit clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'edit' +this.props.model.get('id')} mini="false" />
                            <ButtonDelete clicked={this.whenClickedCP} id={this.props.model.get('id')} key={'delete'+this.props.model.get('id')} mini="false" />
                        </div>
                    {error_box}
                    {edit_form}
                    </li>
                    );
            }
        });

        return ListItem;
    }
);