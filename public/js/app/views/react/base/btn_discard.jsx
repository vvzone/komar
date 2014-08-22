define(
    'views/react/base/btn_discard',
    [
        'jquery',
        'react'
    ],function($, React){
        var ButtonDiscard = React.createClass({
            handleClick: function (e) {
                var action = 'save';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonDiscard btn btn-xs btn-danger btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ban-circle"></span></button> )
                }
                return ( <button className="ButtonDiscard btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ban-circle"></span>  Сброс</button> );
            }
        });

        return ButtonDiscard;
    }
);    