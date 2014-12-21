/** @jsx React.DOM */

define(
    'views/react/client',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/cat_tree_links_list'
        , 'views/client_menu_list',
        'views/yandex'
    ],function($, React, ErrorMsg, CatTreeLinksList, ClientMenu, Yandex){

        var Client = React. createClass({
            whenReaction: function(screen){
                //console.log('when_reaction');
            },
            render: function(){
                return(
                    <div className="client-window">
                        <div id="YMapsID" style="width: 450px; height: 350px;"></div>
                    </div>
                );
            }
        });

        return Client;
    }
);
