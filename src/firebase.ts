import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBuTyrVGhZbWpae3if7e2wg4ugsEEfAPe8',
  authDomain: 'xxx-firebase-e4347.firebaseapp.com',
  projectId: 'xxx-firebase-e4347',
  storageBucket: 'xxx-firebase-e4347.appspot.com',
  messagingSenderId: '835407103851',
  appId: '1:835407103851:web:6f25ae7f511ee3bd0f2e2e',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
