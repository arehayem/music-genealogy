Ext.define('Music.store.Parents', {
  xtype: 'Parents',
  id: 'ParentStore',
  extend: 'Ext.data.Store',
  requires: ['Music.model.Artist'],
  config: {
      model: 'Music.model.Artist',
      data: [
        { id: "GeorgeMichael", name: "Alan Wolf", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/wolf1.jpg", popularity: ""},
        { id: "RiffRaff", name: "Fred Fontaine", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/fontaine1.jpg", popularity: ""},
        { id: "JohnMayer", name: "Alan Wolf", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/wolf1.jpg", popularity: ""},
        { id: "Eminem", name: "Fred Fontaine", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/fontaine1.jpg", popularity: ""},
        { id: "TinaTurner", name: "Alan Wolf", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/wolf1.jpg", popularity: ""},
        { id: "Adele", name: "Fred Fontaine", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/fontaine1.jpg", popularity: ""},
        { id: "EdSheeran", name: "Robert Smyth", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/smyth1.jpg", popularity: ""},
        { id: "JohnColtrane", name: "Fred Fontaine", image_url: "http://www.cooper.edu/sites/default/files/imagecache/175x175/fontaine1.jpg", popularity: ""},
      ]
    }
});
/*
Ext.define('Music.store.Parents', {
  xtype: 'Parents',
  id: 'ParentStore',
  extend: 'Ext.data.Store',
  requires: ['Music.model.Artist'],
  config: {
    id: 'ParentStore',
    autoLoad: true,
    model: 'Music.model.Artist',
    proxy: {
      type: 'ajax',
      url: 'nodetofront.json', //REPLACE WITH ACTUAL CALL!,
      reader: {
        type: 'json',
        rootProperty: 'parents'
      }
    } 
  }
});
*/
/*
start: function() { 
    Ext.Ajax.disableCaching = false;
    Ext.Ajax.request({
      url: 'http://localhost:8888/results',
      method: 'POST',
      disableCaching: false,
      withCredentials: true,
      useDefaultXhrHeader: false,
      params: {
        text: 'Bee Gees'
      },
      success: function(response) {
        console.log(response.responseText);
        console.log("Success!");
      }
    });
  },
*/