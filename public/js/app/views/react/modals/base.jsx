/** @jsx React.DOM */

define(
    'views/react/modals/base',
    [
        'jquery',
        'react',
        'jsx!views/react/modals/bootstrap_modal_mixin',
        'event_bus'
    ],function($, React, BootstrapModalMixin, EventBus){

        var ModalWindowBase = React.createClass({
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
                return(
                    <div className="modal fade">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                             {this.renderCloseButton()}
                                    <strong>{this.props.header}</strong>
                                </div>
                                <div className="modal-body">
                        {this.props.children}
                                </div>
                                <div className="modal-footer">
                       {buttons}
                                </div>
                            </div>
                        </div>
                    </div>
                    );
            }
        });
        return ModalWindowBase;
    }
);



