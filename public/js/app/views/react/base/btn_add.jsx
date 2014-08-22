define(
    'views/react/base/btn_add',
    [
        'jquery',
        'react'
    ],function($, React){
        var ButtonAdd = React.createClass({
            handleClick: function (e) {
                var action = 'add';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonSave btn btn-xs btn-success btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-plus"></span></button> )
                }
                return ( <button className="ButtonSave btn btn-xs btn-success" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-plus"></span>  Добавить</button> );
            }
        });

        return ButtonAdd;
    }
);    