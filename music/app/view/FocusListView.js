Ext.define('Music.view.FocusListView', {
  extend: 'Ext.dataview.List',
  xtype: 'focuslistview',
  requres: ['Music.store.Collaborations'],
  config: {
    id: 'collabListView',
   
   itemTpl: new Ext.XTemplate( 
      '<tpl for=".">',
          '<div class="collab-img" style="background-image: url({image_url});"></div>with <span class="underline">{name}</span> on albums:<br>',
        '<tpl for="albums">',
          '<div class="collab-img" style="background-image: url({image_url});"></div> {title}<br>',
        '</tpl>',
      '</tpl>'
    ),
    autoLoad: true,
    autoSync: true,
    store: 'Collaborations'
    
    
  }
});

/*
itemTpl: new Ext.XTemplate( 
      '<tpl for=".">',
        '<tpl for="album">',
          '{title}',
        '</tpl>',
      '</tpl>'
    ),

new Ext.XTemplate(
'<tpl for=".">',    
  '<tpl for="collaborations">',
      '<div class="collab-img" style="background-image: url({image_url});"></div> {name}<br>',
    '<tpl for="albums">',
      '<div class="collab-img" style="background-image: url({album_image});"></div> {title}<br>',
    '</tpl>',
  '</tpl>'
'</tpl>'
)
    */