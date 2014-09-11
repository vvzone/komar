/** @jsx React.DOM */

define(
    'views/react/modals/success',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'jsx!views/react/timer'
    ],function($, React, BootstrapModalMixin, Timer){

        var ModalWindowSuccess = React.createClass({
            mixins: [BootstrapModalMixin],
            getInitialState: function() {
                return {
                    stop_timer: false
                };
            },
            componentDidMount: function() {
                this.show();
            },
            cancelTimer: function(){
                console.log('cancelTimer!');
                this.setState({
                    stop_timer: true
                });
            },
            callback: function(){
                console.log('callback catch');
                this.hide();
            },
            render: function () {
                var buttons =
                        <button type="button" className={'btn btn-default'} onClick={this.hide} key="default">
                            Закрыть {this.state.timer} <Timer timer="3" stop_timer={this.state.stop_timer} callback={this.callback} />
                        </button>;


                var msg ='';
                var header = '';

                if(this.props.header){
                    if(this.props.header.length>0){
                        header = <div className="modal-header">
                                    {this.renderCloseButton()}
                                    <strong>{this.props.header}</strong>
                                 </div>;
                    }
                }

                if(this.props.msg){
                    msg = <div className="modal-body"><strong>
                     {this.props.msg}
                    </strong></div>;
                }
                var response = '';
                if(this.props.response){
                    response = <div className="modal-body">Ответ сервера: {this.props.response}</div>;
                }
                return(
                    <div className="modal fade" onClick={this.cancelTimer}>
                        <div className="modal-dialog">
                            <div className="modal-content alert-success">
                                    {header}
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

        return ModalWindowSuccess;
    }
);

