Ext.define('Music.model.Artist', {
  extend: 'Ext.data.Model',
  config: {
    fields: ['id', 'name', 'image_url', 'popularity'],
  }
});

/*
  config: {
    fields: [
      {name: "id", type: string},
      {name: "name", type: string},
      {name: "image_url", type: string}
    ]
  }
  
  OR
  
  config: {
    fields: ['id', 'name', 'image_url']
  }
*/