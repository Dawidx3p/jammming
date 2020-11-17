import React from 'react';
import './PlaylistList.css';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';
import Spotify from '../../util/Spotify.js';

class PlaylistList extends React.Component{
	constructor(props) {
		super(props);
		this.state = { playlistList: [] };
	}
	componentWillMount() {
		Spotify.getUserPlaylists().then( userPlaylists =>
		this.setState({playlistList: userPlaylists}))
	}
	render() {
		return(
		<div className="PlaylistList">
		<h2>Your Playlists</h2>
		{
		this.state.playlistList.map(Playlist => {
			return <PlaylistListItem Playlist={Playlist} 
			key={Playlist.id}
			id={Playlist.id}
			name={Playlist.name}
			onSelect={this.props.onSelect}/>
			})
		}
		</div>
		)
	}
}
export default PlaylistList;