/** @jsx React.DOM */

define(
    'views/react/modals/bootstrap_modal_mixin',
    [
        'jquery',
        'bootstrap',
        'react',
        'config'
    ],function($, Bootstrap, React, Config){

        var debug = (Config['debug'] && Config['debug']['debug_modals'])? 1:null;

        var BootstrapModalMixin = function () {
            var handlerProps =
                ['handleShow', 'handleShown', 'handleHide', 'handleHidden'];

            var bsModalEvents = {
                handleShow: 'show.bs.modal',
                handleShown: 'shown.bs.modal',
                handleHide: 'hide.bs.modal', //hide.bs.modal
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
                        backdrop: false, //because of this shit!!! 2-do: detour somehow
                        keyboard: false,
                        show: true,
                        remote: ''
                    }
                },
                componentDidMount: function () {
                    if(debug){
                        console.warn('BootstrapModalMixin -> DidMount -> this.getDOMNode()');
                        console.warn(this.getDOMNode());
                        console.info('===============THIS MODAL===============');
                        console.info(this);
                    }

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
                    var self = this;
                    var this_node = $(this.getDOMNode());

                },
                componentWillUnmount: function () {
                    (debug)?console.log('bootsratp modal WillUnmount'):null;
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
                unMountReactAfterHide: function(node){
                    var react_node = node[0];
                    if(debug){
                        console.info(['unMountReactAfterHide', react_node]);
                    }
                    React.unmountComponentAtNode(react_node);
                },
                hide: function () {
                    var this_node = $(this.getDOMNode());
                    (debug)?console.log(['modal hide at node:', this_node]):null;
                    this_node.modal('hide');
                    this.unMountReactAfterHide(this_node);
                },
                show: function () {
                    $(this.getDOMNode()).modal('show');
                },
                toggle: function () {
                    (debug)?console.info('modal -> toggle'):null;
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