'use strict';

define([
	'underscore',
	'react',
	'reflux',
	'app/stores/terminal',
	'ansi_up',
	'templates/app/components/terminal/terminal'
], function(_, React, Reflux, terminalStore, ansiUp, template) {
	var Component = React.createClass({
		mixins: [Reflux.ListenerMixin],
		scrollOnData: true,
		ignoreScrollEvent: false,
		componentDidMount: function() {
			this.listenTo(terminalStore, this.updateItems);
		},
		ensureScrollPosition: function() {
			if (this.scrollOnData) {
				var codeNode = this.refs.code.getDOMNode();
				this.ignoreScrollEvent = true;
				codeNode.scrollTop = codeNode.scrollHeight - codeNode.offsetHeight;
			}
		},
		onScroll: function() {
			if (!this.ignoreScrollEvent) {
				var codeNode = this.refs.code.getDOMNode();
				if (codeNode.offsetHeight + codeNode.scrollTop >= codeNode.scrollHeight) {
					this.scrollOnData = true;
				} else {
					this.scrollOnData = false;
				}
			}
			this.ignoreScrollEvent = false;
		},
		updateItems: function(build) {
			// listen just our console update
			if (build.buildId === this.props.build) {
				this.setState({data: ansiUp.ansi_to_html(build.data)});
				_.defer(this.ensureScrollPosition);
				this.ensureScrollPosition();
			}
		},
		render: template,
		getInitialState: function() {
			return {
				data: ''
			};
		}
	});

	return Component;
});