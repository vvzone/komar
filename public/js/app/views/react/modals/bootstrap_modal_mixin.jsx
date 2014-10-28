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
                handleHide: 'hide.bs.modal', //hide.bs.modal
                handleHidden: 'hidden.bs.modal'
            };

            //это фактически колбэки

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
                    console.warn('BootstrapModalMixin -> DidMount -> this.getDOMNode()');
                    console.warn(this.getDOMNode());
                    console.info('===============THIS MODAL===============');
                    console.info(this);

                    var $modal = $(this.getDOMNode()).modal({
                        backdrop: this.props.backdrop,
                        keyboard: this.props.keyboard,
                        show: this.props.show,
                        remote: this.props.remote
                    });
                    handlerProps.forEach(function (prop) {
                        console.info('fucking prop is '+prop);
                        if (this[prop]) {
                            console.log('this[prop]');
                            $modal.on(bsModalEvents[prop], this[prop])
                        }
                        if (this.props[prop]) {
                            console.log('this.props[prop]');
                            $modal.on(bsModalEvents[prop], this.props[prop])
                        }
                    }.bind(this));
                    var self = this;
                    var this_node = $(this.getDOMNode());


                    this_node.on('hide.bs.modal', function(){
                        console.info('BOOTSTRAP_MODAL_MIXIN catch ON hide.bs.modal, by:');
                        console.info(this_node);

                        //self.unMountReactAfterHide(this_node); //исполнение приводит к закрытиию всех окон так как там не задан this_node, а начинается поиск
                        //нет, не по этому ;)
                    });

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
                unMountReactAfterHide: function(node){
                    var react_node = node.parent()[0]; //возможно здесь нужно заменить на :last - не нужно здесь поиск не по имени класса
                    console.info('unMountReactAfterHide->react_node');
                    console.info(react_node);
                    var unmount = React.unmountComponentAtNode(react_node);
                    console.info(unmount);
                },
                hide: function () {
                    console.log('(X) HIDE CATCH BY:');
                    var this_node = $(this.getDOMNode());
                    console.log(this_node);
                    this_node.modal('hide');
                    this.unMountReactAfterHide(this_node);
                },
                test: function(){
                    alert('test');
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