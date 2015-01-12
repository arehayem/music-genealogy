Ext.define('Music.store.Albums', {
  xtype: 'albumsstore',
  extend: 'Ext.data.Store',
  requires: [ 'Music.model.Album' ],
  config: {
    storeId: 'albumsstore',
    id: 'albumsstore',
    autoLoad: true,
    model: 'Music.model.Album',
    proxy: {
      type: 'ajax',
      url: 'nodetofront.json',
      reader: {
        type: 'json',
        rootProperty: 'collaborations'
      }
    }
  },
});