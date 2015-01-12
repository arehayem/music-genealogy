Ext.define('Music.store.TreeStore', {
  extend: 'Ext.data.TreeStore',
  xtype: 'treestore',
  config: {
    model: 'Album',
    defaultRootProperty: 'album',
    proxy: {
      type: 'ajax',
      url: 'nodetofront2.json'
    }
  }
});