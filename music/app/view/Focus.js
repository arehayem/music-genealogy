Ext.define('Music.view.Focus', {
  extend: 'Ext.Container',
  requires: ['Music.model.Artist'],
  xtype: 'focus',
  
  config: {
    layout: 'fit',
    cls: 'ks-basic',
    items: [
      {
        xtype: 'dataview',
        id: 'focusview',
        scrollable: 'horizontal',
        //useComponents: true,
        cls: 'dataview-horizontal',
        itemCls: 'my-dataview-item',
        inline: {
          wrap: false
        },
        itemTpl: '<div class="img" style="background-image: url();"></div><br><div class="name">{title}</div>',
        store: 'Parents'
      }
    ]
  }
});