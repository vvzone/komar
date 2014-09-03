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
                    msg = <div className="modal-body">
                     {this.props.msg}
                    </div>;
                }
                var response = '';
                if(this.props.response){
                    response = <div className="modal-body">Ответ сервера: {this.props.response}</div>;
                }
                return(
                    <div className="modal fade">
                        <div className="modal-dialog">
                            <div className="modal-content alert-warning">
                                <div className="modal-header">
                             {this.renderCloseButton()}
                                    <strong>{this.props.header}</strong>
                                </div>
                                    {msg}
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

