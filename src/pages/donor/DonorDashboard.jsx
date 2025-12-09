import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { getDonorDonations, getDonorBookedOrders } from '../../services/donationService';
import { getUserProfile } from '../../services/authService';
import { FaPlus, FaHistory, FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DonationCard from '../../components/DonationCard';

export default function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const [bookedOrders, setBookedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const userDonations = await getDonorDonations(auth.currentUser.uid);
          setDonations(userDonations);
          
          const booked = await getDonorBookedOrders(auth.currentUser.uid);
          
          // Enrich booked orders with receiver details
          const enrichedOrders = await Promise.all(
            booked.map(async (order) => {
              const receiver = await getUserProfile(order.receiverId);
              return { ...order, receiver };
            })
          );
          
          setBookedOrders(enrichedOrders);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'Pending').length,
    completed: donations.filter(d => d.status === 'Collected').length,
    booked: bookedOrders.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Donor Dashboard</h1>
          <p className="text-green-100">Share food, reduce waste, make a difference!</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Total Donations</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FaHistory className="text-4xl text-blue-300" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <FaPlus className="text-4xl text-yellow-300" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <FaUser className="text-4xl text-green-300" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate('/donor/add-donation')}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add New Donation
          </button>
          <button
            onClick={() => navigate('/donor/profile')}
            className="btn btn-outline flex items-center gap-2"
          >
            <FaUser /> My Profile
          </button>
        </div>

        {/* Donations List */}
        <div>
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('donations')}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === 'donations'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Your Donations ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('booked')}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === 'booked'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Booked Orders ({stats.booked})
            </button>
          </div>

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Your Donations</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-gray-600 mt-4">Loading donations...</p>
                </div>
              ) : donations.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No donations yet</p>
                  <button onClick={() => navigate('/donor/add-donation')} className="btn btn-primary">
                    Create Your First Donation
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donations.map(donation => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Booked Orders Tab */}
          {activeTab === 'booked' && (
            <>
              <h2 className="text-2xl font-bold mb-6">Orders Received</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-gray-600 mt-4">Loading orders...</p>
                </div>
              ) : bookedOrders.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-gray-600 text-lg">No booked orders yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookedOrders.map(order => (
                    <div key={order.id} className="card hover:shadow-lg transition">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold">{order.foodType}</h3>
                            <p className="text-sm text-gray-600">Quantity: {order.quantity} servings</p>
                          </div>
                          <span className="badge-warning">{order.status}</span>
                        </div>
                        {order.description && (
                          <p className="text-gray-700 mb-3">{order.description}</p>
                        )}
                      </div>

                      {/* Receiver Info */}
                      {order.receiver && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-lg mb-2">{order.receiver.name}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-primary" />
                              <span>{order.receiver.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-primary" />
                              <span>{order.receiver.address}</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              Location: {order.receiver.location?.latitude?.toFixed(4)}, {order.receiver.location?.longitude?.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-sm text-gray-600 mb-4">
                        <p>Pickup: {new Date(order.pickupTime).toLocaleString()}</p>
                      </div>

                      <button className="btn btn-primary w-full">Mark as Collected</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
