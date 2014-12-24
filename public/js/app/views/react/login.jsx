/** @jsx React.DOM */

define(
    'views/react/login',
    [
        'jquery',
        'react'
    ],function($, React){

        var LoginForm = React.createClass({
            componentDidMount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background = "#f3f3f3 url('/img/rls_mini.jpg') no-repeat right top";
            },
            componentWillUnmount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background ="";
            },
            render: function(){


                return(
                    <div>
                        <div className="login">
                            <h1>Вход</h1>
                            <form method="post">
                                <input type="text" name="u" placeholder="Логин" required="required" />
                                <input type="password" name="p" placeholder="Пароль" required="required" />
                                <button type="submit" className="btn btn-primary btn-block btn-large">Войти</button>
                            </form>
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