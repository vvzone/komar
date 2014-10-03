define(
    'views/react/base/info_msg',
    [
        'jquery',
        'react'
    ],function($, React){
        var InfoMsg = React.createClass({
            render: function () {
                var message = '';
                var header = '';
                (this.props.header == undefined)? header= 'Информация' : header = this.props.header;
                (this.props.msg == undefined)? message= 'Неизвестная ошибка': message = this.props.msg;

                /*
                return (
                    <div className="alert alert-info">
                        <div className="modal-header">
                            <span className="glyphicon glyphicon-info-sign" onClick={this.hide}></span>
                            <a href="#" className="close" data-dismiss="alert">&times;</a>
                            <strong></strong>
                        </div>
                        <a href="#" className="close" data-dismiss="alert">&times;</a>
                        <strong>{header}</strong>
                        <div>{message}</div>
                    </div>
                );
                */
                return(
                    <a class="alert alert-info alert--finch" href="#">{message}</a>
                )
            }
        });

        return InfoMsg;
    }
);
