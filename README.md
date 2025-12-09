# 🍱 FoodConnect - Reduce Food Wastage, Share Food, Save Lives

A modern web application that connects donors of excess food with nearby receivers in real-time, using location-based matching similar to ride-booking services.

## ✨ Features

### For Donors
- **Quick Donation Posting**: Add food details (type, quantity, image, pickup time)
- **Real-Time Notifications**: Get notified when someone books your food
- **Donation Tracking**: Monitor status of all donations (Pending → Booked → Collected)
- **Impact Dashboard**: See total food donated and community impact
- **Location Services**: Auto-fetch location with manual edit option

### For Receivers
- **Discover Nearby Food**: Find available food within 3-15 km radius
- **Real-Time Updates**: Get instant notifications of new food nearby
- **Booking System**: First-come, first-served food booking
- **Dual View**: List view and Map view for easy navigation
- **Detailed Info**: Food details, donor contact, pickup instructions

### Core Features
- 🔐 **Secure Authentication**: Firebase Auth with email/password
- 📍 **Location-Based Matching**: Haversine formula for accurate distance calculation
- 🗺️ **Map Integration**: Ready for Google Maps API integration
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⭐ **Ratings & Reviews**: Build trust within the community
- 🎯 **Real-Time Updates**: Firestore real-time database subscriptions

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Icons** - Icon library

### Backend & Database
- **Firebase Authentication** - User authentication (free tier)
- **Firestore Database** - NoSQL database (free tier)
- **Firebase Storage** - Image upload storage (free tier)
- **Firebase Realtime Database** - Real-time updates (free tier)

### APIs
- **Google Maps API** - Location and distance calculations (paid but has free tier)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
cd foodconnect
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create a Firestore Database (start in test mode)
   - Create a Storage bucket
   - Copy your Firebase config

4. **Configure Environment Variables**
Create a `.env` file in the root directory:
```
VITE_APP_FIREBASE_API_KEY=YOUR_API_KEY
VITE_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_APP_FIREBASE_APP_ID=YOUR_APP_ID
VITE_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

5. **Run the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
foodconnect/
├── src/
│   ├── components/          # Shared UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── DonationCard.jsx
│   │   └── DonationsMap.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── donor/
│   │   │   ├── DonorDashboard.jsx
│   │   │   └── AddDonation.jsx
│   │   └── receiver/
│   │       ├── ReceiverDashboard.jsx
│   │       └── DonationDetail.jsx
│   │
│   ├── services/             # Firebase & API services
│   │   ├── firebase.js       # Firebase config
│   │   ├── authService.js    # Authentication
│   │   └── donationService.js # Donation & booking logic
│   │
│   ├── utils/                # Utility functions
│   │   └── haversine.js      # Distance calculation
│   │
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # React DOM mount
│   └── index.css             # Global styles + Tailwind
│
├── public/                   # Static assets
├── .env                      # Environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 How to Use

### For Donors
1. Sign up with email and password
2. Select "I'm a Donor" during registration
3. Go to Dashboard → Click "Add New Donation"
4. Fill in food details, upload image, set pickup time
5. Allow location access for automatic location detection
6. Submit donation
7. Track donations in real-time dashboard

### For Receivers
1. Sign up with email and password
2. Select "I'm a Receiver" during registration
3. Allow location access on receiver dashboard
4. Browse available food nearby in list or map view
5. Click on any food to see details
6. Click "Book This Food" to claim it
7. Get donor contact details and pickup instructions

## 🗄️ Database Schema

### Users Collection
```
{
  uid: string,
  name: string,
  email: string,
  phone: string,
  role: "donor" | "receiver",
  address: string,
  location: { latitude: number, longitude: number },
  ratings: array,
  averageRating: number,
  totalDonations: number,
  createdAt: timestamp,
  profileComplete: boolean
}
```

### Donations Collection
```
{
  donorId: string,
  foodType: string,
  quantity: number,
  description: string,
  imageURL: string,
  location: { latitude: number, longitude: number },
  address: string,
  status: "Pending" | "Booked" | "Collected" | "Cancelled",
  receiverId: string (nullable),
  createdAt: timestamp,
  expiresAt: timestamp,
  pickupTime: timestamp
}
```

### Bookings Collection
```
{
  donationId: string,
  receiverId: string,
  status: string,
  bookedAt: timestamp
}
```

## 🔄 Real-Time Matching Logic

1. **Donor posts donation** → System broadcasts notification
2. **Within 3-5 km radius**: Receivers in this range get instant notification
3. **No booking in 5 mins** → Expand radius to 15 km
4. **First receiver to book** → Donation locked, others notified as "Sold Out"
5. **Donor confirms pickup** → Mark as "Collected"

## 🔐 Security Rules

- Food must be less than 12 hours old
- Mobile OTP verification (can be added)
- Optional ID verification for receivers
- Ratings system to prevent misuse
- Donor contact hidden until food is booked

## 🎯 Future Enhancements

- [ ] Mobile app (Android & iOS)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] NGO auto-mode with bulk donations
- [ ] Gamified impact badges
- [ ] AI-based food safety checker
- [ ] Auto-route mapping with Google Maps integration
- [ ] Volunteer pickup option
- [ ] Government/NGO partnerships
- [ ] Reward points system

## 📊 KPIs to Track

- Number of donations per week
- Successful matches per day
- Average time to book donation
- User retention rate
- Community ratings and feedback
- Estimated kg of food waste saved

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Made with ❤️

FoodConnect is built with passion to reduce food wastage and create a more sustainable, compassionate community.

---

**Need Help?** 
- 📧 Email: support@foodconnect.app
- 💬 Discord: [Join our community](https://discord.gg/foodconnect)
- 🐛 Report Issues: [GitHub Issues](https://github.com/foodconnect/app/issues)
