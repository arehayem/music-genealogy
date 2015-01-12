Ext.define('Music.controller.Main', {
  extend: 'Ext.app.Controller',

  config: {
    control: {
      parentview: {
        //itemtap: 'log'
        itemtap: 'switchThroughClick',
        initialize: 'start'
      },
      childview: {
        //itemtap: 'log'
        itemtap: 'switchThroughClick'
      },
      searchbar: {
        //change: 'changed'
        action: 'switchThroughSearch'
      },
      collabListView: {
        itemtap: 'clickedCollab'
      }
    },
    refs: {
      main: '#main',
      parentStore: '#ParentStore',
      searchbar: '#SearchField',
      parentview: '#parentview',
      childview: '#childview',
      focusview: '#focusview',
      gparents: '#gparents',
      focuslist: '#focuslist',
      collabListView: '#collabListView',
      focusArtist: '#focusArtist',
      albumStore: '#albumsStore'
    }
  },
  
  start: function() {
    me = this;
    Ext.Ajax.disableCaching = false;
    Ext.Ajax.request({
      url: 'http://localhost:8888/results',
      method: 'POST',
      disableCaching: false,
      withCredentials: true,
      useDefaultXhrHeader: false,
      params: {
        text: '3fMbdgg4jU18AjLCKBhRSm',
        mode: 0
      },
      success: function(response) {
        console.log("Success!");
        
        // Reset the proxies
        me.getParentview().getStore().setProxy({
          type: 'memory',
          reader: {
            type: 'json',
            rootProperty: 'parents' 
          }
        });
        
        me.getChildview().getStore().setProxy({
          type: 'memory',
          reader: {
            type: 'json',
            rootProperty: 'children' 
          }
        });
        
        me.getCollabListView().getStore().setProxy({
          type: 'memory',
          reader: {
            type: 'json',
            rootProperty: 'collaborations'
          }
        });
        
        me.getFocusview().getStore().setProxy({
          type: 'memory',
          reader: {
            type: 'json',
            rootProperty: 'artist'
          }
        });
        
        // Set the data
        me.getParentview().getStore().setData(response.responseText);
        me.getChildview().getStore().setData(response.responseText);
        me.getCollabListView().getStore().setData(response.responseText);
        me.getFocusview().getStore().setData(response.responseText);
        
        // Load the stores
        me.getParentview().getStore().load();
        me.getChildview().getStore().load();
        me.getCollabListView().getStore().load();
        me.getFocusview().getStore().load();
      },
      failure: function() {
        console.log("Failed!!!");
      }
    });
  },
  
  clickedCollab: function(me, index, target) {
    var clickedName = this.getCollabListView().getStore().getData().all[index].raw.id
    Music.app.getController('Music.controller.Main').makeCall(clickedName, 0);
  },
  
  switchThroughSearch: function() {
    var searchedFor = this.getSearchbar().getValue();
    Music.app.getController('Music.controller.Main').makeCall(searchedFor, 1);
  },
  // Called through an "itemtap" event on a dataview
  switchThroughClick: function(me, index, target) {
    var clickedName = me.getStore().data.all[index].data.id;
    Music.app.getController('Music.controller.Main').makeCall(clickedName, 0);
  },
  makeCall: function(artistName, mode) {
    this.getCollabListView().setHeight(Ext.getBody().getSize().height - 2*188 -24);
    this.getMain().setMasked({
      xtype: 'loadmask',
      message: 'Loading artist information...'
    });
    me = this;
    Ext.Ajax.disableCaching = false;
    Ext.Ajax.request({
      url: 'http://localhost:8888/results',
      method: 'POST',
      disableCaching: false,
      withCredentials: true,
      useDefaultXhrHeader: false,
      params: {
        text: artistName,
        mode: mode
      },
      success: function(response) {
        console.log("Success!");
        
        //me.getFocusview().getStore().setData(response.responseText);
        me.getParentview().getStore().setData(response.responseText);
        me.getChildview().getStore().setData(response.responseText);
        me.getCollabListView().getStore().setData(response.responseText);
        me.getFocusview().getStore().setData(response.responseText);
        
        // Load the stores
        me.getParentview().getStore().load();
        me.getChildview().getStore().load();
        me.getCollabListView().getStore().load();
        me.getFocusview().getStore().load();
        
        if (!me.getCollabListView().getStore().getCount()) {
          me.getCollabListView().setHtml('No found collaborations!');
          me.getCollabListView().setScrollable(false);
        } else {
          me.getCollabListView().setHtml('');
          me.getCollabListView().setScrollable(true);
        }
        
        if (!me.getChildview().getStore().getCount()) {
          me.getChildview().setHtml('No found influencees!');
          me.getChildview().setScrollable(false);
        } else {
          me.getChildview().setHtml('');
          me.getChildview().setScrollable(true);
        }
        
        if (!me.getParentview().getStore().getCount()) {
          me.getParentview().setHtml('No found influencers!');
          me.getParentview().setScrollable(false);
        } else {
          me.getParentview().setHtml('');
          me.getParentview().setScrollable(true);
        }
  
        me.getMain().setMasked(false);
      },
      failure: function() {
        console.log("Failed!!!");
        me.getMain().setMasked(false);
        
        Ext.Msg.alert('Error', 'Error retrieving artist information!');
      }
    });
  }

});

