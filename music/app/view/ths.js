Ext.define('Music.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'Welcome',
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: [{
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Welcome to Sencha Touch 2'
                },{
                  xtype: 'container',
                  fullscreen: true,
                  layout: 'hbox',
                  items: [
                    {
                      xtype: 'panel',
                      html: 'message list',
                      flex: 1
                    },
                    {
                      xtype: 'panel',
                      html: 'message preview',
                      flex: 2
                    }
                  ]
                }
                ]
            }
        ]
    }
});
