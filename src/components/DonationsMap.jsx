import React from 'react';

export default function DonationsMap({ donations, userLocation }) {
  return (
    <div className="card h-screen">
      <div className="relative w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg font-semibold mb-4">
            Map View (Integration with Google Maps API Required)
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-2">To enable the map:</h3>
            <ol className="text-left text-sm text-gray-600 space-y-2">
              <li>1. Get Google Maps API key from <a href="https://console.cloud.google.com/" className="text-blue-600">Google Cloud Console</a></li>
              <li>2. Add API key to .env file as VITE_APP_GOOGLE_MAPS_API_KEY</li>
              <li>3. Install @react-google-maps/api package</li>
              <li>4. Replace this component with actual Google Maps implementation</li>
            </ol>
          </div>

          {/* Donation List as fallback */}
          <div className="mt-6">
            <p className="text-gray-600 mb-4">Available donations:</p>
            <div className="space-y-2">
              {donations.map(donation => (
                <div key={donation.id} className="bg-white p-3 rounded-lg text-left">
                  <p className="font-semibold">{donation.foodType} - {donation.quantity} servings</p>
                  <p className="text-sm text-gray-600">{donation.distance} km away</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
