Ext.define("Music.model.Album", {
  extend: "Ext.data.Model",
  
  config: {
    fields: [
      {name: 'title', mapping: 'album.title'},
      {name: 'album_image', mapping: 'album.album_image'},
      {name: 'album_popularity', mapping: 'album.album_popularity'}
    ]
  },
  
});

/*Ext.define("Music.model.Album", {
  extend: "Ext.data.Model",
  
  config: {
    fields: [
      {name: 'title', mapping: 'album.title'},
      {name: 'album_image', mapping: 'album.album_image'},
      {name: 'album_popularity', mapping: 'album.album_popularity'}
    ],
    belongsTo: 'Music.model.Collaboration'
  },
  
});*/