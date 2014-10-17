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
                var customEvent = new CustomEvent("saveButtonClick",  {
                    detail: {id: this.props.current_id},
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(customEvent);
            },
            componentDidMount: function () {
                var self = this;

                var this_node = $(this.getDOMNode());
                _.extend(this_node, Backbone.Events);
                this_node.once('windows-close', function(){
                    console.info('windows-close catch by window-EDIT');
                    self.refs.modal.hide();
                }, self);
            },
            componentWillUnmount: function(){
                console.warn('Unmounting React EDIT');
            },
            callback: function(action){
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
                    /* Entity */
                    // 2 do: BaseWindow,
                    // entity form refactoring

                    <ModalWindowBase
                    ref="modal"
                    show={false}
                    header={header}
                    buttons={buttons}
                    >
                        <MainItemEdit model={this.props.model} callback={this.callback} />
                    </ModalWindowBase>
                    );

            }
        });

        return ModalWindowEdit;
    }
);
