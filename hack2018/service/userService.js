authorizeNet.service("UserService", function($http, $location, user) {
	//user.token = undefined;
 return {
  isAuthenticated: function() {
   return localStorage.getItem("authToken") != undefined;
  // return user.token != undefined;
  },

  getAuthToken: function() {
  	//return user.token;
   return localStorage.getItem("authToken");
  },
  
  setUser: function(data) {
    //user.user = data.user;
    //user.user = {};
    user.name = "Charles Scharf";
    user.role = "Admin";
    //user.token = 
    
  },
  setSessionToken: function(token) {
    //user.token =token;
    localStorage.setItem("authToken", token);
  },
  getUser:function(){
    return user;
  },
  
  endSession: function() {
  	//user.token = undefined;
    localStorage.removeItem("authToken");
    
  }
 }
});