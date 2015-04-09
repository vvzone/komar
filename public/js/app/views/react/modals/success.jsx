/** @jsx React.DOM */

define(
    'views/react/modals/success',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'jsx!views/react/timer',
        'event_bus'
    ],function($, _, Backbone, React, BootstrapModalMixin, Timer, EventBus){

        var ModalWindowSuccess = React.createClass({
            mixins: [BootstrapModalMixin],
            getInitialState: function() {
                return {
                    stop_timer: false
                };
            },
            componentDidMount: function() {
                this.show();
                _.extend($(this.getDOMNode()), Backbone.Events);
            },
            cancelTimer: function(){
                console.log('cancelTimer!');
                this.setState({
                    stop_timer: true
                });
            },
            componentWillUnmount: function(){
                console.warn('Unmounting React SUCCESS window');
            },
            hideByTimer: function(){
                console.log('hide by timer');
                this.hide();
            },
            hideParent: function(){
                /*
                var last_window = $('.modal_window').filter(function(index){
                    return $('.modal_window', this).length-2;
                })[0];
                console.info('last_window');
                console.info(last_window);
                */

                this.hide();
                //$('.modal-backdrop').filter(':last').remove();
                //last_window.trigger('windows-close');
            },
            render: function () {
                return(
                    <div className="modal fade" onClick={this.cancelTimer}>
                        <div className="modal-dialog">
                            <div className="modal-content alert-success">
                                    {this.getWindowTop()}
                                    {this.getMainMsg()}
                                    {this.getResponseMsg()}
                                <div className="modal-footer">
                                    {this.getWindowButtons()}
                                </div>
                            </div>
                        </div>
                    </div>
                    );
            },
            getWindowTop: function(){
                return <div className="modal-header">
                            <span className="glyphicon glyphicon-ok-sign" onClick={this.hideParent}></span>
                            {this.renderCloseButton()}
                       </div>;
            },
            getMainMsg: function(){
                return <div className="modal-body">
                            {this.getHeader()}
                            {this.getMsg()}
                        </div>;
            },
            getMsg: function(){
                if(this.props.msg){
                    return  <div className="msg">{this.props.msg}</div>;
                }
                return null;
            },
            getHeader: function(){
                if(this.props.header){
                    if(this.props.header.length>0){
                        return <div className="header"><strong>{this.props.header}</strong></div>;
                    }
                }
                return null;
            },
            getResponseMsg: function(){
                if(this.props.response){
                    return <div className="modal-body">Ответ сервера: {this.props.response}</div>;
                }
                return null;
            },
            getWindowButtons: function(){
                return <button type="button" className={'btn btn-default'} onClick={this.hideParent} key="default">
                        Закрыть <Timer timer="3" stop_timer={this.state.stop_timer} callback={this.hideByTimer} />
                       </button>;
            }
        });

        return ModalWindowSuccess;
    }
);

