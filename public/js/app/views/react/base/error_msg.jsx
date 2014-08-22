define(
    'views/react/base/error_msg',
    [
        'jquery',
        'react'
    ],function($, React){
        var ErrorMsg = React.createClass({
            render: function () {
                var message = '';
                var header = '';
                (this.props.header == undefined)? header= 'Ошибка' : header = this.props.header;
                (this.props.msg == undefined)? message= 'Неизвестная ошибка': message = this.props.msg;

                return (
                    <div className="alert alert-error">
                        <a href="#" className="close" data-dismiss="alert">&times;</a>
                        <strong>{header}</strong>
                        <br />{message}
                    </div>
                    );
            }
        });

        return ErrorMsg;
    }
);
