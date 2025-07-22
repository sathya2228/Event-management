import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import events_img from '../../image.png'; 

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const topImageUrl = events_img;; // Replace with your image or base64 string

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/get_events/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setEvents(response.data.events || []);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-10 text-gray-600">No events available.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb] p-4 relative">
      {/* Fixed Create Event Button */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => navigate('/createevent')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          Create Event
        </button>
      </div>

      <div className="max-w-6xl mx-auto pt-16">
        {/* Top Image Banner */}
        <div className="mb-8">
          <img
            src={topImageUrl}
            alt="Event Banner"
            className="w-full h-64 object-cover rounded-xl shadow-md"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-black">
            Event <span className="text-purple-600">Hive</span>
          </h1>
          <h2 className="text-xl font-medium text-gray-600">Upcoming Events</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Main Event Image */}
              {event.image_base64 && (
                <img
                  src={event.image_base64}
                  alt={event.title}
                  className="w-full h-48 object-cover border-b"
                />
              )}

              {/* Optional Banner Image */}
              {event.banner_image_base64 && (
                <img
                  src={event.banner_image_base64}
                  alt="Banner"
                  className="w-full h-24 object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="text-xl font-semibold text-purple-700">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-1">Venue: {event.venue}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Date: {new Date(event.start_date).toLocaleDateString()} -{' '}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Time: {event.start_time} - {event.end_time}
                </p>
                <p className="text-gray-600 text-sm mt-1">Cost: ₹{event.cost.toFixed(2)}</p>
                <p className="text-gray-700 mt-2 line-clamp-3">{event.description}</p>
                <p className="text-gray-500 text-xs mt-2">
                  Created: {new Date(event.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
