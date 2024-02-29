import { UserCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const checkUserProfile = async (user: UserCredential) => {
  try {
    const userRef = doc(db, 'users', user.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return 'exist profile';
    } else {
      await setDoc(doc(db, 'users', user.user.uid), {
        uid: user.user.uid,
        name: user.user.displayName,
        email: user.user.email,
        photoUrl: user.user.photoURL,
      });

      return 'create profile';
    }
  } catch (e) {
    console.log(e);
  }
};
