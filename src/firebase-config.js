import firebase from 'firebase/app';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: '<your-api-key>',
    authDomain: '<your-auth-domain>',
    databaseURL: '<your-database-url>',
    storageBucket: 'gs://webapp-58cc8.appspot.com/'
  };
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  export {

    storage,firebase as default
  }