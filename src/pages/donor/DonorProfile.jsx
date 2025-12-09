import React, { useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaMap, FaStar } from 'react-icons/fa';

export default function DonorProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'donors', auth.currentUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
            setFormData(userDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'donors', auth.currentUser.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      setProfile(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-primary mb-6">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <div className="card text-center">
            <p className="text-gray-600">Profile not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-primary mb-6 hover:opacity-70">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="card">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="bg-primary text-white w-24 h-24 rounded-full flex items-center justify-center text-4xl">
              <FaUser />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">Donor since {new Date(profile.createdAt?.toDate?.() || profile.createdAt).toLocaleDateString()}</p>
              {profile.totalDonations > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold">{profile.averageRating || 5.0} / 5.0</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{profile.totalDonations || 0}</p>
              <p className="text-gray-600">Total Donations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">★ {profile.averageRating || 5.0}</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>

          {/* Profile Information */}
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>

          {!editing ? (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <FaUser className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{profile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <FaPhone className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <FaMap className="text-primary text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold">{profile.address}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary w-full"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="btn btn-primary flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setEditing(false); setFormData(profile); }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
