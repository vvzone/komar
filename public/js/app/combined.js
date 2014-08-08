/** @jsx React.DOM */

var React = require('react');
module.exports = React.createClass({displayName: 'exports',
    render: function() {
        return (
            React.DOM.div({className: "Bio"}, 
                React.DOM.p({className: "Bio-text"}, this.props.text)
            )
            )
    }
});
