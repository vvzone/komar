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

        var UserBar = React.createClass({
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
                        <div id="user_bar">
                            <div id="user_bar_username">Вы вошли как: {app_registry.auth.login}&nbsp;[<a href="#logout" onClick={this.sendLogOut}>Выйти</a>]</div>
                        </div>
                    </div>
                );
            }
        });

        var UserBarComponent = React.createClass({
            getInitialState: function(){
                return {
                    is_logged: false
                };
            },
            componentWillMount: function(){
                (debug)?console.info('UserBarComponent -> WillMount'):null;
              this.setState({
                  is_logged: this.props.is_logged
              });
            },
            logOut: function(msg){
                this.setState({
                    is_logged: false
                });
            },
            render: function(){
                var is_logged = false;
                (debug)?console.info(['app_registry.auth.login', app_registry.auth.login]):null;
                if(app_registry.auth.login != null &&  $('meta[name="csrf-token"]').attr('content') != ''){
                    is_logged = true;
                }
                if($('meta[name="csrf-token"]').attr('content') != ''){
                    console.info('csrf-token changed');
                }

                var output = <div>not logged...</div>;
                if(is_logged == true){
                    output = <UserBar callback={this.logOut} />;
                }
                return(
                    output
                );
            }
        });

        //return UserBarComponent;

        var initialize = function(){
            (debug)?console.info('user bar initialization...'):null;

            app_registry.user_bar = React.renderComponent(
                new UserBarComponent,
                document.getElementById("header_login")
            );
        };

        return {
            initialize: initialize
        };
    }
);


/*
 <video autoPlay poster="/img/test_bg.jpg" id="bgvid" loop>
 <source src="/img/test.mp4" type="video/mp4" />
 </video>
 */