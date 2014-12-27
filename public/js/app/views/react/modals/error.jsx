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
                    var response = this.props.response;
                    var response_msg = response.status+" — "+response.statusText;
                    if(response_msg == null){
                        response_msg = response;
                    }

                    response = <div className="server-log">Ответ сервера: {response_msg}</div>;
                }

                var header ='';
                if(this.props.header){
                    if(this.props.header.length>0){
                        if(this.props.response.status){
                            var code = this.props.response.status;
                            header= <div className="header"><strong>{this.props.header} {code}</strong></div>;
                        }else{
                            header= <div className="header"><strong>{this.props.header}</strong></div>;
                        }
                    }
                }else{
                    if(this.props.response.status){
                        var code = this.props.response.status;
                        header= <div className="header"><strong>Ошибка {code}</strong></div>;
                    }else{
                        header= <div className="header"><strong>Ошибка</strong></div>;
                    }
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

