define(
    'views/react/base/btn_edit',
    [
        'jquery',
        'react'
    ],function($, React){
        var ButtonEdit = React.createClass({
            handleClick: function (e) {
                var action = 'edit';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonEdit btn btn-xs btn-warning btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span></button> )
                }
                return ( <button className="ButtonEdit btn btn-xs btn-warning" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span>  Редактировать</button> );
            }
        });

        return ButtonEdit;
    }
);    