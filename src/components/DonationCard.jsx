import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaBox } from 'react-icons/fa';

export default function DonationCard({ donation, userRole }) {
  const navigate = useNavigate();

  const statusColors = {
    'Pending': 'bg-green-100 text-green-800',
    'Booked': 'bg-amber-100 text-amber-800',
    'Collected': 'bg-gray-100 text-gray-800',
    'Cancelled': 'bg-red-100 text-red-800'
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

  const handleViewDetails = () => {
    if (userRole === 'receiver') {
      navigate(`/receiver/donation/${donation.id}`);
    } else {
      navigate(`/donor/donation/${donation.id}`);
    }
  };

  return (
    <div className="card cursor-pointer hover:shadow-xl transition-all" onClick={handleViewDetails}>
      {donation.imageURL && (
        <img
          src={donation.imageURL}
          alt={donation.foodType}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{foodIcons[donation.foodType] || '🍱'}</span>
          <div>
            <h3 className="font-semibold text-lg">{donation.foodType}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[donation.status] || statusColors['Pending']}`}>
              {donation.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <FaBox className="text-primary" />
          <span>{donation.quantity} servings</span>
        </div>

        {donation.distance && (
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" />
            <span>{donation.distance} km away</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <FaClock className="text-primary" />
          <span>{new Date(donation.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {donation.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{donation.description}</p>
      )}

      <button className="btn btn-primary w-full text-sm">
        {userRole === 'receiver' ? 'View & Book' : 'View Details'}
      </button>
    </div>
  );
}
