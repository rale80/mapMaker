import React from 'react';
import uuid from 'uuid';
import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import InputControls from './InputControls';

class GoogleMap extends React.Component {
	state = {
		showInfoWindow: false,
		activeMarker: null,
		markers: [],
		mapCenter: { lat: 43.3203099, lng: 21.8969079 }
	};

	componentDidMount() {
		localStorage['markers']
			? this.setState({ markers: JSON.parse(localStorage['markers']) })
			: (localStorage['markers'] = JSON.stringify([]));

		localStorage['mapCenter']
			? this.setState({ mapCenter: JSON.parse(localStorage['mapCenter']) })
			: (localStorage['mapCenter'] = JSON.stringify({}));
	}
	componentDidUpdate() {
		localStorage['markers'] = JSON.stringify(this.state.markers);
		localStorage['mapCenter'] = JSON.stringify(this.state.mapCenter);
	}

	rotateColor = marker => {
		const colors = ['green', 'blue', 'red', 'yellow', 'pink', 'purple'];
		const color = colors[Math.floor(Math.random() * colors.length)];
		const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;

		const markers = this.state.markers.map(m => {
			if (m.id === marker.id) {
				m.color = iconUrl;
				return m;
			}
			return m;
		});

		this.setState({ markers });
	};

	handleMarkerClick = (markerProps, marker, evt) => {
		if (evt.wa.ctrlKey) {
			this.setState({
				markers: this.state.markers.filter(m => m.id !== marker.id)
			});
			marker.setMap(null);
			marker = null;
		} else if (evt.wa.shiftKey) {
			this.setState({
				activeMarker: marker,
				showInfoWindow: true
			});
		} else {
			this.rotateColor(marker);
		}
	};

	handleInfoClose = () => {
		this.setState({
			activeMarker: null,
			showInfoWindow: false
		});
	};

	addMarker = (mapProps, map, evt) => {
		if (this.state.showInfoWindow) {
			this.setState({
				showInfoWindow: false
			});
		}

		const marker = {
			id: uuid(),
			color: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
			position: { latitude: evt.latLng.lat(), longitude: evt.latLng.lng() }
		};

		this.setState({
			markers: [...this.state.markers, marker]
		});
	};

	displayMarkers = () => {
		return this.state.markers.map(marker => {
			return (
				<Marker
					key={marker.id}
					id={marker.id}
					position={{
						lat: marker.position.latitude,
						lng: marker.position.longitude
					}}
					icon={marker.color}
					onClick={this.handleMarkerClick}
				/>
			);
		});
	};

	centerMap = (mapProps, map) => {
		map.setCenter(this.state.mapCenter);
	};

	centerMovedHandler = (mapProps, map) => {
		this.setState({
			mapCenter: { lat: map.center.lat(), lng: map.center.lng() }
		});
	};

	handleUpdateMarkers = bulkMarkers => {
		this.setState({ markers: [...this.state.markers, ...bulkMarkers] });
	};

	render() {
		const styles = {
			border: '2px solid rgb(0, 0, 0, 0.2)',
			boxShadow:
				'0 0 0 10px rgb(248, 245, 245), 0 0 5px 11px rgba(0, 0, 0, 0.4)',
			height: '60vh',
			width: '60vw',
			margin: '30px auto'
		};

		return (
			<>
				<Map
					style={styles}
					google={this.props.google}
					zoom={12}
					gestureHandling="cooperative"
					initialCenter={this.state.mapCenter}
					onClick={this.addMarker}
					onDragend={this.centerMovedHandler}
					onReady={this.centerMap}>
					{this.displayMarkers()}

					<InfoWindow
						marker={this.state.activeMarker}
						visible={this.state.showInfoWindow}
						onClose={this.handleInfoClose}>
						{this.state.activeMarker ? (
							<div>
								<h3>Latitude: {this.state.activeMarker.position.lat()}</h3>
								<h3>Longitude: {this.state.activeMarker.position.lng()}</h3>
							</div>
						) : (
							<h3>Marker is not selected</h3>
						)}
					</InfoWindow>
				</Map>

				<InputControls updateMarkers={this.handleUpdateMarkers} />
			</>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_API_KEY
})(GoogleMap);
