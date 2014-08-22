define(
    'views/react/base/btn_save',
    [
        'jquery',
        'react'
    ],function($, React){
        var ButtonSave = React.createClass({
            handleClick: function (e) {
                var action = 'save';
                this.props.clicked(action);
            },
            render: function () {
                if(this.props.mini == 'true'){
                    return ( <button className="ButtonSave btn btn-xs btn-success btn-mini" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ok"></span></button> )
                }
                return ( <button className="ButtonSave btn btn-xs btn-success" type="button" onClick={this.handleClick}><span className="glyphicon glyphicon-ok"></span>  Сохранить</button> );
            }
        });
        return ButtonSave;
    }
);    