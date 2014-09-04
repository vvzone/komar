/** @jsx React.DOM */

define(
    'views/react/modals/edit',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/base',
        'jsx!views/react/item_edit'
    ],function($, React, ModalWindowBase, MainItemEdit){

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
            render: function(){
                var buttons = [
                    {type: 'success', text: 'Сохранить', handler: this.throwSave},
                    {type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
                ];
                var header = "Редактировать "; //+this.entity.name;

                console.log('modal and current:');
                console.log(this.props.current_id);

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
                        <MainItemEdit model={this.props.model} />
                    </ModalWindowBase>
                    );

            }
        });

        return ModalWindowEdit;
    }
);
