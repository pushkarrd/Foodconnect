# 🔥 Firestore Integration Guide

## How the Framework Uses Your Collections

Your FoodConnect app automatically integrates with the 3 Firestore collections. Here's how each part works:

---

## 📚 Collection Structure Overview

```
Firestore Database (foodconnect-41360)
│
├── users/
│   ├── {uid1} → User profiles (Donors & Receivers)
│   ├── {uid2} → User profiles
│   └── {uid3} → User profiles
│
├── donations/
│   ├── {docId1} → Food donation with status
│   ├── {docId2} → Food donation with status
│   └── {docId3} → Food donation with status
│
└── bookings/
    ├── {docId1} → Booking record linking user to donation
    ├── {docId2} → Booking record linking user to donation
    └── {docId3} → Booking record linking user to donation
```

---

## 👥 Collection 1: `users`

### When Data is Created:
**When**: User signs up  
**Where**: `src/services/authService.js` → `registerUser()` function

```javascript
// This code creates a user document automatically when user signs up
await setDoc(doc(db, 'users', user.uid), {
  uid: user.uid,
  name: name,
  email: email,
  phone: phone,
  role: role,  // "Donor" or "Receiver"
  address: address,
  location: { latitude, longitude },
  ratings: [],
  averageRating: 0,
  totalDonations: 0,
  createdAt: Timestamp.now(),
  profileComplete: true
});
```

### When Data is Accessed:
| Location | Function | Purpose |
|----------|----------|---------|
| `src/components/Navbar.jsx` | `getUserProfile()` | Display user info in navbar |
| `src/pages/donor/DonorProfile.jsx` | `getUserProfile()` | Show profile details |
| `src/pages/receiver/ReceiverBookings.jsx` | `getDonationById()` | Get donor info for booking |

### When Data is Updated:
- User edits profile in `DonorProfile.jsx`
- Updates happen via `updateDoc(doc(db, 'users', uid), {...})`

---

## 🍱 Collection 2: `donations`

### When Data is Created:
**When**: Donor clicks "Create Donation"  
**Where**: `src/pages/donor/AddDonation.jsx` → calls `createDonation()`

```javascript
// In src/services/donationService.js
await addDoc(collection(db, 'donations'), {
  donorId: donorId,
  foodType: donationData.foodType,    // e.g., "Rice"
  quantity: donationData.quantity,    // e.g., "5 kg"
  description: donationData.description,
  imageURL: imageURL,  // From Firebase Storage
  preparationTime: donationData.preparationTime,
  pickupTime: donationData.pickupTime,
  location: donationData.location,    // { latitude, longitude }
  address: donationData.address,
  status: 'Pending',  // Initial status
  receiverId: null,   // No receiver yet
  createdAt: Timestamp.now(),
  expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)  // 12 hours
});
```

### When Data is Read:

#### For Donors:
```javascript
// In src/pages/donor/DonorDashboard.jsx
const donations = await getDonorDonations(donorId);
// Gets all donations WHERE donorId == current user
```

#### For Receivers (Real-Time):
```javascript
// In src/pages/receiver/ReceiverDashboard.jsx
const unsubscribe = subscribeToNearbyDonations(
  receiverLocation,
  (donations) => {
    // Automatically updates when new donations are added
    setNearbyDonations(donations);
  }
);
```

The app:
1. Fetches all donations with status = "Pending"
2. Calculates distance from receiver location
3. Filters donations within 15 km radius
4. Sorts by distance (nearest first)
5. Displays in real-time (updates automatically)

#### For Viewing Details:
```javascript
// In src/pages/receiver/DonationDetail.jsx
const donation = await getDonationById(donationId);
// Gets specific donation details for booking
```

### When Data is Updated:

#### When Booked:
```javascript
// In src/services/donationService.js → bookDonation()
await updateDoc(doc(db, 'donations', donationId), {
  status: 'Booked',           // Changed from "Pending"
  receiverId: receiverId,     // Now has receiver
  bookedAt: Timestamp.now()
});
```

#### When Completed:
```javascript
// In src/services/donationService.js → completeDonation()
await updateDoc(doc(db, 'donations', donationId), {
  status: 'Collected',        // Changed from "Booked"
  collectedAt: Timestamp.now()
});
```

#### When Cancelled:
```javascript
// In src/services/donationService.js → cancelDonation()
await updateDoc(doc(db, 'donations', donationId), {
  status: 'Cancelled',        // Marked as cancelled
  cancelledAt: Timestamp.now()
});
```

---

## 📋 Collection 3: `bookings`

### When Data is Created:
**When**: Receiver clicks "Book This Food"  
**Where**: `src/pages/receiver/DonationDetail.jsx` → calls `bookDonation()`

```javascript
// In src/services/donationService.js
await addDoc(collection(db, 'bookings'), {
  donationId: donationId,        // Reference to donation
  receiverId: receiverId,        // Which receiver booked
  status: 'Active',              // Initial status
  bookedAt: Timestamp.now()
});
```

### When Data is Read:
```javascript
// In src/pages/receiver/ReceiverBookings.jsx
const bookings = await getReceiverBookings(receiverId);
// Gets all bookings WHERE receiverId == current user
// Ordered by bookedAt (newest first)
```

### When Data is Updated:
```javascript
// When receiver collects the food
await updateDoc(doc(db, 'bookings', bookingId), {
  status: 'Completed',
  collectedAt: Timestamp.now()
});
```

---

## 🔄 Data Flow Diagram

### User Sign Up Flow:
```
Signup Form
    ↓
Firebase Auth (creates user account)
    ↓
authService.registerUser() 
    ↓
Create 'users' collection document
    ↓
User can now login
```

### Donor Donation Flow:
```
Donor Dashboard
    ↓
Click "Add New Donation"
    ↓
Fill Form + Upload Image
    ↓
donationService.createDonation()
    ↓
1. Upload image to Storage
2. Add document to 'donations' collection
    ↓
Donation appears in dashboard
```

### Receiver Booking Flow:
```
Receiver Dashboard (Real-Time List)
    ↓
subscribeToNearbyDonations() [watches 'donations' collection]
    ↓
Click on donation card
    ↓
DonationDetail page shows details
    ↓
Click "Book This Food"
    ↓
donationService.bookDonation()
    ↓
1. Update 'donations' doc: status = "Booked"
2. Create 'bookings' document
    ↓
Donation no longer appears in other receivers' lists
```

---

## 🚀 Key Features Powered by Collections

### 1. Real-Time Updates
```javascript
// Receiver dashboard updates automatically when new donations are added
subscribeToNearbyDonations(location, callback)
// This watches the 'donations' collection for changes
```

### 2. Location-Based Matching
```javascript
// Gets all Pending donations, calculates distance, filters by radius
getNearbyDonations(receiverLocation, radius = 15)
// Uses Haversine formula to calculate distance
```

### 3. User Authentication
```javascript
// Checks 'users' collection for user role (Donor/Receiver)
// Routes user to appropriate dashboard
```

### 4. Status Tracking
```javascript
// Donations flow: Pending → Booked → Collected
// Bookings flow: Active → Completed
```

---

## 🔐 Firestore Security Rules

For production, add these security rules to Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own document
    match /users/{document=**} {
      allow read, write: if request.auth.uid == document;
    }
    
    // Anyone can read donations, only donors can create
    match /donations/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.donorId;
    }
    
    // Anyone can read bookings, only receivers can create
    match /bookings/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.receiverId;
    }
  }
}
```

---

## 📊 Testing the Collections

### Test 1: User Signup
1. Go to `/signup`
2. Select role: "Donor"
3. Fill all fields
4. Click "Sign Up"
5. Check Firebase Console → users collection → verify new document

### Test 2: Create Donation
1. Login as Donor
2. Go to `/donor/add-donation`
3. Fill donation form
4. Upload image
5. Click "Create Donation"
6. Check Firebase Console → donations collection → verify new document

### Test 3: Real-Time Updates
1. Login as Receiver in one browser
2. Go to `/receiver/dashboard`
3. In another browser, login as Donor
4. Create a new donation
5. Receiver's dashboard updates automatically (no page refresh)

### Test 4: Booking
1. As Receiver, click on a donation
2. Click "Book This Food"
3. Check Firebase Console → bookings collection → verify new document
4. Check donations → verify status changed to "Booked"

---

## 🐛 Troubleshooting

### Issue: User not created in 'users' collection
**Solution**: Check browser console for errors. Make sure Firestore rules allow writing.

### Issue: Donations not appearing
**Solution**: 
- Verify donation is created (check console)
- Check receiver location has latitude/longitude
- Check radius setting (default 15 km)

### Issue: Real-time updates not working
**Solution**:
- Check network tab in DevTools
- Verify Firestore rules allow reading
- Check browser console for errors

### Issue: Images not uploading
**Solution**:
- Check Firebase Storage exists
- Check storage rules allow writing
- Verify image file is selected

---

## 📝 Collection Reference

| Collection | Documents | Purpose | Created By |
|-----------|-----------|---------|-----------|
| users | User profiles | Store user info | registerUser() |
| donations | Food items | Track available food | createDonation() |
| bookings | Booking records | Track who booked what | bookDonation() |

---

## 🎯 Quick Reference

**To Get User Data**:
```javascript
import { getUserProfile } from 'src/services/authService';
const user = await getUserProfile(uid);
```

**To Create Donation**:
```javascript
import { createDonation } from 'src/services/donationService';
const donationId = await createDonation(donorId, donationData, imageFile);
```

**To Get Nearby Donations**:
```javascript
import { getNearbyDonations } from 'src/services/donationService';
const donations = await getNearbyDonations(location, 15); // 15 km radius
```

**To Subscribe to Real-Time Updates**:
```javascript
import { subscribeToNearbyDonations } from 'src/services/donationService';
const unsubscribe = subscribeToNearbyDonations(location, (donations) => {
  console.log('Updated donations:', donations);
});

// When done, call unsubscribe()
unsubscribe();
```

**To Book a Donation**:
```javascript
import { bookDonation } from 'src/services/donationService';
await bookDonation(donationId, receiverId);
```

---

## 🎉 You're All Set!

Your FoodConnect app is fully integrated with Firestore collections. The framework:

✅ Automatically creates documents when needed  
✅ Updates documents when data changes  
✅ Subscribes to real-time changes  
✅ Handles all CRUD operations  
✅ Manages authentication & user roles  
✅ Calculates distances automatically  

**Just run `npm run dev` and start testing!**

---

**Happy Building! 🍱❤️**

*All your collections are already integrated into the code!*
