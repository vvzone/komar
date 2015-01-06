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
                        <div className="entry_option" onClick={this.entryClient}>Клиентская часть</div>
                        <div className="entry_option" onClick={this.entryAdmin}>Администрирование</div>
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