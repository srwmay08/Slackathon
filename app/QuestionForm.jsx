var React = require('react');

var QuestionForm = React.createClass({
	submit: function(evt) {
		evt.preventDefault();
		var newQuestion = $('#msg').val();
		var that = this;
		$.post('/Questions',
			{newQuestion: newQuestion},
			function(response) {
				if (response == "success") {
					that.props.getQuestions();
					$('#msg').val('');
				}
			},
			'text'
		);
	},
	render: function() {
		return (
			<form onSubmit={this.submit}>
				<input type="text" name="msg" id="msg"></input>
				<input type="submit" value="Send"></input>
			</form>
		);
	}
});

module.exports = QuestionForm;
