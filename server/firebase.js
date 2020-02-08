//FCM WEB PUSH SETTINGS
let admin = require('firebase-admin');
let serviceAccount = require("./firebase_push.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: "https://ad-network-1791.firebaseio.com"
  databaseURL: "https://ad-network-a6a24.firebaseio.com"
});

let auth = admin.auth();
let database = admin.database();
// Get the Messaging service for the default app
let msg = admin.messaging();
module.exports = { 
	admin,
	auth,
	database,
	msg,
}