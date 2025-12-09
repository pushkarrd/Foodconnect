import React, { useState, useEffect } from 'react';
import { createDonation } from '../../services/donationService';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';

export default function AddDonation() {
  const [formData, setFormData] = useState({
    foodType: 'Mixed',
    quantity: '',
    description: '',
    pickupTime: '',
    address: '',
    location: { latitude: 0, longitude: 0 }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const navigate = useNavigate();

  const foodTypes = ['Veg', 'Non-Veg', 'Snacks', 'Rice', 'Chapati', 'Mixed', 'Dessert', 'Beverages', 'Others'];

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
        }
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth.currentUser) throw new Error('User not authenticated');
      if (!formData.quantity || !formData.pickupTime) {
        throw new Error('Please fill all required fields');
      }

      await createDonation(auth.currentUser.uid, formData);
      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="flex items-center text-primary mb-6 hover:opacity-70"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Add New Food Donation</h1>

          {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Food Type *</label>
                <select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="input-field"
                >
                  {foodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Quantity (servings) *</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="e.g., 10"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Describe the food (e.g., Fresh cooked rice, packed in containers)"
                value={formData.description}
                onChange={handleChange}
                className="input-field h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pickup Time *</label>
                <input
                  type="datetime-local"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Pickup Address</label>
              <input
                type="text"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-700">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    Latitude: {formData.location.latitude.toFixed(4)} | 
                    Longitude: {formData.location.longitude.toFixed(4)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="btn btn-primary text-sm"
                >
                  {locationLoading ? 'Getting...' : 'Update Location'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Creating Donation...' : 'Create Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
