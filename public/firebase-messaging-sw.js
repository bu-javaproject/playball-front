importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCjpHQHIJ_egOiC1qL8ZYimPdv8xBilRhs",
    authDomain: "playball-64e58.firebaseapp.com",
    projectId: "playball-64e58",
    storageBucket: "playball-64e58.firebasestorage.app",
    messagingSenderId: "1028004018294",
    appId: "1:1028004018294:web:421f10d2a48421221d0757",
    measurementId: "G-TNJWZ3NGWW"
});

const messaging = firebase.messaging();
