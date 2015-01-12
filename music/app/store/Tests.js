Ext.define('Music.store.Tests', {
    xtype: 'Tests',
    extend: 'Ext.data.Store',
    requires: [ 'Music.model.Test' ],
    config: {
      autoLoad: true,
      model: 'Music.model.Test',
      proxy: {
        type: 'ajax',
        url: 'nodetofront.json',
        reader: {
          type: 'json'
        }
      }
    }
});