/** @jsx React.DOM */

define(
    'views/react/modals/error',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'config'
    ],function($, React, BootstrapModalMixin, Config){

        var debug = (Config['debug'] && Config['debug']['modals'])? 1:null;

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

                    var error_msgs = [];
                    if(this.props.response.responseJSON){
                        var errors = this.props.response.responseJSON;
                        for(var error in errors){
                            var field_errors = [];
                            for(var error_field in errors[error]){
                                field_errors.push(<div>{error_field}:{errors[error][error_field]}</div>);
                            }
                            error_msgs.push(<div>{field_errors}</div>);
                        }
                        var error_description = <div>Обнаружены следующие ошибки: {field_errors}</div>;
                    }
                    (debug)?console.info(['this.props.response', this.props.response]):null;

                    response = <div className="server-log">Ответ сервера: {response_msg}{error_description}</div>;
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

