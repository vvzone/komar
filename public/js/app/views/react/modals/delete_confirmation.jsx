/** @jsx React.DOM */

define(
    'views/react/modals/delete_confirmation',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin'
    ],function($, React, BootstrapModalMixin){

        var ModalWindowDeleteConfirmation = React.createClass({
                mixins: [BootstrapModalMixin],
                getInitialState: function() {
                    return {
                        stop_timer: false
                    };
                },
                componentDidMount: function() {
                    this.show();
                },
                render: function () {
                    var buttons = [
                        {type: 'warning', text: 'Удалить', handler: this.throwDelete},
                        {type: 'default', text: 'Отмена', handler: this.handleExternalHide}
                    ];

                    var msg ='';
                    var header = '';
                    var top = <div className="modal-header">
                        <span className="glyphicon glyphicon-ok-sign" onClick={this.hide}></span>
                                    {this.renderCloseButton()}
                    </div>;

                    if(this.props.header){
                        if(this.props.header.length>0){
                            header= <div className="header"><strong>{this.props.header}</strong></div>;
                        }
                    }
                    if(this.props.msg){
                        msg = <div className="msg">{this.props.msg}</div>;
                    }
                    var main_msg = <div className="modal-body">
                {header}
                {msg}</div>;
                    var response = '';
                    if(this.props.response){
                        response = <div className="modal-body">Ответ сервера: {this.props.response}</div>;
                    }
                    return(
                        <div className="modal fade" onClick={this.cancelTimer}>
                            <div className="modal-dialog">
                                <div className="modal-content alert-warning">
                                    {top}
                                    {main_msg}
                                    {response}
                                    <div className="modal-footer">
                                    {buttons}
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
                }
            });

        return ModalWindowDeleteConfirmation;
    }
);
