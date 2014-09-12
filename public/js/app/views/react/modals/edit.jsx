/** @jsx React.DOM */

define(
    'views/react/modals/edit',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/base',
        'jsx!views/react/item_edit',
        'event_bus'
    ],function($, React, ModalWindowBase, MainItemEdit, EventBus){

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
                var customEvent = new CustomEvent("saveButtonClick",  {
                    detail: {id: this.props.current_id},
                    bubbles: true
                });
                this.getDOMNode().dispatchEvent(customEvent);
            },
            componentDidMount: function () {
                var self = this;
                EventBus.on('windows-close', function(){
                    console.log('windows-close catch');
                    self.refs.modal.hide();
                });
            },
            callback: function(action){
                if(action == 'save'){
                    this.refs.modal.hide();
                }
            },
            render: function(){
                var buttons = [
                    {type: 'success', text: 'Сохранить', handler: this.throwSave},
                    {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
                ];
                var header = "Редактировать "; //+this.entity.name;

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
