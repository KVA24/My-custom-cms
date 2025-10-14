// public/firebase-messaging-sw.js
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDBYPFdkOZSCsuYj-LGv_kESs3FEG2mjtw",
  authDomain: "smartgate-web-notification.firebaseapp.com",
  projectId: "smartgate-web-notification",
  storageBucket: "smartgate-web-notification.firebasestorage.app",
  messagingSenderId: "87280168876",
  appId: "1:87280168876:web:59414547c1a3427b3e1409",
  measurementId: "G-27YDJDHWJ4",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});
