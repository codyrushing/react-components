/** @jsx React.DOM */

// http://stackoverflow.com/questions/27385184/react-component-and-csstransitiongroup

var React = require("react/addons");
var _ = require("lodash");

var Portal = require("./portal");
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var Modal = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        overlayClassName: React.PropTypes.string,

        // Close the modal when esc is pressed? Defaults to true.
        keyboard: React.PropTypes.bool,

        onClose: React.PropTypes.func,

        backdrop: React.PropTypes.oneOfType([
            React.PropTypes.bool,
            React.PropTypes.string
        ])
    },

    getModal: function(){
        var className = ["modal", this.props.className].join(" ");
        var overlayClassName = ["overlay", this.props.overlayClassName].join(" ");

        return (<div key={this.props.name} transitionName="overlay" className={overlayClassName}>
            <div tabIndex="-1" className={className}>
                <div className="modal-header">
                    <a href="#" className="close" onClick={this._modalClose}>close</a>
                    {this.props.header}
                </div>
                <div className="modal-body">
                    <div className="modal-body-inner">
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>);
    },

    render: function() {
        // mount transition child after the parent component for it to work
        var transitionChild =
            this.state.mounted && this.state.open ?
                this.getModal() :
                null;

        return (<Portal className="modal-layer" portalId={this.props.name}>
            <CSSTransitionGroup transitionName="overlay-anim" component={React.DOM.div}>
                {transitionChild}
            </CSSTransitionGroup>
        </Portal>);
    },

    getDefaultProps: function() {
        return {
            className: "",
            overlayClassName: "",
            key: "modal",
            keyboard: true
        };
    },

    getInitialState: function(){
        return {
            mounted: false,
            open: true
        };
    },

    _listenForEsc: function(event) {
        if (this.props.keyboard &&
                (event.key === "Escape" ||
                 event.keyCode === 27)) {
            this._modalClose();
        }
    },

    _modalClose: function(e){
        if(e) e.preventDefault();
        this.setState({
            open: false
        });
        // TODO - somehow listen for transition end event
        setTimeout(function(){
            if(_.isFunction(this.props.onClose)){
                this.props.onClose();
            }
        }.bind(this), 500);
    },

    componentDidMount: function() {
        // add overlay classes to layer
        var overlayClassNames;
        window.addEventListener("keydown", this._listenForEsc, true);
        this.setState({
            mounted: true
        });
    },

    componentWillUnmount: function() {
        window.removeEventListener("keydown", this._listenForEsc, true);
    }
});

module.exports = Modal;
