import React, { useState, useEffect } from 'react';
import { getDonationById, bookDonation } from '../../services/donationService';
import { getUserProfile } from '../../services/authService';
import { auth } from '../../services/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaUser } from 'react-icons/fa';

export default function DonationDetail() {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const donationData = await getDonationById(donationId);
        setDonation(donationData);

        if (donationData && donationData.donorId) {
          try {
            const donorData = await getUserProfile(donationData.donorId);
            setDonor(donorData);
          } catch (donorError) {
            console.error('Error fetching donor profile:', donorError);
            // Still show donation even if donor profile fails
            setDonor(null);
          }
        }
      } catch (error) {
        console.error('Error fetching donation details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [donationId]);

  const handleBookDonation = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      await bookDonation(donationId, auth.currentUser.uid);
      alert('Food booked successfully!');
      navigate('/receiver/dashboard');
    } catch (error) {
      alert('Error booking donation: ' + error.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-primary mb-6">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className="card text-center">
            <p className="text-gray-600">Donation not found</p>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    'Pending': 'badge-success',
    'Booked': 'badge-warning',
    'Collected': 'badge-gray'
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-primary mb-6 hover:opacity-70">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="card">
          {/* Image */}
          {donation.imageURL && (
            <img src={donation.imageURL} alt="Food" className="w-full h-96 object-cover rounded-lg mb-6" />
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{foodIcons[donation.foodType] || '🍱'}</span>
                <div>
                  <h1 className="text-3xl font-bold">{donation.foodType}</h1>
                  <div className={`badge-success ${statusColors[donation.status] || 'badge-gray'} inline-block`}>
                    {donation.status}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{donation.quantity} servings</p>
              {donation.distance && <p className="text-gray-600">{donation.distance} km away</p>}
            </div>
          </div>

          {/* Description */}
          {donation.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{donation.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FaClock className="text-primary" />
                <span className="text-sm">Pickup Time</span>
              </div>
              <p className="font-semibold">
                {new Date(donation.pickupTime).toLocaleString()}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <FaMapMarkerAlt className="text-primary" />
                <span className="text-sm">Pickup Location</span>
              </div>
              <p className="font-semibold">{donation.address}</p>
            </div>
          </div>

          {/* Donor Info */}
          {donor && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <FaUser className="text-3xl text-blue-500" />
                <div>
                  <h3 className="font-semibold text-lg">{donor.name}</h3>
                  <p className="text-gray-600">{donor.phone}</p>
                  {donation.status === 'Booked' && (
                    <p className="text-sm text-primary font-semibold mt-1">Contact visible only to booker</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {donation.status === 'Pending' && (
            <button
              onClick={handleBookDonation}
              disabled={booking}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {booking ? 'Booking...' : 'Book This Food'}
            </button>
          )}

          {donation.status === 'Booked' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800 font-semibold">Already booked by another receiver</p>
            </div>
          )}

          {donation.status === 'Collected' && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
              <p className="text-gray-800 font-semibold">Donation completed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
