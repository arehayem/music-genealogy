Ext.define('Music.store.Children', {

    extend: 'Ext.data.Store',
    requires: [ 'Music.model.Artist' ],
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
proxy: {
  type: 'ajax',
  url: 'http//EXAMPLE.COM',
  reader: {
    type: 'json',
    rootProperty: 'children'
  }
}
*/
//https://github.com/arehayem/ECE464.git