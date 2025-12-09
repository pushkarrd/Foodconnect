# 🔥 Firestore Collections Setup Guide

## Quick Setup in Firebase Console

Follow these exact steps to create your collections in Firebase.

---

## Step 1: Create `users` Collection

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project
2. Click **Firestore Database** (left sidebar)
3. Click **Create Collection**
4. Collection ID: **`users`**
5. Document ID: Click "Auto ID" for now (it will be the user UID when you sign up)
6. Add these fields:

| Field Name | Type | Value |
|-----------|------|-------|
| uid | String | (auto-filled on signup) |
| name | String | (auto-filled on signup) |
| email | String | (auto-filled on signup) |
| phone | String | (auto-filled on signup) |
| role | String | "Donor" or "Receiver" |
| address | String | (auto-filled on signup) |
| location | Map | { latitude: 0, longitude: 0 } |
| ratings | Array | [] |
| averageRating | Number | 0 |
| totalDonations | Number | 0 |
| createdAt | Timestamp | (auto-filled on signup) |
| profileComplete | Boolean | true |

7. Click **Save**

✅ **users collection created!**

---

## Step 2: Create `donations` Collection

1. Click **Create Collection** again
2. Collection ID: **`donations`**
3. Document ID: Click "Auto ID"
4. Add these fields:

| Field Name | Type | Value |
|-----------|------|-------|
| donorId | String | (auto-filled when creating donation) |
| foodType | String | "Rice", "Bread", etc. |
| quantity | String | "5 kg", "2 plates", etc. |
| description | String | Additional details |
| imageURL | String | URL from Firebase Storage |
| preparationTime | String | Time when food was prepared |
| pickupTime | String | When receiver can pick up |
| location | Map | { latitude: 0, longitude: 0 } |
| address | String | Full address |
| status | String | "Pending", "Booked", "Collected", "Cancelled" |
| receiverId | String | null (filled when booked) |
| createdAt | Timestamp | (auto-filled) |
| expiresAt | Timestamp | (12 hours from creation) |
| bookedAt | Timestamp | null (filled when booked) |
| collectedAt | Timestamp | null (filled when collected) |
| cancelledAt | Timestamp | null (filled if cancelled) |

5. Click **Save**

✅ **donations collection created!**

---

## Step 3: Create `bookings` Collection

1. Click **Create Collection** again
2. Collection ID: **`bookings`**
3. Document ID: Click "Auto ID"
4. Add these fields:

| Field Name | Type | Value |
|-----------|------|-------|
| donationId | String | (ID of donation being booked) |
| receiverId | String | (ID of user booking) |
| status | String | "Active", "Completed", "Cancelled" |
| bookedAt | Timestamp | (when booking was made) |

5. Click **Save**

✅ **bookings collection created!**

---

## 🎯 Final Structure in Firebase Console

You should now see in Firestore:

```
Firestore Database
├── users (collection)
│   └── [documents will appear after signup]
│
├── donations (collection)
│   └── [documents will appear after donors create donations]
│
└── bookings (collection)
    └── [documents will appear after receivers book donations]
```

---

## ✅ Verification Checklist

- [ ] `users` collection created
- [ ] `donations` collection created
- [ ] `bookings` collection created
- [ ] All fields added to each collection
- [ ] Field types match the table above

---

## 🚀 Now What?

Your collections are ready! The framework will automatically:

1. **On User Signup**: Create a document in `users` collection
2. **On Create Donation**: Create a document in `donations` collection
3. **On Book Donation**: Create a document in `bookings` collection
4. **On Status Change**: Update documents automatically

**Just run `npm run dev` and test the app!**

---

## 📊 What Each Collection Does

### `users` Collection
- Stores user profiles (name, email, phone, address)
- Stores location for distance calculations
- Tracks user ratings and donation statistics
- Updated when user edits profile

### `donations` Collection
- Stores food donations by donors
- Includes location, image, and expiry time
- Status changes: Pending → Booked → Collected
- Real-time updates to receivers' dashboards

### `bookings` Collection
- Records when receivers book donations
- Links donation to receiver
- Tracks booking status and timestamp
- Used to show "My Bookings" page

---

## 🔐 Security Rules (Optional)

For production, go to **Firestore → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{document=**} {
      allow read, write: if request.auth.uid == document;
    }
    match /donations/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.donorId;
    }
    match /bookings/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.receiverId;
    }
  }
}
```

Then click **Publish**

---

## 🎓 Learn More

For detailed integration info, read: **FIRESTORE_INTEGRATION.md**

---

**Collections ready? Start the app with: `npm run dev`** 🚀

*Turn excess food into community support* 🍱❤️
