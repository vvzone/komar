/** @jsx React.DOM */

define(
    'views/react/logout',
    [
        'jquery',
        'react',
        'config'
    ],function($, React, Config){

        var debug = (Config['debug'] && Config['debug']['debug_login'])? 1:null;

        var is_local = Config['local_server'];
        var host = (is_local)? Config['host']['local_server']:Config['host']['production_server'];
        var login_url = (is_local)? Config['login_url']['local_server']:Config['login_url']['production_server'];
        var url = host+login_url;

        (debug)? console.info('LoginForm url='+url):null;

        var LogoutForm = React.createClass({
            componentDidMount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background = "#f3f3f3 url('/img/rls_mini.jpg') no-repeat right top";
            },
            componentWillUnmount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background ="";
            },
            callback: function(){
                this.props.callback('success');
            },
            sendLogout: function(event){
                event.preventDefault();
                (debug)?console.info(event):null;
                var formValues = {
                    login: $('#inputLogin').val(),
                    password: $('#inputPassword').val()
                };

                var self = this;
                var token = '';
                $.ajax({
                    url: '/admin/logout',
                    type:'POST',
                    data: formValues,
                    success:function (data) {
                        (debug)?console.log(["Login request details: ", data]):null;

                        token = data[0]['token'];
                        $('meta[name="csrf-token"]').attr('content', token);
                        //$('#x-auth-token').val(data[0]['token']);
                        //window.location.replace('#');
                        self.callback();
                    },
                    error: function(data){
                        (debug)?console.warn('Error received:'):null;
                        (debug)?console.warn(data):null;

                        $('meta[name="csrf-token"]').attr('content', null);
                        $('#loginMsgBox').html('<div class="alert alert-error">Неудалось корректно завершить сеанс. Локальная сессия завершена. '+data.responseJSON[0]+'</div>');
                    }
                });

                //setUp ajax
                $.ajaxSetup({
                    headers: { 'Authorization': token },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', token);
                    }
                });
            },
            render: function(){
                return(
                    <div>
                        <h1>Вы вышли из системы.</h1>
                    </div>
                );
            }
        });

        var LogoutComponent = React.createClass({
            getInitialState: function(){
                return {
                    is_logged: true
                };
            },
            successLogin: function(){
                this.setState({
                    is_logged: false
                });
            },
            render: function(){
                var output = <LogoutForm callback={this.successLogin} />;
                if(this.state.is_logged == false){
                    //;Router.navigate('client', true);
                }
                return(
                    output
                );
            }
        });

        return LogoutComponent;
    }
);


/*
 <video autoPlay poster="/img/test_bg.jpg" id="bgvid" loop>
 <source src="/img/test.mp4" type="video/mp4" />
 </video>
 */