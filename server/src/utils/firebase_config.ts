const firebaseConfig = {
  apiKey: (process.env.FIREBASE_API_KEY as string).trim(),
  authDomain: (process.env.FIREBASE_AUTH_DOMAIN as string).trim(),
  projectId: (process.env.FIREBASE_PROJECT_ID as string).trim(),
  storageBucket: (process.env.FIREBASE_STORAGE_BUCKET as string).trim(),
  messagingSenderId: (
    process.env.FIREBASE_MESSAGING_SENDER_ID as string
  ).trim(),
  appId: (process.env.FIREBASE_APP_ID as string).trim(),
};

export default firebaseConfig;
