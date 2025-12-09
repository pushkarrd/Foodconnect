# 📁 FoodConnect Project Structure Guide

## Complete Directory Organization

```
foodconnect/
│
├── 📂 src/
│   ├── 📂 components/           # Reusable UI Components
│   │   ├── Navbar.jsx           # Navigation bar with auth check
│   │   ├── Footer.jsx           # Application footer
│   │   ├── DonationCard.jsx     # Card component for donations
│   │   └── DonationsMap.jsx     # Map view component (Google Maps integration)
│   │
│   ├── 📂 pages/
│   │   ├── Home.jsx             # Landing page with intro, features, testimonials
│   │   │
│   │   ├── 📂 auth/             # Authentication Pages
│   │   │   ├── Login.jsx        # User login page
│   │   │   └── Signup.jsx       # User registration page
│   │   │
│   │   ├── 📂 donor/            # Donor Dashboard & Features
│   │   │   ├── DonorDashboard.jsx   # Main donor dashboard
│   │   │   ├── AddDonation.jsx      # Form to add new donation
│   │   │   └── DonorProfile.jsx     # Donor profile & edit profile
│   │   │
│   │   └── 📂 receiver/         # Receiver Dashboard & Features
│   │       ├── ReceiverDashboard.jsx    # Main receiver dashboard
│   │       ├── DonationDetail.jsx       # Donation details & booking
│   │       └── ReceiverBookings.jsx     # View booked donations
│   │
│   ├── 📂 services/             # API & Database Services
│   │   ├── firebase.js          # Firebase initialization & config
│   │   ├── authService.js       # Auth functions (register, login, logout)
│   │   └── donationService.js   # Donation CRUD & matching logic
│   │
│   ├── 📂 utils/                # Utility Functions
│   │   └── helpers.js           # Helpers (distance calc, formatters, validators)
│   │
│   ├── App.jsx                  # Main App component with routing
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Global styles + Tailwind directives
│
├── 📂 public/                   # Static assets
│
├── Configuration Files
│   ├── index.html               # HTML entry point
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── package.json             # Dependencies & scripts
│   ├── .env                     # Environment variables (Firebase & Maps API)
│   ├── .gitignore               # Git ignore rules
│   └── README.md                # Project documentation
│
└── PROJECT_STRUCTURE.md         # This file
```

---

## 📖 File-by-File Guide

### **Core Files**

#### `src/App.jsx` - Main Application Router
- Handles all routing for the application
- Implements ProtectedRoute component for authentication
- Routes for public pages (Home, Login, Signup)
- Routes for donor features (Dashboard, AddDonation, Profile)
- Routes for receiver features (Dashboard, DonationDetail, Bookings)
- Manages authentication state check

#### `src/main.jsx` - React Entry Point
- Mounts React application to DOM
- Imports and renders App component

---

### **Authentication Pages** (`src/pages/auth/`)

#### `Login.jsx`
- Email and password login form
- Firebase authentication
- Stores user role in localStorage
- Redirects to appropriate dashboard after login
- Error handling and loading states

#### `Signup.jsx`
- User registration form
- Fields: Name, Email, Phone, Address, Role (Donor/Receiver), Password
- Firebase user creation
- Firestore user profile creation
- Role selection during signup
- Password validation and confirmation

---

### **Donor Pages** (`src/pages/donor/`)

#### `DonorDashboard.jsx`
- Main donor dashboard
- Statistics cards (Total, Pending, Completed donations)
- Quick action buttons
- List of all donor's donations with status
- Uses DonationCard component for display
- Loading and empty states

#### `AddDonation.jsx`
- Form to create new food donation
- Fields:
  - Food Type (dropdown with 8 options)
  - Quantity (in servings)
  - Description (optional)
  - Pickup Time (datetime picker)
  - Food Image (upload)
  - Address (editable)
  - Location (auto-detected via GPS)
- Image upload to Firebase Storage
- Real-time location detection with manual override
- Form validation and error handling

#### `DonorProfile.jsx`
- View donor profile information
- Edit mode for updating details
- Display statistics (donations, rating)
- Shows joined date and impact metrics
- Edit Name, Phone, Address
- Save changes to Firestore

---

### **Receiver Pages** (`src/pages/receiver/`)

#### `ReceiverDashboard.jsx`
- Main receiver dashboard
- Real-time donation feed near location
- List and Map view toggle
- Location-based filtering (3-5 km initial, up to 15 km)
- Real-time updates via Firestore subscriptions
- Geolocation detection with refresh button
- Uses DonationCard component
- Empty state handling

#### `DonationDetail.jsx`
- Detailed view of a single donation
- Food image, type, quantity
- Donor information (visible after booking)
- Distance from receiver
- Pickup time and address
- Book donation button
- Status display (Pending, Booked, Collected)
- Donor contact information management
- Navigation and back button

#### `ReceiverBookings.jsx`
- View all received bookings
- Shows donation details for each booking
- Displays donor contact information
- Booking status and date
- Links to view full donation details
- Enriched data from multiple collections
- Empty state with CTA

---

### **Components** (`src/components/`)

#### `Navbar.jsx`
- Navigation header with logo
- Responsive mobile menu
- Login/Signup links for public users
- User profile and logout for authenticated users
- Displays user email/name
- Mobile hamburger menu

#### `Footer.jsx`
- Application footer
- Quick links
- Social media links
- Privacy and terms links
- Contact information
- Company branding

#### `DonationCard.jsx`
- Reusable donation card component
- Displays food image, type, quantity
- Status badge with color coding
- Distance from user
- Pickup time
- Food description snippet
- Click-to-view button
- Food emoji icons for visual appeal

#### `DonationsMap.jsx`
- Map view component
- Placeholder for Google Maps API integration
- Instructions for enabling map
- Fallback list view of donations
- Ready for Google Maps integration

---

### **Services** (`src/services/`)

#### `firebase.js` - Firebase Configuration
- Initializes Firebase app
- Exports auth instance
- Exports Firestore db instance
- Exports Storage instance
- Exports Realtime DB instance
- Uses environment variables for config

#### `authService.js` - Authentication Service
- `registerUser()` - Create new user account and profile
- `loginUser()` - Login with email/password
- `logoutUser()` - Logout user
- `getUserProfile()` - Fetch user profile from Firestore
- Handles Firestore user document creation
- Firebase Auth error handling

#### `donationService.js` - Donation & Booking Service
- `createDonation()` - Add new food donation
- `getNearbyDonations()` - Find donations by distance
- `bookDonation()` - Lock donation for receiver
- `completeDonation()` - Mark as collected
- `cancelDonation()` - Cancel donation
- `getDonationById()` - Fetch single donation
- `getDonorDonations()` - Get all donations by donor
- `getReceiverBookings()` - Get receiver's bookings
- `calculateDistance()` - Haversine formula implementation
- `subscribeToNearbyDonations()` - Real-time subscription

---

### **Utilities** (`src/utils/`)

#### `helpers.js` - Helper Functions
- `calculateDistance()` - Haversine formula for GPS distances
- `formatDate()` - Convert timestamps to readable dates
- `getTimeDifference()` - Show "5m ago" style timestamps
- `isValidEmail()` - Email validation regex
- `isValidPhone()` - Phone validation (Indian format)

---

### **Styles** (`src/index.css`)
- Tailwind CSS imports
- Global utility classes
  - `.btn` - Button base styles
  - `.btn-primary` - Green button
  - `.btn-secondary` - Amber button
  - `.btn-outline` - Outline button
  - `.card` - Card component styles
  - `.input-field` - Input styling
  - `.badge-*` - Status badges (success, warning, danger, gray)
- Global font family (Poppins)
- Body background color

---

## 🔄 Data Flow & Routing

### **Public Routes**
```
/ → Home (Landing Page)
/login → Login Page
/signup → Signup Page
```

### **Donor Routes** (Protected)
```
/donor/dashboard → Donor Dashboard
/donor/add-donation → Add Donation Form
/donor/profile → Donor Profile & Edit
```

### **Receiver Routes** (Protected)
```
/receiver/dashboard → Receiver Dashboard
/receiver/donation/:donationId → Donation Details
/receiver/bookings → Booked Donations List
```

---

## 🗄️ Data Collections in Firestore

### **Users Collection**
```
users/
├── userId/
│   ├── name: string
│   ├── email: string
│   ├── phone: string
│   ├── role: "donor" | "receiver"
│   ├── address: string
│   ├── location: {latitude, longitude}
│   ├── ratings: array
│   ├── averageRating: number
│   ├── totalDonations: number
│   └── createdAt: timestamp
```

### **Donations Collection**
```
donations/
├── donationId/
│   ├── donorId: string
│   ├── foodType: string
│   ├── quantity: number
│   ├── description: string
│   ├── imageURL: string
│   ├── location: {latitude, longitude}
│   ├── address: string
│   ├── status: "Pending" | "Booked" | "Collected" | "Cancelled"
│   ├── receiverId: string (nullable)
│   ├── createdAt: timestamp
│   ├── expiresAt: timestamp
│   └── pickupTime: timestamp
```

### **Bookings Collection**
```
bookings/
├── bookingId/
│   ├── donationId: string
│   ├── receiverId: string
│   ├── status: string
│   └── bookedAt: timestamp
```

---

## 🚀 Key Features Implementation

### **Real-Time Location Matching**
1. Receiver's location → Gets current GPS coordinates
2. System queries all pending donations
3. Haversine formula calculates distance to each
4. Filters donations within 3-5 km (expandable to 15 km)
5. Sorts by closest first
6. Real-time subscription updates

### **Booking System**
1. Receiver clicks "Book This Food"
2. System creates booking record
3. Donation status changes to "Booked"
4. Receiver ID stored in donation
5. Other receivers see "Booked" status
6. Donor gets notification

### **Image Upload**
1. Donor selects image on AddDonation form
2. Image uploaded to Firebase Storage
3. Download URL stored in Firestore
4. Displayed on donation cards and details

---

## 📦 Dependencies

### **Core**
- `react` - UI library
- `react-dom` - React DOM binding
- `react-router-dom` - Client routing

### **Firebase**
- `firebase` - Firebase SDK

### **Styling**
- `tailwindcss` - CSS framework

### **Icons**
- `react-icons` - Icon library

---

## ✅ Checklist for Completion

- [x] Project structure created
- [x] All pages created (Home, Auth, Donor, Receiver)
- [x] Components created (Navbar, Footer, Cards, Map)
- [x] Services setup (Firebase, Auth, Donations)
- [x] Routing configured
- [x] Tailwind CSS integrated
- [x] Environment variables template
- [x] Responsive design implemented
- [x] Real-time updates setup
- [x] Form validations
- [ ] Google Maps API integration (ready for setup)
- [ ] Firebase Cloud Messaging (ready for setup)
- [ ] Database seeding (for demo)
- [ ] Testing suite

---

## 🎯 Next Steps

1. **Setup Firebase Project**
   - Create Firebase project
   - Get credentials
   - Fill .env file

2. **Test All Features**
   - Register donors and receivers
   - Add donations
   - Book donations
   - Test real-time updates

3. **Google Maps Integration**
   - Get API key
   - Install @react-google-maps/api
   - Implement DonationsMap component

4. **Deploy**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or Firebase Hosting

---

**Created**: December 2024
**Version**: 1.0
**Status**: Ready for Firebase Integration
