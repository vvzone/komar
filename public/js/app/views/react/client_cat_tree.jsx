/** @jsx React.DOM */

define(
    'views/react/client_cat_tree',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/client_cat_tree_links_list'
    ],function($, React, ErrorMsg, ClientCatTreeLinksList){

        var CatScreen = React. createClass({
            whenReaction: function(screen){
                //console.log('when_reaction');
            },
            render: function(){
                var collection = this.props.collection;
                return(
                    <div className="well"><ClientCatTreeLinksList collection={collection} childs={null} reaction={this.whenReaction}/></div>
                );
            }
        });

        return CatScreen;
    }
);
