import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaLeaf, FaUsers, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl mb-6">🍱</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">FoodConnect</h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Share Food. Reduce Waste. Make a Difference.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Donor Flow */}
            <div className="bg-blue-50 rounded-lg p-8 border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold mb-6 text-blue-700">For Donors</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Sign Up</h4>
                    <p className="text-gray-600 text-sm">Create your account in seconds</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Post Donation</h4>
                    <p className="text-gray-600 text-sm">Add food details, quantity, and location</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Share & Track</h4>
                    <p className="text-gray-600 text-sm">Get notified when someone books your food</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Complete</h4>
                    <p className="text-gray-600 text-sm">Mark as collected and earn impact points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receiver Flow */}
            <div className="bg-green-50 rounded-lg p-8 border-l-4 border-green-500">
              <h3 className="text-2xl font-bold mb-6 text-green-700">For Receivers</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Sign Up</h4>
                    <p className="text-gray-600 text-sm">Create your account in seconds</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Discover Food</h4>
                    <p className="text-gray-600 text-sm">Find food available near you in real-time</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Book Now</h4>
                    <p className="text-gray-600 text-sm">Book the food instantly - first come first served</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Pickup</h4>
                    <p className="text-gray-600 text-sm">Collect from donor location and enjoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose FoodConnect?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Real-Time Matching</h3>
              <p className="text-gray-600">Instant location-based notifications bring donors and receivers together in seconds</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Safe & Transparent</h3>
              <p className="text-gray-600">Verified accounts, ratings, and full transparency ensure trust for everyone</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Track Your Impact</h3>
              <p className="text-gray-600">See how much food you've donated and the impact you're creating</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-2">Map View</h3>
              <p className="text-gray-600">Find food and donors visually on the map for easier navigation</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Easy Communication</h3>
              <p className="text-gray-600">Connect directly with donors and receivers for seamless coordination</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Earn Badges</h3>
              <p className="text-gray-600">Get recognized with impact badges and community ratings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">50K+</p>
              <p className="text-green-100">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">150K+</p>
              <p className="text-green-100">Meals Donated</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">500K+</p>
              <p className="text-green-100">Kg Waste Saved</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">1000+</p>
              <p className="text-green-100">Communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of people across the world who are reducing food wastage and helping their communities every day.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2"
            >
              Start Sharing <FaArrowRight />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-outline px-8 py-3 text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">What People Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
              <p className="text-gray-700 mb-4">
                "FoodConnect helped me donate excess food from my restaurant. It's so easy and I feel great knowing it's helping someone in need!"
              </p>
              <p className="font-semibold">- Rajesh, Restaurant Owner</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
              <p className="text-gray-700 mb-4">
                "As a shelter home, FoodConnect has been a lifesaver. We get notifications about food nearby, saving us time and money."
              </p>
              <p className="font-semibold">- Priya, Shelter Home Manager</p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
              <p className="text-gray-700 mb-4">
                "Love the transparency and safety features. The rating system gives me confidence to book from any donor on the app."
              </p>
              <p className="font-semibold">- Amit, Food Receiver</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <details className="card">
              <summary className="font-semibold cursor-pointer text-lg">Is FoodConnect free to use?</summary>
              <p className="mt-4 text-gray-600">Yes! FoodConnect is completely free for both donors and receivers. We believe reducing food wastage should be accessible to everyone.</p>
            </details>

            <details className="card">
              <summary className="font-semibold cursor-pointer text-lg">How do I ensure food safety?</summary>
              <p className="mt-4 text-gray-600">We have strict guidelines: Food must be less than 12 hours old, properly stored, and donors can upload images for verification. Ratings help maintain accountability.</p>
            </details>

            <details className="card">
              <summary className="font-semibold cursor-pointer text-lg">What if I need food urgently?</summary>
              <p className="mt-4 text-gray-600">Our real-time matching system notifies nearby receivers instantly. You can also expand your search radius to find food within 15 km.</p>
            </details>

            <details className="card">
              <summary className="font-semibold cursor-pointer text-lg">Can NGOs and organizations register?</summary>
              <p className="mt-4 text-gray-600">Yes! Organizations can register as receivers and get priority notifications. We have special NGO features and bulk donation support.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
