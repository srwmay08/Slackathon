var React = require('react');

var Question = React.createClass({
	render: function(){
		return <p><strong>{this.props.data.username}</strong>:{this.props.data.text}</p>
	}
});

module.exports = Question;
