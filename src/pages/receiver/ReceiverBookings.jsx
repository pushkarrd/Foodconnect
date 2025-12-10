import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { getReceiverBookings, getDonationById } from '../../services/donationService';
import { getUserProfile } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaBox, FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

export default function ReceiverBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (auth.currentUser) {
          const userBookings = await getReceiverBookings(auth.currentUser.uid);
          
          // Enrich with donation details
          const enrichedBookings = await Promise.all(
            userBookings.map(async (booking) => {
              const donation = await getDonationById(booking.donationId);
              const donor = donation ? await getUserProfile(donation.donorId) : null;
              return { ...booking, donation, donor };
            })
          );
          
          setBookings(enrichedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const foodIcons = {
    'Veg': '🥗',
    'Non-Veg': '🍗',
    'Snacks': '🍪',
    'Rice': '🍚',
    'Chapati': '🫓',
    'Mixed': '🍱',
    'Dessert': '🍰',
    'Beverages': '🥤'
  };

  const statusColors = {
    'Active': 'badge-success',
    'Completed': 'badge-gray',
    'Cancelled': 'badge-danger'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-primary mb-6 hover:opacity-70">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-600 mt-4">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No bookings yet</p>
            <p className="text-gray-500 mb-6">Go to the dashboard to find and book food</p>
            <button onClick={() => navigate('/receiver/dashboard')} className="btn btn-primary">
              Browse Food
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="card hover:shadow-lg transition">
                {booking.donation && (
                  <div>
                    <div className="flex justify-between items-start mb-4 pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{foodIcons[booking.donation.foodType] || '🍱'}</span>
                        <div>
                          <h3 className="text-2xl font-bold">{booking.donation.foodType}</h3>
                          <p className="text-gray-600">{booking.donation.quantity} servings</p>
                        </div>
                      </div>
                      <span className={`badge-success ${statusColors[booking.status] || 'badge-success'}`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* Description */}
                    {booking.donation.description && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Description</p>
                        <p className="text-gray-700">{booking.donation.description}</p>
                      </div>
                    )}

                    {/* Pickup Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <FaClock className="text-primary" />
                          <span className="text-sm">Pickup Time</span>
                        </div>
                        <p className="font-semibold text-sm">
                          {new Date(booking.donation.pickupTime).toLocaleString()}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <FaBox className="text-primary" />
                          <span className="text-sm">Booked Date</span>
                        </div>
                        <p className="font-semibold text-sm">
                          {new Date(booking.bookedAt?.toDate?.() || booking.bookedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Donor Location Tracking with Interactive Map */}
                    {booking.donation.location && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-lg mb-3">📍 Donor Location (Track Your Order)</h4>
                        
                        {/* Clickable Interactive Google Map */}
                        <div 
                          onClick={() => window.open(`https://maps.google.com/?q=${booking.donation.location.latitude},${booking.donation.location.longitude}`, '_blank')}
                          className="mb-4 rounded-lg overflow-hidden border-2 border-green-300 cursor-pointer hover:border-green-500 transition group"
                          style={{ 
                            height: '350px',
                            backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${booking.donation.location.latitude},${booking.donation.location.longitude}&zoom=16&size=500x350&markers=color:red%7C${booking.donation.location.latitude},${booking.donation.location.longitude}&key=AIzaSyDZncRTKgDVKTjvVNbPpEcUoHyJqHqY6zQ')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                          }}
                        >
                          {/* Overlay for interactivity indication */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition flex items-center justify-center">
                            <div className="bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition">
                              <p className="text-sm font-semibold text-primary">Click to Open Google Maps</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Latitude:</strong> {booking.donation.location.latitude?.toFixed(6)}</p>
                          <p className="text-sm"><strong>Longitude:</strong> {booking.donation.location.longitude?.toFixed(6)}</p>
                          <p className="text-sm text-gray-600 mt-3">📌 {booking.donation.address}</p>
                          <button
                            onClick={() => window.open(`https://maps.google.com/?q=${booking.donation.location.latitude},${booking.donation.location.longitude}`, '_blank')}
                            className="btn btn-primary btn-sm w-full mt-3 flex items-center justify-center gap-2"
                          >
                            🗺️ Open in Google Maps
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Donor Contact Info */}
                    {booking.donor && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <FaUser className="text-yellow-600" /> Donor Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-lg font-bold">{booking.donor.name}</p>
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-primary text-sm" />
                            <span className="font-semibold">{booking.donor.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-primary text-sm" />
                            <span>{booking.donor.address}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-2 bg-white rounded p-2">
                            <p>Donor Coordinates: {booking.donor.location?.latitude?.toFixed(6)}, {booking.donor.location?.longitude?.toFixed(6)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/receiver/donation/${booking.donationId}`)}
                      className="btn btn-primary w-full"
                    >
                      View Full Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
