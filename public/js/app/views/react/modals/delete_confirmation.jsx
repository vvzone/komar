/** @jsx React.DOM */

define(
    'views/react/modals/delete_confirmation',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin'
    ],function($, React, BootstrapModalMixin){

        var ModalWindowDeleteConfirmation = React.createClass({
            mixins: [BootstrapModalMixin],
            componentDidMount: function() {
                this.show();
            },
            render: function () {
                var buttons = this.props.buttons.map(function (button) {
                    return (
                        <button type="button" className={'btn btn-' + button.type} onClick={button.handler} key={button.type}>
                    {button.text}
                        </button>
                        );
                });

                var msg ='';
                if(this.props.msg){
                    msg = <div className="modal-body">
                     {this.props.msg}
                    </div>;
                }
                return(
                    <div className="modal fade">
                        <div className="modal-dialog">
                            <div className="modal-content alert-warning">
                                <div className="modal-header">
                             {this.renderCloseButton()}
                                    <strong>{this.props.header}</strong>
                                </div>
                        {msg}
                                <div className="modal-footer">
                       {buttons}
                                </div>
                            </div>
                        </div>
                    </div>
                    );
            }
        });

        return ModalWindowDeleteConfirmation;
    }
);
