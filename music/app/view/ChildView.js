Ext.define('Music.view.ChildView', {
  extend: 'Ext.Container',
  requires: ['Music.model.Artist'],
  xtype: 'childview',
  config: {
    layout: 'fit',
    cls: 'ks-basic',
    items: [
      {
        xtype: 'dataview',
        id: 'childview',
        scrollable: 'horizontal',
        cls: 'dataview-horizontal',
        itemCls: 'my-dataview-item',
        inline: {
          wrap: false
        },
        
        itemTpl: '<div class="img" style="background-image: url({image_url});"></div><br><div class="name">{name}</div>',
        store: 'Children'
      }
    ]
  }
});