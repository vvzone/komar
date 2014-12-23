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
                        (debug)?console.info('fucking prop is '+prop):null;
                        if (this[prop]) {
                            (debug)?console.log('this[prop]'):null;
                            $modal.on(bsModalEvents[prop], this[prop])
                        }
                        if (this.props[prop]) {
                            (debug)?console.log('this.props[prop]'):null;
                            $modal.on(bsModalEvents[prop], this.props[prop])
                        }
                    }.bind(this));
                    var self = this;
                    var this_node = $(this.getDOMNode());


                    this_node.on('hide.bs.modal', function(){
                        if(debug){
                            console.info('BOOTSTRAP_MODAL_MIXIN catch ON hide.bs.modal, by:');
                            console.info(this_node);
                        }

                        //self.unMountReactAfterHide(this_node); //исполнение приводит к закрытиию всех окон так как там не задан this_node, а начинается поиск
                        //нет, не по этому ;)
                    });

                },
                componentWillUnmount: function () {
                    (debug)?console.log('bootsratp modal unmount'):null;
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
                    if(debug){
                        console.info('unMountReactAfterHide->react_node');
                        console.info(react_node);
                    }
                    var unmount = React.unmountComponentAtNode(react_node);
                    (debug)?console.info(unmount):null;
                },
                hide: function () {
                    (debug)?console.log('(X) HIDE CATCH BY:'):null;
                    var this_node = $(this.getDOMNode());
                    (debug)?console.log(this_node):null;
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