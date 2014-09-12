/** @jsx React.DOM */

define(
    'views/react/modals/error',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin'
    ],function($, React, BootstrapModalMixin){

        var ModalWindowError = React.createClass({
            mixins: [BootstrapModalMixin],
            componentDidMount: function() {
                this.show();
            },
            render: function () {
                var buttons =
                        <button type="button" className={'btn btn-default'} onClick={this.hide} key="default">
                            Закрыть
                        </button>;

                var msg ='';
                if(this.props.msg){
                    msg = <div className="msg">{this.props.msg}</div>;
                }
                var response = '';
                if(this.props.response){
                    response = <div className="server-log">Ответ сервера: {this.props.response}</div>;
                }

                var header ='';
                if(this.props.header){
                    if(this.props.header.length>0){
                        header= <div className="header"><strong>{this.props.header}</strong></div>;
                    }
                }else{
                    header= <div className="header"><strong>Ошибка</strong></div>;
                }

                var main_msg = <div className="modal-body">
                {header}
                {msg}</div>;

                return(
                    <div className="modal fade">
                        <div className="modal-dialog">
                            <div className="modal-content alert-error">
                                <div className="modal-header">
                                    <span className="glyphicon glyphicon-exclamation-sign" onClick={this.hide}></span>
                                    {this.renderCloseButton()}
                                    <strong></strong>
                                </div>
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

        return ModalWindowError;
    }
);

