import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa6'; // Updated import

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/get_events/', {
          headers: { 'Content-Type': 'application/json' },
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

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/delete_event/${eventId}/`, {
          headers: { 'Content-Type': 'application/json' },
        });
        setEvents(events.filter(event => event._id !== eventId));
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleEdit = (eventId) => {
    alert(`Edit event with ID: ${eventId}. Implement navigation to edit form here.`);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (filteredEvents.length === 0) {
    return <div className="text-center py-10 text-gray-600">No events available.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="/create-event" className="hover:text-purple-300">Create Event</a>
            </li>
            <li className="mb-4">
              <a href="/events" className="hover:text-purple-300">View Events</a>
            </li>
            <li className="mb-4">
              <a href="/admin/events" className="text-purple-200 font-semibold">Manage Events</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Manage Events</h1>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Venue</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Dates</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Time</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Cost (₹)</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{event.title}</td>
                  <td className="p-4 text-gray-600">{event.venue}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-gray-600">{event.start_time} - {event.end_time}</td>
                  <td className="p-4 text-gray-600">{event.cost.toFixed(2)}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(event._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;