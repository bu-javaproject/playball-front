import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCjpHQHIJ_egOiC1qL8ZYimPdv8xBilRhs",
    authDomain: "playball-64e58.firebaseapp.com",
    projectId: "playball-64e58",
    storageBucket: "playball-64e58.firebasestorage.app",
    messagingSenderId: "1028004018294",
    appId: "1:1028004018294:web:421f10d2a48421221d0757",
    measurementId: "G-TNJWZ3NGWW"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

getToken(messaging, { vapidKey: 'BHwnPQpeTu7DxZYXVgChqJgnnEePxsUqj4zpZqHDXEzq2BgdovhApy2bqV8VpBhjRLmdOYBn_XtmywAQuKuXFoo' }).then(token => {
    console.log('FCM Token:', token);
});
