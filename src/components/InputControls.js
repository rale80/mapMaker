import React from 'react';
import uuid from 'uuid';
import './InputControls.css';

class InputControls extends React.Component {
	state = {
		input: ''
	};

	validateColor = inputColor => {
		var colors = ['red', 'blue', 'green', 'yellow', 'pink', 'purple'];
		return colors.some(function(color) {
			return color === inputColor;
		});
	};
	validateLat = lat => {
		return lat >= -90 && lat <= 90;
	};
	validateLng = lng => {
		return lng >= -180 && lng <= 180;
	};

	handleInputChange = e => {
		this.setState({ input: e.target.value });
	};

	handleAddMarkers = e => {
		e.preventDefault();

		const csv = this.state.input.split('\n');
		let markers = [];

		csv.forEach(line => {
			const inputs = line.trim().split(',');
			if (
				inputs.length >= 2 &&
				(this.validateLat(inputs[0].trim()) &&
					this.validateLng(inputs[1].trim()))
			) {
				var lat = inputs[0].trim();
				var lng = inputs[1].trim();
				var color =
					inputs.length >= 3 && this.validateColor(inputs[2].trim())
						? inputs[2].trim()
						: 'red';

				const marker = {
					id: uuid(),
					position: {
						latitude: lat,
						longitude: lng
					},
					color: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
				};
				markers.push(marker);
			}
		});

		this.setState({
			input: ''
		});

		this.props.updateMarkers(markers);
	};

	render() {
		return (
			<div className="Controls">
				<textarea
					value={this.state.input}
					onChange={this.handleInputChange}></textarea>
				<button onClick={this.handleAddMarkers}>Add Markers</button>
			</div>
		);
	}
}

export default InputControls;
