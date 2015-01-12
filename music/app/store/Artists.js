Ext.define('Music.store.Artists', {
  xtype: 'Artists',
  id: 'ArtistsStore',
  extend: 'Ext.data.Store',
  requires: ['Music.model.Artist'],
  config: {
    id: 'FocusArtistStore',
    autoLoad: true,
    model: 'Music.model.Artist',
    proxy: {
      type: 'ajax',
      url: 'justin.json', //REPLACE WITH ACTUAL CALL!,
      reader: {
        type: 'json',
        rootProperty: 'artist'
      }
    } 
  }
});