/** @jsx React.DOM */

define(
    'views/react/modals/add',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/base'
    ],function($, React, ModalWindowBase){

        var ModalWindowAdd = React.createClass({
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
            render: function(){
                var buttons = [
                    {type: 'success', text: 'Добавить', handler: this.handleDoingNothing}
                    //,{type: 'danger', text: 'Отмена', handler: this.handleExternalHide}
                ];
                var header = "Новая запись в "; //+this.entity.name;

                var content = <EntityBlock entity_name={this.props.entity} item={this.props.current_id} />; //очень плохое решение с передачей в виде отдельных свойств
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
            {content}
                    </ModalWindowBase>
                    );

            }
        });

        return ModalWindowAdd;

    }
);
