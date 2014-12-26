/** @jsx React.DOM */

define(
    'views/react/login',
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


        var LoginForm = React.createClass({
            componentDidMount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background = "#f3f3f3 url('/img/rls_mini.jpg') no-repeat right top";
            },
            componentWillUnmount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background ="";
            },
            sendAuth: function(event){
                event.preventDefault();
                (debug)?console.info(event):null;
                var formValues = {
                    login: $('#inputLogin').val(),
                    password: $('#inputPassword').val()
                };

                $.ajax({
                    url: '/admin/login',
                    type:'POST',
                    data: formValues,
                    success:function (data) {
                        console.log(["Login request details: ", data]);
                        $('#x-auth-token').html(''+data[0]['token']+'');
                        //window.location.replace('#');
                    },
                    error: function(data){
                        (debug)?console.warn('Error received:'):null;
                        (debug)?console.warn(data):null;
                        $('#loginMsgBox').html('<div class="alert alert-error">'+data.responseJSON[0]+'</div>');
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
                            <div id="loginMsgBox"></div>
                        </div>
                    </div>
                );
            }
        });

        var LoginComponent = React.createClass({
            render: function(){
                return(
                  <LoginForm />
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