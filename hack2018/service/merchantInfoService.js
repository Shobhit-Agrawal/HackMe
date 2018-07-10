
authorizeNet.service('menuService', ['$window', function(win) {
   
    var ownerInfo = {};
    var menuObject = {
                          "menus":  [ {
                              "name":"Home",
                              "menuItems":[{"name":"Home","link":"about"},
                                           {"name":"Tools","link":"tools"},
                                           {"name":"Account","link":"settings"},
                                           {"name":"Home","link":"about"}
                                          ]
                            },
                            {
                              "name":"Tools",
                              "menuItems":[]
                            },
                            {
                              "name":"Reports",
                              "menuItems":[{"name":"Home","link":"about"},
                                           {"name":"Tools","link":"tools"},
                                           {"name":"Account","link":"settings"},
                                           {"name":"Home","link":"about"}
                                          ]
                            }
                            ]
                      };


    return {
      getMenus:function(){
        return menuObject;
      }
      
    };
 }]);