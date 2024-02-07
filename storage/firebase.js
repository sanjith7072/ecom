const admin = require('firebase-admin');
//const serviceAccount = require("C:\\Users\\sanju\\Downloads\\node-crud.json");
const serviceAccount = require('./node-crud.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "node-crud-d5f9d.appspot.com", // Replace with your Firebase Storage bucket URL
});

module.exports = admin;
