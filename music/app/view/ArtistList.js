Ext.define('Music.view.ArtistList', {
  extend: 'Ext.List',
  xtype: 'artistList',
  requires: [
    'Music.store.Parents',
    'Music.model.Artist',
    'Ext.List'
  ],
  config: {
    itemTpl: '{artistName}',
    store: 'Parents'  
  }
});