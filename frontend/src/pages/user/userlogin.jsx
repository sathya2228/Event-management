import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import login_img from '../../../src/login-bg.jpg.png'; // Adjust path if needed

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/user/login/', formData);
      if (response.status === 200) {
        console.log('Login successful', response.data);
        // Store token or user info if required
        navigate('/userevents'); // Redirect to events or dashboard
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    }
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
            Welcome Back
          </h2>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                PASSWORD
              </label>
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
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate('/usersignup')}
              className="ml-2 text-purple-600 hover:underline font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={login_img}
          alt="Login Visual"
          className="w-full h-full object-cover rounded-l-[2rem]"
        />
      </div>
    </div>
  );
};

export default Login;
