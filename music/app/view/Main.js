Ext.define('Music.view.Main', {
  extend: 'Ext.Container',
  xtype: 'main',
  requires: [
    'Music.store.Parents',
    'Music.store.Children',
    'Music.store.Albums',
    'Music.store.Artists',
    'Music.model.Artist',
    'Music.view.ArtistList',
    'Ext.List',
    'Ext.Img',
    'Ext.form.FieldSet',
    'Ext.field.Search',
    'Music.view.ChildView',
    'Music.view.ParentView',
    'Music.view.FocusView',
    'Music.view.FocusListView',
  ],
  config: {
    id: 'main',
    //layout: 'hbox',
    layout: 'fit',
    items: [
      {
        xtype: 'panel',
        style: "background-color: orange; width: 200px;",
        items: [
          {
            xtype: 'fieldset',
            items: [
            {
              xtype: 'searchfield',
              id: 'SearchField',
              name: 'search'
            }
            ]
          }
        ]
      },
      {
        xtype: 'container',
        layout: 'fit',
        style: "left: 200px;",
        items: [
          {
            xtype: 'parentview',
            style: "top: 0px; height: 188px;"
          },
          {
            xtype: 'focusview',
            style: "height: 250px; width: 250px; top: 200px; left: 20px;"
          },
          {
            xtype: 'focuslistview',
            style: "top: 200px; left: 300px; height: 200px",
          },
          {
            xtype: 'childview',
            style: "top: auto; bottom: 0px; height: 188px;"
          },
          
        ]
      }
    ]
  }
});