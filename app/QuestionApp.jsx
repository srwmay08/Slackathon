var React = require("react");
var Question = require("./Question.jsx");
var QuestionForm = require('./QuestionForm.jsx');

var QuestionApp = React.createClass({
	render: function() {
		var Questions = this.state.Questions;
		var QuestionHTML = [];
		for(var i = 0; i < Questions.length; i++){
			QuestionHTML.push(<Question key={i} data={Questions[i]} />);
		}
		return (<div>
			{QuestionHTML}
			<QuestionForm getQuestions={this.getQuestions}/>
		</div>);
	},
	getInitialState: function(){
		var stateObj = {
			Questions: []
		};
		return stateObj;
	},
	getQuestions: function() {
		var that = this;
		$.get('/Questions', function(result) {
			that.setState({
				Questions: result
			});
		}, 'json');
	},
	componentDidMount: function() {
		this.getQuestions();
	}
});

module.exports = QuestionApp;
