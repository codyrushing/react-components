/** @jsx React.DOM */
var React = require('react/addons');

var Portal = React.createClass({
  render: function(){
    return null;
  },
  portalElement: null,
  componentDidMount: function(){
    var p = this.props.portalId && document.getElementById(this.props.portalId);
    if (!p) {
      p = document.createElement('div');
      var classNames = this.props.className ? this.props.className.split(" ") : [];
      classNames.push("portal");
      p.id = this.props.portalId;
      classNames.forEach(function(name, i){
        p.classList.add(name);
      });
      document.body.appendChild(p);
    }
    this.portalElement = p;
    this.componentDidUpdate();
  },
  componentWillUnmount: function(){
    document.body.removeChild(this.portalElement);
  },
  componentDidUpdate: function(){
    React.renderComponent(
      this.props.children,
      this.portalElement
    );
  }
});

module.exports = Portal;
