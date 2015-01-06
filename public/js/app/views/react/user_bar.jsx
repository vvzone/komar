/** @jsx React.DOM */

define(
    'views/react/user_bar',
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
            callback: function(){
                this.props.callback('success');
            },
            sendLogOut: function(event){
                event.preventDefault();
                (debug)?console.info(event):null;


                if(app_registry.auth.token == null){
                    //trigger ERROR
                }

                var data = {
                    token: app_registry.auth.token
                };

                var self = this;
                var token = '';
                $.ajax({
                    url: '/admin/login',
                    type:'POST',
                    data: data,
                    headers: {
                        Authorization: 'TOKEN '+app_registry.auth.token
                    },
                    success:function (data) {
                        (debug)?console.log(["Logout request details: ", data]):null;
                        $('meta[name="csrf-token"]').attr('content', '');
                        $.ajaxSetup({
                            headers: { 'Authorization': null},
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader('Authorization', null);
                            }
                        });
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
                        <div className="login_bar">
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

        var UserBarComponent = React.createClass({
            getInitialState: function(){

                if(app_registry.auth.login != null &&  $('meta[name="csrf-token"]').attr('content') != ''){
                    return {
                        is_logged: true
                    };
                }
                return {
                    is_logged: false
                };
            },
            logOut: function(msg){
                this.setState({
                    is_logged: false
                });
            },
            render: function(){
                var output = <UserBar callback={this.logOut} />;
                if(this.state.is_logged == true){
                    output = <div>Congrat!</div>;
                }
                return(
                    output
                );
            }
        });

        return UserBarComponent;
    }
);


/*
 <video autoPlay poster="/img/test_bg.jpg" id="bgvid" loop>
 <source src="/img/test.mp4" type="video/mp4" />
 </video>
 */