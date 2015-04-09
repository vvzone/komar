/** @jsx React.DOM */

define(
    'views/react/modals/edit',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'config',
        'jsx!views/react/modals/base',
        'jsx!views/react/item_edit/generate_form',
        'event_bus'
    ],function($, _, Backbone, React, Config, ModalWindowBase, MainItemEdit, EventBus){

        var debug = (Config['debug'] && Config['debug']['debug_modals'])? 1:null;

        var ModalWindowEdit = React.createClass({
            getInitialState: function() {
                return {
                    var: ''
                };
            },
            handleShowModal: function () {
                this.refs.modal.show();
            },
            handleExternalHide: function () {
                this.refs.modal.hide();
            },
            throwSave: function(){
                (debug)?console.log('modal -> throwSave'):null;
                var customEvent = new CustomEvent("saveButtonClick",  {
                    detail: {id: this.props.current_id},
                    bubbles: true
                });

                (debug)?console.log('dom node:'):null;
                var element = $(this.refs.item_edit.getDOMNode())[0]; //call for ItemEdit not MainItemEdit
                (debug)?console.log(element):null;

                element.trigger('saveButtonClick', customEvent);
                //this.refs.modal.hide();
            },
            componentDidMount: function () {
                var self = this;
                var this_node = $(self.getDOMNode()).parent()[0];
                _.extend(this_node, Backbone.Events);

                if(debug){
                    console.info('this->mount, this_node for windows-close:');
                    console.info(this_node);
                }

                /*
                this_node.on('windows-close', function(){
                    console.info('windows-close catch by window-EDIT');
                    console.info('this_node');
                    console.info(this_node);
                    //this.refs.modal.hide();

                    React.unmountComponentAtNode($(self.getDOMNode()).parent().children('.modal_window')[0]);
                    self.refs.modal.hide();
                }, self);
                */
            },
            callback: function(action){
                if(debug){
                    console.info('Modal Edit Window callback from MaiItemEdit..., action:');
                    console.info(action);
                }
                if(action == 'save'){
                    this.refs.modal.hide();
                }
            },
            render: function(){
                var buttons = [
                    {type: 'success', text: 'Сохранить', handler: this.throwSave}
                ];
                var obj_name = '';
                (this.props.model.get('name'))? obj_name =this.props.model.get('name'): obj_name='Новая запись';
                var header = <div>{this.props.model.model_rus_name} / {obj_name}</div>;
                return(
                        <ModalWindowBase ref="modal"
                        show={false}
                        header={header}
                        buttons={buttons} >
                            <MainItemEdit ref="item_edit" model={this.props.model} callback={this.callback} />
                        </ModalWindowBase>
                    );

            }
        });

        return ModalWindowEdit;
    }
);
