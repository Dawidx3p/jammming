const clientId = 'e4df8825d94443aca7e857893961f53a';
const redirectUri = 'http://localhost:3000/';
let accessToken;
const Spotify = {
	getAccessToken() {
		if(accessToken) {
			return accessToken;
		}
		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
		
		
		if (accessTokenMatch && expiresInMatch){
			accessToken = accessTokenMatch[1];
			const expiresIn = Number(expiresInMatch[1]);
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		}
		else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			window.location = accessUrl;
		}
	},
	search(term){
		const accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
			{headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
		.then(response => {
			return response.json();
		}).then(object => {
			
			return object.tracks.items.map(items => {
				return {
				album: items.album.name,
				id: items.id,
				name: items.name,
				artist: items.artists[0].name,
				uri: items.uri}
			})
		})
		
			
	},
	savePlaylist(name, trackUris, playlistId) {
		const accessToken = Spotify.getAccessToken();
		const headers = {Authorization: `Bearer ${accessToken}`};
		if(!name || !trackUris.length){
			return alert("You can't save empty playlist");
			
		}else {
		if(playlistId === null){
		return Spotify.getCurrentUserId(headers)
		.then(userId => {
			fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
				headers: headers,
				method: 'POST',
				body: JSON.stringify({ name: name})
			}).then(response => response.json())
			.then(jsonResponse => {
				const playlistId = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({uris: trackUris})
					})
				})
			})
		}else {
			return Spotify.getCurrentUserId(headers)
			.then(userId => {
				fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`, {
					headers: headers,
					method: 'PUT',
					body: JSON.stringify({ name: name})
				}).then(response => {
							return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
							headers: headers,
							method: 'DELETE',
							body: JSON.stringify({uris: trackUris})
					})
					.then(response => {
					return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
						headers: headers,
						method: 'PUT',
						body: JSON.stringify({uris: trackUris})
						})
				})
		})
		})
		}
	}},
	getCurrentUserId(headers) {
		return fetch('https://api.spotify.com/v1/me', {headers: headers})
		.then(response => response.json())
		.then(jsonResponse => {
			return jsonResponse.id;
		})
	},
	getUserPlaylists() {
		const accessToken = Spotify.getAccessToken();
		const headers = {Authorization: `Bearer ${accessToken}`};
		return Spotify.getCurrentUserId(headers)
		.then(userId => {
			return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{headers: {
				Authorization: `Bearer ${accessToken}`
			}})
			.then(response => {return response.json()})
			.then(object => {
				return object.items.map(playlist => {
					return{
						name: playlist.name,
						id: playlist.id
					}
				})
			})
			})
	},
	getPlaylistId(playlistId) {
		const accessToken = Spotify.getAccessToken();
		const headers = {Authorization: `Bearer ${accessToken}`};
		return Spotify.getCurrentUserId(headers)
		.then(userId => {
			
			return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{headers: {
				Authorization: `Bearer ${accessToken}`
			}})
			.then(response => {return response.json()})
			.then(object => {
			
			return object.items.map(items => {
				return {
				album: items.track.album.name,
				id: items.track.id,
				name: items.track.name,
				artist: items.track.artists[0].name,
				uri: items.track.uri}
			})
		})
			})
	}
}
export default Spotify;