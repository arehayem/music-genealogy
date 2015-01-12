Ext.define('Music.store.Collaborations', {
    xtype: 'Collaborations',
    extend: 'Ext.data.Store',
    config: {
      id: 'Collaborations',
      model: 'Music.model.Collaboration',
      autoLoad: true
    }
});