import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import AddDonation from './pages/donor/AddDonation';

// Receiver Pages
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import DonationDetail from './pages/receiver/DonationDetail';
import ReceiverBookings from './pages/receiver/ReceiverBookings';

// Profile Pages
import DonorProfile from './pages/donor/DonorProfile';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRole = localStorage.getItem('userRole') || 'donor';
        if (requiredRole && userRole !== requiredRole) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Donor Routes */}
            <Route
              path="/donor/dashboard"
              element={
                <ProtectedRoute requiredRole="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/add-donation"
              element={
                <ProtectedRoute requiredRole="donor">
                  <AddDonation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/profile"
              element={
                <ProtectedRoute requiredRole="donor">
                  <DonorProfile />
                </ProtectedRoute>
              }
            />

            {/* Receiver Routes */}
            <Route
              path="/receiver/dashboard"
              element={
                <ProtectedRoute requiredRole="receiver">
                  <ReceiverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receiver/donation/:donationId"
              element={
                <ProtectedRoute requiredRole="receiver">
                  <DonationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receiver/bookings"
              element={
                <ProtectedRoute requiredRole="receiver">
                  <ReceiverBookings />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
