import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify.js';
import PlaylistList from '../PlaylistList/PlaylistList'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
		searchResults: [],
		playlistName: 'MyPlaylist',
		playlistTracks: [],
		playlistId: null
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this)
		this.search = this.search.bind(this);
		this.selectPlaylistId = this.selectPlaylistId.bind(this);
	}
	updatePlaylistName(name){
		this.setState({ playlistName : name })
	}
	savePlaylist() {
		try{
		const trackUris = this.state.playlistTracks.map(track => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackUris, this.state.playlistId).then(() => {
			this.setState({
				playlistName: 'New Playlist',
				playlistTracks: [],
				playlistId: null
			})
		})
		} catch(err){

		}
	}
	selectPlaylistId(id, name) {
		Spotify.getPlaylistId(id)
		.then(tracks => {
			console.log(tracks);
			this.setState({
				playlistName: name,
				playlistTracks: tracks,
				playlistId: id
			})
			document.getElementById('PlaylistInput').value = name;
		})
	}
	addTrack(track) {
		const tracks = this.state.playlistTracks;
		if (tracks.find(savedTrack => savedTrack.id === track.id)) {
		  return;
		}else {
		tracks.push(track);
		this.setState({ playlistTracks: tracks });
		}
	}
	removeTrack(track) {
		let tracks = this.state.playlistTracks;
		tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
		this.setState({ playlistTracks: tracks })
	}
	search(term) {
		Spotify.search(term).then(results => {
		this.setState({searchResults: results}) 
		})
	}
	render(){
		return(
		<div>
		  <h1>Ja<span className="highlight">mmm</span>ing</h1>
		  <div className="App">
			<SearchBar onSearch={this.search}/>
			<div className="App-playlist">
			  <SearchResults SearchResults={this.state.searchResults} onAdd={this.addTrack} isRemoval={false}/>
			  <Playlist playlistTracks={this.state.playlistTracks} 
			  playlistName={this.state.playlistName}
			  onNameChange={this.updatePlaylistName}
			  id={this.state.playlistId}
			  onRemove={this.removeTrack}
			  onSave={this.savePlaylist}/>
			  <PlaylistList onSelect={this.selectPlaylistId}/>
			</div>
		  </div>
		</div>
		)
	}
}
export default App;