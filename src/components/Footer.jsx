import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍱</span>
              <span className="font-bold text-white text-lg">FoodConnect</span>
            </div>
            <p className="text-sm text-gray-400">Reducing food wastage, one donation at a time.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary">Home</a></li>
              <li><a href="/" className="hover:text-primary">About</a></li>
              <li><a href="/" className="hover:text-primary">Contact</a></li>
              <li><a href="/" className="hover:text-primary">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">For Users</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/login" className="hover:text-primary">Login</a></li>
              <li><a href="/signup" className="hover:text-primary">Sign Up</a></li>
              <li><a href="/" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="/" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-2xl hover:text-primary"><FaFacebook /></a>
              <a href="#" className="text-2xl hover:text-primary"><FaTwitter /></a>
              <a href="#" className="text-2xl hover:text-primary"><FaInstagram /></a>
              <a href="#" className="text-2xl hover:text-primary"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-400">
            © 2024 FoodConnect. All rights reserved. | Made with ❤️ to reduce food wastage
          </p>
        </div>
      </div>
    </footer>
  );
}
