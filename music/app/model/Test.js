Ext.define('Music.model.Test', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      {name: 'id', mapping: 'artist.collaborations.tracks.id'},
      {name: 'name', mapping: 'artist.collaborations.tracks.name'},
      {name: 'image_url', mapping: 'artist.collaborations.tracks.image_url'},
      {name: 'popularity', mapping: 'artist.collaborations.tracks.popularity'}
    ]
  }
});