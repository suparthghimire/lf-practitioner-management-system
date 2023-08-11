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
console.log("FC", firebaseConfig);
export default firebaseConfig;

// const firebaseConfig = {
//   apiKey: "AIzaSyCJfPU_ZJRjnjpN00vlMY8uX2YcDgQmvOU",
//   authDomain: "swivt-pms.firebaseapp.com",
//   projectId: "swivt-pms",
//   storageBucket: "swivt-pms.appspot.com",
//   messagingSenderId: "284415632260",
//   appId: "1:284415632260:web:2673718d729ab7748c33d1"
// };
