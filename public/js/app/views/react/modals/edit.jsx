/** @jsx React.DOM */

define(
    'views/react/modals/edit',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/modals/base',
        'jsx!views/react/item_edit',
        'event_bus'
    ],function($, _, Backbone, React, ModalWindowBase, MainItemEdit, EventBus){

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
                console.info('->handleExternalHide');
                console.info(this.refs);
                this.refs.modal.hide();
                //this.hide();
            },
            throwSave: function(){
                console.log('modal -> throwSave');

                var customEvent = new CustomEvent("saveButtonClick",  {
                    detail: {id: this.props.current_id},
                    bubbles: true
                });

                console.log('dom node:');
                var element = $(this.refs.item_edit.getDOMNode()).find('.item')[0]; //call for ItemEdit not MainItemEdit
                this.refs.modal.hide();
                console.log(element);
                element.trigger('saveButtonClick', customEvent);
            },
            componentDidMount: function () {
                var self = this;

                var this_node = $(self.getDOMNode()).parent()[0];
                _.extend(this_node, Backbone.Events);
                console.info('this->mount, this_node for windows-close:');
                console.info(this_node);

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
            componentWillUnmount: function(){
                console.warn('Unmounting React EDIT');
            },
            callback: function(action){
                console.info('Modal Edit Window callback from MaiItemEdit..., action:');
                console.info(action);
                if(action == 'save'){
                    this.refs.modal.hide();
                }
            },
            render: function(){
                var buttons = [
                    {type: 'success', text: 'Сохранить', handler: this.throwSave}
                    //,{type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
                ];
                //var obj = <span className="lowercase">{this.props.model.model_rus_name} «{this.props.model.get('name')}»</span>;
                //var obj_name = this.props.model.get('name');
                var obj_name = '';
                (this.props.model.get('name'))? obj_name =this.props.model.get('name'): obj_name='Новая запись';
                var header = <div>{this.props.model.model_rus_name} / {obj_name}</div>; //+this.entity.name;

                console.log('ModalWindowEdit, this.props.model:');
                console.log(this.props.model);

                return(
                    <ModalWindowBase ref="modal"
                    show={false}
                    header={header}
                    buttons={buttons}
                    >
                        <MainItemEdit ref="item_edit" model={this.props.model} callback={this.callback} />
                    </ModalWindowBase>
                    );

            }
        });

        return ModalWindowEdit;
    }
);
