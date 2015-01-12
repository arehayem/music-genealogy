Ext.define('Music.view.ParentView', {
  extend: 'Ext.Container',
  requires: ['Music.model.Collaboration'],
  xtype: 'parentview',
  
  config: {
    layout: 'fit',
    cls: 'ks-basic',
    items: [
      {
        xtype: 'dataview',
        id: 'parentview',
        scrollable: 'horizontal',
        //useComponents: true,
        cls: 'dataview-horizontal',
        itemCls: 'my-dataview-item',
        inline: {
          wrap: false
        },
        //itemTpl: '<div class="img" style="background-image: url();"></div><br><div class="name">{title}</div>',
        itemTpl: '<div class="img" style="background-image: url({image_url});"></div><br><div class="name">{name}</div>',
        store: 'Parents'
      }
    ]
  }
});