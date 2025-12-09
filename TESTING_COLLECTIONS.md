# 🧪 Collection Testing Guide

## Testing Your Firestore Collections

After you create the collections and run `npm run dev`, follow these steps to verify everything works.

---

## Test 1: User Signup (Creates `users` collection doc)

### Steps:
1. Open http://localhost:3000
2. Click **Sign Up**
3. Fill the form:
   - Name: "John Donor"
   - Email: "donor@test.com"
   - Password: "password123"
   - Phone: "9876543210"
   - Address: "123 Main St, City"
   - Allow location access (for coordinates)
   - Role: Select **"I'm a Donor (Share Food)"**
4. Click **Sign Up**

### Expected Results:
✅ User redirected to `/donor/dashboard`  
✅ New document created in `users` collection with:
- uid: (auto-generated Firebase user ID)
- name: "John Donor"
- email: "donor@test.com"
- phone: "9876543210"
- role: "Donor"
- location: { latitude: X, longitude: Y }
- createdAt: (current timestamp)

### How to Verify in Firebase Console:
1. Go to Firebase Console → Firestore Database
2. Click on `users` collection
3. Should see 1 document with ID = user's UID
4. Click document to see all fields

---

## Test 2: Create Donation (Creates `donations` collection doc)

### Steps:
1. Login as donor (use email from Test 1)
2. Click **"Add New Donation"**
3. Fill the form:
   - Food Type: Select **"Cooked Meal"**
   - Quantity: **"5 Plates"**
   - Description: **"Fresh biryani, cooked today"**
   - Preparation Time: (auto-filled)
   - Pickup Time: Select a time
   - Upload Image: Choose any food image
   - Location: Use auto-detect or manual
4. Click **"Create Donation"**

### Expected Results:
✅ See success message  
✅ Redirected to donor dashboard  
✅ Donation appears in "Your Donations" list  
✅ New document created in `donations` collection with:
- donorId: (your user ID)
- foodType: "Cooked Meal"
- quantity: "5 Plates"
- description: "Fresh biryani, cooked today"
- imageURL: (Firebase Storage URL)
- status: "Pending"
- location: { latitude: X, longitude: Y }
- createdAt: (current timestamp)
- expiresAt: (12 hours from now)
- receiverId: null (no receiver yet)

### How to Verify in Firebase Console:
1. Go to Firebase Console → Firestore Database
2. Click on `donations` collection
3. Should see 1 document
4. Verify all fields match what you entered
5. Check `imageURL` field has a valid Storage URL

---

## Test 3: Receiver Signup & See Donations

### Steps:
1. Open new incognito window (or logout)
2. Go to http://localhost:3000
3. Click **Sign Up**
4. Fill the form:
   - Name: "Jane Receiver"
   - Email: "receiver@test.com"
   - Password: "password123"
   - Phone: "9876543211"
   - Address: "456 Oak St, City"
   - Allow location access
   - Role: Select **"I'm a Receiver (Need Food)"**
5. Click **Sign Up**

### Expected Results:
✅ New document created in `users` collection for receiver  
✅ Redirected to `/receiver/dashboard`  
✅ Should see the donation you created earlier in the list
✅ Shows distance from donation (e.g., "2.5 km away")

### How to Verify in Firebase Console:
1. Go to `users` collection
2. Should see 2 documents (donor + receiver)
3. Both have proper role and location fields

---

## Test 4: Book a Donation (Creates `bookings` collection doc)

### Steps:
1. Stay logged in as receiver
2. Click on the donation card from the donor
3. You should see donation details
4. Click **"Book This Food"**

### Expected Results:
✅ See success message  
✅ Button changes or becomes disabled  
✅ New document created in `bookings` collection with:
- donationId: (ID of the donation you booked)
- receiverId: (your user ID)
- status: "Active"
- bookedAt: (current timestamp)

### Changes in `donations` collection:
✅ Document status changes from "Pending" → "Booked"  
✅ receiverId field now has your ID  
✅ bookedAt timestamp is set

### How to Verify in Firebase Console:
1. Go to `bookings` collection
2. Should see 1 document
3. Verify donationId and receiverId match
4. Go to `donations` collection
5. Check status changed to "Booked" and receiverId is set

---

## Test 5: View My Bookings

### Steps:
1. Stay logged in as receiver
2. Click **"My Bookings"** in navigation
3. You should see the donation you just booked

### Expected Results:
✅ Shows the food item you booked  
✅ Shows "Active" status  
✅ Shows booking date/time  
✅ Can see donor's contact info (if booking confirmed)

---

## Test 6: Real-Time Updates

### Steps:
1. **Browser 1**: Login as Receiver → Go to Dashboard
2. **Browser 2**: Login as Donor (different email) → Create a new donation
3. **Watch Browser 1**: Dashboard should update automatically (no page refresh needed)

### Expected Results:
✅ New donation appears in Receiver's dashboard instantly  
✅ Shows correct distance  
✅ Can be booked immediately

### How to Verify:
- Check Browser 1 console (F12) - no errors
- No manual page refresh needed
- Real-time update happens within 1-2 seconds

---

## Test 7: Image Upload

### Steps:
1. Login as Donor
2. Go to "Add Donation"
3. Select an image file
4. Create donation

### Expected Results:
✅ Image is uploaded to Firebase Storage  
✅ In `donations` document, `imageURL` field contains valid URL  
✅ Image displays in donation card on receiver's dashboard

### How to Verify in Firebase Console:
1. Go to Storage (left sidebar)
2. Open `donations` folder
3. Should see image file with timestamp name
4. Click file → copy download URL
5. Paste in browser → should show your image

---

## Test 8: Check All Fields

### Open Firebase Console → Firestore

#### `users` Collection Sample:
```
Document ID: abc123xyz (user UID)
{
  uid: "abc123xyz",
  name: "John Donor",
  email: "donor@test.com",
  phone: "9876543210",
  role: "Donor",
  address: "123 Main St, City",
  location: {
    latitude: 28.6139,
    longitude: 77.2090
  },
  ratings: [],
  averageRating: 0,
  totalDonations: 1,
  createdAt: timestamp,
  profileComplete: true
}
```

#### `donations` Collection Sample:
```
Document ID: donation123
{
  donorId: "abc123xyz",
  foodType: "Cooked Meal",
  quantity: "5 Plates",
  description: "Fresh biryani",
  imageURL: "https://storage.googleapis.com/...",
  preparationTime: "2025-12-10T14:30:00",
  pickupTime: "2025-12-10T15:00:00",
  location: {
    latitude: 28.6139,
    longitude: 77.2090
  },
  address: "123 Main St, City",
  status: "Booked",
  receiverId: "def456uvw",
  createdAt: timestamp,
  expiresAt: timestamp,
  bookedAt: timestamp
}
```

#### `bookings` Collection Sample:
```
Document ID: booking456
{
  donationId: "donation123",
  receiverId: "def456uvw",
  status: "Active",
  bookedAt: timestamp
}
```

---

## ✅ Testing Checklist

- [ ] Test 1: Signup as Donor → user document created
- [ ] Test 2: Create donation → donations document created
- [ ] Test 3: Signup as Receiver → can see donations
- [ ] Test 4: Book donation → bookings document created + donation status updated
- [ ] Test 5: View bookings → shows booked donations
- [ ] Test 6: Real-time updates → changes appear instantly
- [ ] Test 7: Image upload → stored in Firebase Storage
- [ ] Test 8: All fields → match expected structure

---

## 🐛 Troubleshooting

### Collections don't appear in Firestore
**Solution**: 
- Verify collections are created in Firebase Console
- Run the test again, make sure to complete signup/donation

### Data not appearing after action
**Solution**:
- Check browser console (F12) for errors
- Verify Firestore rules allow writing
- Refresh page manually

### Real-time updates not working
**Solution**:
- Check network tab (no errors)
- Verify Firestore rules allow reading
- Check browser console for subscription errors

### Image not uploading
**Solution**:
- Verify Storage bucket exists
- Check Storage rules allow writing
- Try a smaller image file

### Location showing as null
**Solution**:
- Allow browser location permission when prompted
- Or enter coordinates manually in form

---

## 📊 Quick Verification Command

Open Firebase Console and run in browser console:

```javascript
// List all users
db.collection("users").get().then(snap => {
  console.log("Users:", snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data()));
});

// List all donations
db.collection("donations").get().then(snap => {
  console.log("Donations:", snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data()));
});

// List all bookings
db.collection("bookings").get().then(snap => {
  console.log("Bookings:", snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data()));
});
```

---

## 🎉 All Tests Passed?

If all 8 tests pass, your Firestore collections are working perfectly with the framework!

**Next Steps:**
- ✅ Explore other features
- ✅ Test on mobile
- ✅ Customize styling
- ✅ Deploy to production

---

**Happy Testing! 🚀**

*All collections integrated and working!* 🍱❤️
