/** @jsx React.DOM */

define(
    'views/react/timer',
    [
        'jquery',
        'react'
    ],function($, React){

        var Timer = React.createClass({
            getInitialState: function() {
                return {
                    secondsElapsed: 5,
                    stop_timer: false
                };
            },
            componentDidMount: function() {
                console.log('this.props.timer-'+this.props.timer);
                if(this.props.timer){
                    this.setState({
                        secondsElapsed: this.props.timer
                    });
                }
                this.interval = setInterval(this.tick, 1000);
            },
            componentWillReceiveProps: function(){
                clearInterval(this.interval);
                this.setState({
                    secondsElapsed: 0,
                    stop_timer: true
                });
            },
            tick: function() {
                if(this.state.secondsElapsed>1){
                    this.setState({secondsElapsed: this.state.secondsElapsed - 1});
                }else{
                    this.props.callback('timer!');
                }
            },
            componentWillUnmount: function() {
                clearInterval(this.interval);
            },
            render: function () {
                var remaining = '';
                if(this.state.secondsElapsed>0){
                    remaining = this.state.secondsElapsed + ' сек.';
                }
                return(
                    <div className="timer_box">{remaining}</div>
                );
            }
        });

        return Timer;
    }
);