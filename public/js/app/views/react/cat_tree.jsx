/** @jsx React.DOM */

define(
    'views/react/cat_tree',
    [
        'jquery',
        'react',
        'jsx!views/react/base/error_msg',
        'jsx!views/react/cat_tree_links_list'
    ],function($, React, ErrorMsg, CatTreeLinksList){

        var CatScreen = React. createClass({
            whenReaction: function(screen){
                //console.log('when_reaction');
            },
            render: function(){
                var collection = this.props.collection;
                return(
                    <div className="well"><CatTreeLinksList collection={collection} childs={null} reaction={this.whenReaction}/></div>
                );
            }
        });

        return CatScreen;
    }
);
