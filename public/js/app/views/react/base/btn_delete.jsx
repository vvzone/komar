define(
    'views/react/base/btn_delete',
    [
        'jquery',
        'react'
    ],function($, React){
        var ButtonDelete = React.createClass({
            handleClick: function (e) {
                var action = 'delete';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonDelete btn btn-xs btn-danger btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span></button> );
                }
                return ( <button className="ButtonDelete btn btn-xs btn-danger" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-remove"></span>  Удалить</button> );
            }
        });

        return ButtonDelete;
    }
);    