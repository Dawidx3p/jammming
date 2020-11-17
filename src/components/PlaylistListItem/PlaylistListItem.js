import React from 'react';
import './PlaylistListItem.css';
import Spotify from '../../util/Spotify.js';

class PlaylistListItem extends React.Component{
	constructor(props) {
		super(props);
		this.state = {name: this.props.name, id: this.props.id};
		this.onSelect = this.onSelect.bind(this);
	}
	onSelect() {
		this.props.onSelect(this.state.id, this.state.name);
	}
	render() {
		return(
		<div className="PlaylistListItem" onClick={this.onSelect} id={this.state.id}>
				<p>{this.props.name}</p>
		</div>
		)
	}
}
export default PlaylistListItem;