import React, { useState } from 'react';
import axios from 'axios';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8000/api/user/register/', formData);

      if (response.status === 201) {
        setSuccess("User registered successfully!");
        setFormData({ username: '', email: '', password: '', confirm_password: '' });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Registration failed.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-center text-2xl font-bold text-black mb-1">
          Event <span className="text-purple-600">Hive</span>
        </h1>
        <h2 className="text-center text-3xl font-semibold text-black mb-8">Sign Up as User</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">YOUR NAME</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">EMAIL</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">PASSWORD</label>
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

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">CONFIRM PASSWORD</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Re-enter your password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
