/** @jsx React.DOM */

define(
    'views/react/login',
    [
        'jquery',
        'react',
        'config',
        'app_registry'
    ],function($, React, Config, app_registry){

        var debug = (Config['debug'] && Config['debug']['debug_login'])? 1:null;

        var is_local = Config['local_server'];
        var host = (is_local)? Config['host']['local_server']:Config['host']['production_server'];
        var login_url = (is_local)? Config['login_url']['local_server']:Config['login_url']['production_server'];
        var url = host+login_url;

        (debug)? console.info('LoginForm url='+url):null;

        var LoginForm = React.createClass({
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
            sendAuth: function(event){
                event.preventDefault();
                (debug)?console.info(event):null;

                var login = $('#inputLogin').val();
                var password = $('#inputPassword').val();

                var formValues = {
                    login: login,
                    password: password
                };

                var hash_credentials = btoa(login+':'+password);
                (debug)?console.info(['base64', hash_credentials]):null;

                var self = this;
                var token = '';
                $.ajax({
                    url: '/admin/login',
                    type:'POST',
                    data: formValues,
                    headers: {
                        Authorization: 'BASE '+hash_credentials
                    },
                    success:function (data) {
                        (debug)?console.log(["Login request details: ", data]):null;

                        console.info(['data', data]);
                        token = data.result['token'];
                        $('meta[name="csrf-token"]').attr('content', 'TOKEN '+token);
                        //$('#x-auth-token').val(data[0]['token']);
                        //window.location.replace('#');
                        //setUp ajax
                        $.ajaxSetup({
                            headers: { 'Authorization': token },
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            }
                        });
                        app_registry.auth = {
                            login: login,
                            token: token
                        };
                        self.callback();
                    },
                    error: function(data){
                        (debug)?console.warn('Error received:'):null;
                        (debug)?console.warn(data):null;
                        if(data.responseJSON){
                            $('#loginMsgBox').html('<div class="alert alert-error">'+data.responseJSON[0]+'</div>');
                        }else{
                            $('#loginMsgBox').html('<div class="alert alert-error">Server error: '+data.statusText+'</div>');
                        }
                    }
                });
            },
            render: function(){
                return(
                    <div>
                        <div className="login">
                            <h1>Вход</h1>
                            <form method="post">
                                <input id="inputLogin" type="text" name="u" placeholder="Логин" required="required" />
                                <input id="inputPassword" type="password" name="p" placeholder="Пароль" required="required" />
                                <button type="submit" className="btn btn-primary btn-block btn-large" onClick={this.sendAuth}>Войти</button>
                            </form>
                            <div id="test">{app_registry.test}</div>
                            <div id="loginMsgBox"></div>
                        </div>
                    </div>
                );
            }
        });

        var LoginComponent = React.createClass({
            getInitialState: function(){
                return {
                    is_logged: false
                };
            },
            successLogin: function(msg){
                this.setState({
                    is_logged: true
                });
            },
            render: function(){
                var output = <LoginForm callback={this.successLogin} />;
                if(this.state.is_logged == true){
                    output = <div>Congrat!</div>;
                    //app_registry.test = 'Changed';
                    (debug)?console.info(['auth', app_registry.auth]):null;
                    app_registry.router.navigate('enter', true);
                    //Router.navigate('client', true);
                }
                return(
                    output
                );
            }
        });

        return LoginComponent;
    }
);


/*
 <video autoPlay poster="/img/test_bg.jpg" id="bgvid" loop>
 <source src="/img/test.mp4" type="video/mp4" />
 </video>
 */