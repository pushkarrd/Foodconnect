import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNearbyDonations, subscribeToNearbyDonations } from '../../services/donationService';
import { getUserProfile } from '../../services/authService';
import { auth } from '../../services/firebase';
import { FaMapMarkerAlt, FaList, FaMap, FaBox, FaUser, FaEnvelope, FaPhone, FaArrowDown } from 'react-icons/fa';
import DonationCard from '../../components/DonationCard';
import DonationsMap from '../../components/DonationsMap';

export default function ReceiverDashboard() {
  const [donations, setDonations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [locationLoading, setLocationLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid, 'receiver');
        setUserProfile(profile);
      }
    };
    fetchProfile();
    getLocation();
  }, []);

  useEffect(() => {
    if (location.latitude !== 0) {
      let unsubscribe;
      try {
        unsubscribe = subscribeToNearbyDonations(location, (nearbyDonations) => {
          setDonations(nearbyDonations);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error subscribing to donations:', error);
        setLoading(false);
      }

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [location]);

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Receiver Dashboard</h1>
          <p className="text-blue-100 flex items-center gap-2">
            <FaMapMarkerAlt /> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b bg-white sticky top-0 z-10">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 px-4 font-semibold transition flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            <FaMap /> Browse Food
          </button>
          <button
            onClick={() => {
              setActiveTab('bookings');
              navigate('/receiver/bookings');
            }}
            className={`pb-3 px-4 font-semibold transition flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            <FaBox /> My Bookings
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setViewMode('list')}
            className={`btn flex items-center gap-2 ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
          >
            <FaList /> List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn flex items-center gap-2 ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
          >
            <FaMap /> Map View
          </button>
          <button
            onClick={getLocation}
            disabled={locationLoading}
            className="btn btn-secondary ml-auto"
          >
            {locationLoading ? 'Getting Location...' : 'Refresh Location'}
          </button>
        </div>

        {/* Browse Tab Content */}
        {activeTab === 'browse' && (
          <>
            {/* Content */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 mt-4">Finding food near you...</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No food available nearby at the moment</p>
                <p className="text-gray-500">Check back soon or expand your search radius</p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map(donation => (
                  <DonationCard key={donation.id} donation={donation} userRole="receiver" />
                ))}
              </div>
            ) : (
              <DonationsMap donations={donations} userLocation={location} />
            )}
          </>
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && userProfile && (
          <div className="max-w-2xl">
            <div className="card">
              {/* Profile Header */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b">
                <div>
                  {auth.currentUser?.photoURL ? (
                    <img
                      src={auth.currentUser.photoURL}
                      alt={userProfile.name}
                      className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl">
                      <FaUser />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-3xl font-bold mb-2">{userProfile.name}</h3>
                  <p className="text-gray-600">👥 Food Receiver</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{userProfile.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold">{userProfile.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Your Activity</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <FaArrowDown className="text-2xl text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">-</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <FaUser className="text-2xl text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-bold text-green-600">2025</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate('/receiver/dashboard')}
                  className="btn btn-primary flex-1"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
