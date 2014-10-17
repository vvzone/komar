/** @jsx React.DOM */

define(
    'views/react/modals/bootstrap_modal_mixin',
    [
        'jquery',
        'bootstrap',
        'react'
    ],function($, Bootstrap, React){

        var BootstrapModalMixin = function () {
            var handlerProps =
                ['handleShow', 'handleShown', 'handleHide', 'handleHidden'];

            var bsModalEvents = {
                handleShow: 'show.bs.modal',
                handleShown: 'shown.bs.modal',
                handleHide: 'hide.bs.modal',
                handleHidden: 'hidden.bs.modal'
            };

            return {
                propTypes: {
                    handleShow: React.PropTypes.func,
                    handleShown: React.PropTypes.func,
                    handleHide: React.PropTypes.func,
                    handleHidden: React.PropTypes.func,
                    backdrop: React.PropTypes.bool,
                    keyboard: React.PropTypes.bool,
                    show: React.PropTypes.bool,
                    remote: React.PropTypes.string
                },
                getDefaultProps: function () {
                    return {
                        backdrop: true,
                        keyboard: true,
                        show: true,
                        remote: ''
                    }
                },
                componentDidMount: function () {
                    console.warn('this.getDOMNode()');
                    console.warn(this.getDOMNode());

                    var $modal = $(this.getDOMNode()).modal({
                        backdrop: this.props.backdrop,
                        keyboard: this.props.keyboard,
                        show: this.props.show,
                        remote: this.props.remote
                    });
                    handlerProps.forEach(function (prop) {
                        if (this[prop]) {
                            $modal.on(bsModalEvents[prop], this[prop])
                        }
                        if (this.props[prop]) {
                            $modal.on(bsModalEvents[prop], this.props[prop])
                        }
                    }.bind(this));

                    $(this.getDOMNode()).on('hide.bs.modal', this.unMountReactAfterHide);
                },
                componentWillUnmount: function () {
                    console.log('bootsratp modal unmount');
                    var $modal = $(this.getDOMNode())
                    handlerProps.forEach(function (prop) {
                        if (this[prop]) {
                            $modal.off(bsModalEvents[prop], this[prop])
                        }
                        if (this.props[prop]) {
                            $modal.off(bsModalEvents[prop], this.props[prop])
                        }
                    }.bind(this))
                },
                unMountReactAfterHide: function(){
                    var react_node = $(this.getDOMNode()).parent()[0]; //возможно здесь нужно заменить на :last - не нужно здесь поиск не по имени класса
                    console.info(react_node);
                    var unmount = React.unmountComponentAtNode(react_node);
                    console.info(unmount);
                },
                hide: function () {
                    console.log('HIDE');
                    $(this.getDOMNode()).modal('hide');
                    this.unMountReactAfterHide;
                },
                show: function () {
                    $(this.getDOMNode()).modal('show');
                },
                toggle: function () {
                    console.info('modal -> toggle');
                    $(this.getDOMNode()).modal('toggle');
                },
                renderCloseButton: function () {
                    var inner_html = {__html: '&times'};
                    return <button
                    type="button"
                    className="close"
                    onClick={this.hide}
                    dangerouslySetInnerHTML={inner_html}
                    />
                }
            }
        }()

        return BootstrapModalMixin;

    }
);