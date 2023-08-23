const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const { rows } = await this._pool.query({
      text: `SELECT p.id, p.name FROM playlists p
      INNER JOIN users u ON p.owner = u.id WHERE p.id = $1`,
      values: [id],
    });
    return rows[0];
  }

  async getPlaylist(playlistId) {
    const playlist = await this.getPlaylistById(playlistId);

    const { rows } = await this._pool.query({
      text: `SELECT s.id, s.title, s.performer FROM songs s
      INNER JOIN playlist_songs ps ON s.id = ps.song_id
      WHERE ps.playlist_id = $1`,
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
