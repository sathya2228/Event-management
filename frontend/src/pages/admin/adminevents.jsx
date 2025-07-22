import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventHive = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-purple-600">Event Hive</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-purple-600 text-white py-12 px-4 rounded-lg mx-4 mt-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-4">Discover and experience extraordinary Events</h2>
          <p className="text-lg mb-6">Enter in the world of events. Discover now the latest Events or start creating your own!</p>
          <button className="bg-white text-purple-600 font-medium py-2 px-4 rounded-full mr-4 hover:bg-gray-200 transition">Discover now</button>
          <button className="bg-transparent border border-white text-white font-medium py-2 px-4 rounded-full hover:bg-white hover:text-purple-600 transition">Watch video</button>
        </div>
      </section>

      {/* Listed Events Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Listed Events</h2>
        <div className="flex justify-center mb-4">
          <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-l-full">FREE</button>
          <div className="flex items-center px-4">
            <button className="text-gray-700">&lt;</button>
            <span className="mx-2">1 / {Math.ceil(events.length / 3)}</span>
            <button className="text-gray-700">&gt;</button>
          </div>
          <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-r-full">PAID</button>
          <button className="ml-4 bg-gray-200 text-gray-700 py-1 px-3 rounded-full">Restart</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className={`inline-block px-2 py-1 rounded-full text-white ${event.type === 'FREE' ? 'bg-purple-600' : 'bg-purple-600'}`}>
                  {event.type}
                </span>
                <h3 className="text-lg font-medium mt-2">{event.title}</h3>
                <p className="text-purple-600 mt-1">{event.date}</p>
                <p className="text-gray-600 mt-1">ONLINE EVENT - Attend anywhere</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventHive;