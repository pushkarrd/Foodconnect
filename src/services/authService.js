import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export const registerUser = async (email, password, name, role, phone, address, location) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const collectionName = role === 'donor' ? 'donors' : 'receivers';
    await setDoc(doc(db, collectionName, user.uid), {
      uid: user.uid,
      name,
      email,
      phone,
      role,
      address,
      location,
      ratings: [],
      averageRating: 0,
      totalDonations: 0,
      createdAt: new Date(),
      profileComplete: true
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserProfile = async (uid, role = null) => {
  try {
    if (role) {
      const collectionName = role === 'donor' ? 'donors' : 'receivers';
      const userDoc = await getDoc(doc(db, collectionName, uid));
      return userDoc.data();
    } else {
      // Try donors first, then receivers
      let userDoc = await getDoc(doc(db, 'donors', uid));
      if (userDoc.exists()) return userDoc.data();
      userDoc = await getDoc(doc(db, 'receivers', uid));
      if (userDoc.exists()) return userDoc.data();
      return null;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async (role) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in either collection
    let userDoc = await getDoc(doc(db, 'donors', user.uid));
    if (userDoc.exists()) return user;

    userDoc = await getDoc(doc(db, 'receivers', user.uid));
    if (userDoc.exists()) return user;

    // If new user, create profile in appropriate collection
    const collectionName = role === 'donor' ? 'donors' : 'receivers';
    await setDoc(doc(db, collectionName, user.uid), {
      uid: user.uid,
      name: user.displayName || 'User',
      email: user.email,
      phone: '',
      role,
      address: '',
      location: { latitude: 0, longitude: 0 },
      profileImage: user.photoURL || '',
      ratings: [],
      averageRating: 0,
      totalDonations: 0,
      createdAt: new Date(),
      profileComplete: false
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
