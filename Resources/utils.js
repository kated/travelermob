/* CURRENT USER */
var CurrentParticipant = {
  USER_ID: "participantId",
  USER_EMAIL: "participantEmail",
  USER_PASSWORD: "participantPassword",
  NAME: "name",
  TRAVEL_LOG_RATE: "travelLogRate",
  TRAVEL_LOG_ADAPT_RATE: "travelLogAdaptRate",
  setId: function(id) {
    Titanium.App.Properties.setString(CurrentParticipant.USER_ID, id);
  },
  getId: function() {
    return Titanium.App.Properties.getString(CurrentParticipant.USER_ID, "");
  },
  setEmail: function(email) {
    Titanium.App.Properties.setString(CurrentParticipant.USER_EMAIL, email);
  },
  getEmail: function() {
    return Titanium.App.Properties.getString(CurrentParticipant.USER_EMAIL, "");
  },
  setPassword: function(password) {
    Titanium.App.Properties.setString(CurrentParticipant.USER_PASSWORD, password);
  },
  getPassword: function() {
    return Titanium.App.Properties.getString(CurrentParticipant.USER_PASSWORD, "");  
  },
  setName: function(name) {
    Titanium.App.Properties.setString(CurrentParticipant.NAME, name);
  },
  getName: function() {
    return Titanium.App.Properties.getString(CurrentParticipant.NAME, "");  
  },
  setTravelLogRate: function(travelLogRate) {
    Titanium.App.Properties.setString(CurrentParticipant.TRAVEL_LOG_RATE, travelLogRate);
  },
  getTravelLogRate: function() {
    return Titanium.App.Properties.getString(CurrentParticipant.TRAVEL_LOG_RATE, "");  
  },
  setTravelLogAdaptRate: function(travelLogAdaptRate) {
    Titanium.App.Properties.setString(CurrentParticipant.TRAVEL_LOG_ADAPT_RATE, travelLogAdaptRate);
  },
  getTravelLogAdaptRate: function() {
    return Titanium.App.Properties.getString(CurrentParticipant.TRAVEL_LOG_ADAPT_RATE, "");  
  },
  signedIn: function() {
    // if (Titanium.App.Properties.getString(CurrentParticipant.USER_ID, "") !== "" && Titanium.App.Properties.getString(CurrentParticipant.USER_PASSWORD, "") !== "") {
    if (CurrentParticipant.getId() !== "" && CurrentParticipant.getPassword() !== "") {
      return true;
    }
    else {
      return false;
    }
  },
  signOut: function() {
    CurrentParticipant.setId("");
    CurrentParticipant.setEmail("");
    CurrentParticipant.setPassword("");
  }
};

/* WINDOWS */
var Windows = {
  signIn: function() {
    var signInWindow = Titanium.UI.createWindow({
    	title: 'Sign In',
    	url: '/main_windows/sign_in.js'
    });
    signInWindow.open();
  },
  main: function() {
    var mainWindow = Titanium.UI.createWindow({
      title: 'Traveler',
      url: "/main_windows/main.js",
      exitOnClose: true,
      navBarHidden: false
    });
    mainWindow.open();
  }
};

/* TRAVELERSERV */
var Travelerserv = {
  url: "http://traveler.cocogeo.com/mobile/android/",
  request: function(action, url, params, onLoadFunction, onErrorFunction, format) { // format is optional
    if (!format) {
      format = "json";
    }
    
    Ti.App.xhr = Ti.Network.createHTTPClient();
    Ti.App.xhr.onload = onLoadFunction;
    Ti.App.xhr.onerror = function(e) {
      onErrorFunction();
      Ti.API.info("ERROR " + e.error);
      alert(e.error); 
      Ti.App.xhr.abort();
    };
    Ti.App.xhr.open(action, Travelerserv.url + url + "." + format);
    Ti.App.xhr.setRequestHeader(
        'Authorization', 
        'Basic ' + Ti.Utils.base64encode(CurrentParticipant.getEmail()+':'+CurrentParticipant.getPassword()));
    return Ti.App.xhr.send(params);
  },
  recordTravelFix: function(longitude, latitude, altitude, speed, accuracy, positioningMethod, onLoadFunction, onErrorFunction) {  
    params = {
      'travel_fix[latitude]': latitude, 
      'travel_fix[longitude]': longitude, 
      'travel_fix[altitude]': altitude, 
      'travel_fix[speed]': speed, 
      'travel_fix[accuracy]': accuracy, 
      'travel_fix[positioning_method]': positioningMethod,
      'device[identification]': Ti.Platform.id,
      'device[kind]': Ti.Platform.name,
      'device[name]': Ti.Platform.model
    };

    Travelerserv.request("POST", "travel_fixes", params, onLoadFunction, onErrorFunction);
  }
};