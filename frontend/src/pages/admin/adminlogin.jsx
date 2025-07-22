import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import login_img from '../../login-bg.jpg.png'; // Adjust the path as necessary

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login/', formData);
      if (response.status === 200) {
        console.log('Login successful', response.data);
        // Optional: Save token or redirect
        navigate('/events'); // redirect to admin dashboard
      }
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen bg-[#f9f9fb]">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-center text-xl font-bold text-black mb-1">
            Event <span className="text-purple-600">Hive</span>
          </h1>
          <h2 className="text-3xl font-semibold text-center mb-8">
            Sign In to Event Hive
          </h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                YOUR EMAIL
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  PASSWORD
                </label>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-800">
                  Forgot your password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-lg font-semibold transition"
            >
              Sign In
            </button>

            {/* Sign Up Redirect Button */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Don't have an account?</span>
              <button
                type="button"
                onClick={handleSignupRedirect}
                className="ml-2 text-purple-600 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={login_img}
          alt="Login visual"
          className="w-full h-full object-cover rounded-l-[2rem]"
        />
      </div>
    </div>
  );
};

export default Login;
