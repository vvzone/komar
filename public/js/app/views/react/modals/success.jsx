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
                /*
                EventBus.once('windows-close', function(){
                    console.info('windows-close catch by window-SUCCESS');
                    this.hide();
                }, this);*/
            },
            cancelTimer: function(){
                console.log('cancelTimer!');
                this.setState({
                    stop_timer: true
                });
            },
            componentWillUnmount: function(){
                //console.warn('Success, unmount, throw window close');
                console.warn('Unmounting React SUCCESS window');
                //EventBus.trigger('windows-close');
            },
            callback: function(){
                console.log('modal window callback, hide');
                this.hide();
            },
            hideParent: function(){
                var last_window = $('.modal_window').filter(function(index){

                    /*var length = $('.modal_window').length;
                     var previous_window_index = length-2; //because index starts from 0
                     console.log('$(.modal_window).filter().length='+length);
                     //console.log('$(.modal_window).filter().length -1 ='+length);
                     console.log('previous_window_index = '+previous_window_index+', index:');
                     console.log(index);
                     if(index = previous_window_index){
                     return index;
                     }*/
                    return $('.modal_window', this).length-2;
                })[0];
                console.info('last_window');
                console.info(last_window);
                //this.hide;
                //$('.modal-backdrop').filter(':last').remove();
                last_window.trigger('windows-close');
            },
            render: function () {
                console.log('this.state.timer');
                console.log(this.state.timer);
                var buttons =
                        <button type="button" className={'btn btn-default'} onClick={this.hideParent} key="default">
                            Закрыть <Timer timer="3" stop_timer={this.state.stop_timer} callback={this.callback} />
                        </button>;


                var msg ='';
                var header = '';
                var top = <div className="modal-header">
                    <span className="glyphicon glyphicon-ok-sign" onClick={this.hideParent}></span>
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
                            <div className="modal-content alert-success">
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

        return ModalWindowSuccess;
    }
);

