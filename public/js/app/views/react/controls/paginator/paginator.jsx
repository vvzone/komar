/** @jsx React.DOM */

define(
    'views/react/controls/paginator/paginator',
    [
        'jquery',
        'react',
        'underscore'
    ],function($, React, _){
        var Paginator = React.createClass({
            render: function(){
                return (
                    <div className="paginator">Pagination:{this.props.pagination}</div>
                );
            }
        });

        return Paginator;
    }
);