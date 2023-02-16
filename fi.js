const {initializeApp} = require('firebase/app')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXFxlFAGVbd2rb_tSjgcRRbZCl6XOL6vo", 
    authDomain: "mahim-bc341.firebaseapp.com", 
    projectId: "mahim-bc341", 
    storageBucket: "mahim-bc341.appspot.com",  
    messagingSenderId: "878136765730",  
    appId: "1:878136765730:web:9374840d7adf96ea9bc97b"
};


// Initialize Firebase
const App = initializeApp(firebaseConfig);
module.exports = {
    App, 
}