Ext.define('Music.view.FocusView', {
  extend: 'Ext.Container',
  requires: ['Music.model.Artist',
    'Music.store.Artists'],
  xtype: 'focusview',
  config: {
    id: 'focusviewID',
    layout: 'fit',
    cls: 'ks-basic',
    items: [
      {
        xtype: 'dataview',
        id: 'focusview',
        scrollable: false,
        cls: 'dataview-horizontal',
        itemCls: 'my-dataview-item',
        inline: {
          wrap: false
        },
        //itemTpl: '<div class="img" style="background-image: url();"></div><br><div class="name">{title}</div>',
        itemTpl: '<div class="focus-img" style="background-image: url({image_url});"></div><br><div class="name">{name}</div>',
        store: 'Artists'
      }
    ]
  }
});