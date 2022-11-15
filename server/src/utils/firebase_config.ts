const firebaseConfig = {
  apiKey:
    process.env.FIREBASE_API_KEY || "AIzaSyB8Xcl4RUxxjnGdA8FwfQ2LymTX_Y3mi4M",
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || "lf-pactitioner-mgmt.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "lf-pactitioner-mgmt",
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || "lf-pactitioner-mgmt.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "973876095760",
  appId:
    process.env.FIREBASE_APP_ID ||
    "1:process.env.FIREBASE_1 || 973876095760:web:ffb9d1327f0ac9ccc69395",
};

export default firebaseConfig;
