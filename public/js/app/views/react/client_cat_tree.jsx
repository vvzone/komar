/** @jsx React.DOM */

define(
    'views/react/client_cat_tree',
    [
        'jquery',
        'react',
        'config',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/client_cat_tree_links_list'
    ],function($, React, Config, ErrorMsg, ClientCatTreeLinksList){

        var debug = (Config['debug'] && Config['debug']['debug_menu'])? 1:null;

        var CatScreen = React. createClass({
            whenReaction: function(screen){
                //console.log('when_reaction');
            },
            render: function(){
                (debug)?console.log('client_cat_tree.jsx loaded...'):null;
                var collection = this.props.collection;
                return(
                    <div className="client_bar"><ClientCatTreeLinksList collection={collection} childs={null} reaction={this.whenReaction}/></div>
                );
            }
        });
        return CatScreen;
    }
);
