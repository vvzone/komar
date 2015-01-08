/** @jsx React.DOM */

define(
    'views/react/select_entry',
    [
        'jquery',
        'react',
        'config',
        'app_registry'
    ],function($, React, Config, app_registry){


        var SelectEntryScreen = React.createClass({
            componentDidMount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background = "#f3f3f3 url('/img/rls_mini.jpg') no-repeat right top";
            },
            componentWillUnmount: function(){
                var body = document.getElementsByTagName("body")[0];
                body.style.background ="";
            },
            entryClient: function(event){
                event.preventDefault();
                app_registry.router.navigate('client', true);
            },
            entryAdmin: function(event){
                event.preventDefault();
                app_registry.router.navigate('admin', true);
            },
            render: function(){
                return(
                    <div id="select_entry">
                        <div className="bg_box" onClick={this.entryClient}>
                            <div className="entry_option">Клиентская часть</div>
                        </div>
                        <div className="bg_box" onClick={this.entryAdmin}>
                            <div className="entry_option">Администрирование</div>
                        </div>
                    </div>
                );
            }
        });

        return SelectEntryScreen;
    }
);


/*
 <video autoPlay poster="/img/test_bg.jpg" id="bgvid" loop>
 <source src="/img/test.mp4" type="video/mp4" />
 </video>
 */