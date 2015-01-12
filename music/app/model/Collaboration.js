Ext.define('Music.model.Collaboration', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      {name: 'name', type: 'string'},
      {name: 'albums'}
    ],
    proxy: {
      type: 'ajax',
      url: 'nodetofront.json',
      reader: {
        type: 'json',
        rootProperty: 'collaborations'
      }
    }
  }
});