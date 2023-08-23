const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const { rows } = await this._pool.query({
      text: `SELECT playlists.* FROM playlists
      INNER JOIN users ON playlists.owner = users.id WHERE playlists.id = $1`,
      values: [id],
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      username: row.username,
    }))[0];
  }

  async getPlaylist(playlistId) {
    const playlist = await this.getPlaylistById(playlistId);

    const { rows } = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    });

    const songs = rows[0].title === null ? [] : rows;

    return {
      playlist: {
        ...playlist,
        songs,
      },
    };
  }
}

module.exports = PlaylistsService;
