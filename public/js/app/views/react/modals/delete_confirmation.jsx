/** @jsx React.DOM */

define(
    'views/react/modals/delete_confirmation',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'event_bus'
    ],function($, React, BootstrapModalMixin, EventBus){

        var ModalWindowDeleteConfirmation = React.createClass({
                mixins: [BootstrapModalMixin],
                getInitialState: function() {
                    return {
                        stop_timer: false
                    };
                },
                componentDidMount: function() {
                    this.show();
                    var self = this;
                    EventBus.on('windows-close', function(){
                        console.log('windows-close catch');
                        self.hide();
                    });
                },
                throwDelete: function(){
                    console.log('throwDelete');
                    var self = this;
                    this.props.model.destroy({
                        wait: true,
                        success: function(){
                            var name = self.props.model.attributes['name'];
                            self.hide();
                            EventBus.trigger('success', 'Обьект «'+name+'» удален.');
                        },
                        error:
                            function(model, response) {
                                self.setState({
                                    action_error: {
                                        response: response,
                                        model: model
                                    }
                                });
                            }
                    });
                },
                render: function () {
                    var buttons_props = [
                        {type: 'danger', text: 'Удалить', handler: this.throwDelete},
                        {type: 'default', text: 'Отмена', handler: this.hide}
                    ];

                    var buttons = buttons_props.map(function (button) {
                        return (
                            <button type="button" className={'btn btn-' + button.type} onClick={button.handler} key={button.type}>
                    {button.text}
                            </button>
                            );
                    });


                    var msg ='';
                    var header_text = 'Обьект «'+this.props.model.attributes['name']+'» будет безвозвратно удален.';
                    var header = <div className="header"><strong>{header_text}</strong></div>;

                    var top = <div className="modal-header">
                        <span className="glyphicon glyphicon-exclamation-sign" onClick={this.hide}></span>
                                    {this.renderCloseButton()}
                    </div>;

                    if(this.props.header){
                        if(this.props.header.length>0){
                            header= <div className="header"><strong>«{this.props.header}»</strong></div>;
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
                                <div className="modal-content alert-error">
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
