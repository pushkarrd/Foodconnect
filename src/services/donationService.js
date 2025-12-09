import { addDoc, collection, query, where, getDocs, updateDoc, doc, getDoc, Timestamp, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const createDonation = async (donorId, donationData) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      donorId,
      foodType: donationData.foodType,
      quantity: donationData.quantity,
      description: donationData.description || '',
      preparationTime: donationData.preparationTime || null,
      pickupTime: donationData.pickupTime,
      location: donationData.location,
      address: donationData.address,
      status: 'Pending',
      receiverId: null,
      createdAt: Timestamp.now(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });

    return docRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getNearbyDonations = async (receiverLocation, radius = 15) => {
  try {
    const allDonationsSnapshot = await getDocs(query(
      collection(db, 'donations'),
      where('status', '==', 'Pending')
    ));

    const donations = [];
    allDonationsSnapshot.forEach((doc) => {
      const donation = doc.data();
      const distance = calculateDistance(
        receiverLocation.latitude,
        receiverLocation.longitude,
        donation.location.latitude,
        donation.location.longitude
      );

      if (distance <= radius) {
        donations.push({
          id: doc.id,
          ...donation,
          distance: distance.toFixed(2)
        });
      }
    });

    return donations.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const bookDonation = async (donationId, receiverId) => {
  try {
    await updateDoc(doc(db, 'donations', donationId), {
      status: 'Booked',
      receiverId,
      bookedAt: Timestamp.now()
    });

    await addDoc(collection(db, 'bookings'), {
      donationId,
      receiverId,
      status: 'Active',
      bookedAt: Timestamp.now()
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const completeDonation = async (donationId) => {
  try {
    await updateDoc(doc(db, 'donations', donationId), {
      status: 'Collected',
      collectedAt: Timestamp.now()
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelDonation = async (donationId) => {
  try {
    await updateDoc(doc(db, 'donations', donationId), {
      status: 'Cancelled',
      cancelledAt: Timestamp.now()
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDonationById = async (donationId) => {
  try {
    const docSnap = await getDoc(doc(db, 'donations', donationId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDonorDonations = async (donorId) => {
  try {
    const q = query(collection(db, 'donations'), where('donorId', '==', donorId));
    const querySnapshot = await getDocs(q);
    const donations = [];
    querySnapshot.forEach((doc) => {
      donations.push({ id: doc.id, ...doc.data() });
    });
    return donations.sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReceiverBookings = async (receiverId) => {
  try {
    const q = query(collection(db, 'bookings'), where('receiverId', '==', receiverId));
    const querySnapshot = await getDocs(q);
    const bookings = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings.sort((a, b) => new Date(b.bookedAt?.toDate?.() || b.bookedAt) - new Date(a.bookedAt?.toDate?.() || a.bookedAt));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const subscribeToNearbyDonations = (receiverLocation, callback, radius = 15) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, 'donations'),
      where('status', '==', 'Pending')
    ),
    (snapshot) => {
      const donations = [];
      snapshot.forEach((doc) => {
        const donation = doc.data();
        const distance = calculateDistance(
          receiverLocation.latitude,
          receiverLocation.longitude,
          donation.location.latitude,
          donation.location.longitude
        );

        if (distance <= radius) {
          donations.push({
            id: doc.id,
            ...donation,
            distance: distance.toFixed(2)
          });
        }
      });

      callback(donations.sort((a, b) => a.distance - b.distance));
    },
    (error) => console.error('Error subscribing to donations:', error)
  );

  return unsubscribe;
};

// Get booked donations for a specific donor (orders received by donor)
export const getDonorBookedOrders = async (donorId) => {
  try {
    const q = query(collection(db, 'donations'), where('donorId', '==', donorId), where('status', '==', 'Booked'));
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get receiver's booked orders (track orders)
export const getReceiverTrackedOrders = async (receiverId) => {
  try {
    const q = query(collection(db, 'donations'), where('receiverId', '==', receiverId), where('status', '==', 'Booked'));
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Subscribe to donor's booked orders in real-time
export const subscribeToDonorBookedOrders = (donorId, callback) => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'donations'), where('donorId', '==', donorId), where('status', '==', 'Booked')),
    (snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    },
    (error) => console.error('Error subscribing to booked orders:', error)
  );
  return unsubscribe;
};

// Subscribe to receiver's tracked orders in real-time
export const subscribeToTrackedOrders = (receiverId, callback) => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'donations'), where('receiverId', '==', receiverId), where('status', '==', 'Booked')),
    (snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    },
    (error) => console.error('Error subscribing to tracked orders:', error)
  );
  return unsubscribe;
};
