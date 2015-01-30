/** @jsx React.DOM */

define(
    'views/react/menu/client_menu',
    [
        'jquery',
        'react',
        'config',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/menu/client_menu_tree'
    ],function($, React, Config, ErrorMsg, ClientMenuTree){

        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;

        var CatScreen = React. createClass({
            whenReaction: function(screen){
                //console.log('when_reaction');
            },
            render: function(){
                (debug)?console.log('client_menu.jsx loaded...'):null;
                var collection = this.props.collection;

                return(
                    <div className="client_bar"><ClientMenuTree collection={collection} childs={null} reaction={this.whenReaction}/></div>
                );
            }
        });
        return CatScreen;
    }
);
