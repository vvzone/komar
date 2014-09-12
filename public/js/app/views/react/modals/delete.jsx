/** @jsx React.DOM */

define(
    'views/react/modals/delete',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/base',
        'jsx!views/react/modals/delete_confirmation',
        'event_bus'
    ],function($, React, ModalWindowBase, ModalWindowDeleteConfirmation, EventBus){

        var ModalWindowDelete = React.createClass({
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
            throwDelete: function(){

            },
            componentDidMount: function () {
                var self = this;
                EventBus.on('windows-close', function(){
                    console.log('windows-close catch');
                    self.refs.modal.hide();
                });
            },
            render: function(){
                var buttons = [
                    {type: 'success', text: 'Удалить', handler: this.throwDelete},
                    {type: 'default', text: 'Отмена', handler: this.handleExternalHide}
                ];
                var header = "Вы уверены?"; //+this.entity.name;

                console.log('Delete');
                console.log(this.props);

                var msg = "Будет удален обьект «" +  this.props.item.name + "»";
                if(this.props.item.childNodes){
                    var childs = '';
                    /*var childNodes = this.props.item.childNodes;
                     console.log('this.props.item.childNodes');
                     console.log(this.props.item.childNodes);
                     for(var key in childNodes){

                     childs = childs + childNodes[key].name +', ';
                     }*/
                    //msg = msg + 'Следующие дочерние обьекты будут удалены: '+childs;
                    msg = msg + ', а также все дочерние обьекты.';
                }else{
                    msg = msg + '.'
                }

                return(
                    /* Entity */
                    // 2 do: BaseWindow,
                    // entity form refactoring
                    <ModalWindowDeleteConfirmation
                    ref="modal"
                    show={false}
                    header={header}
                    buttons={buttons}
                    msg={msg}
                    >
                    </ModalWindowDeleteConfirmation>
                    );
            }
        });

        return ModalWindowDelete;
    }
);