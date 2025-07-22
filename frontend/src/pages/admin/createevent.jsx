import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    cost: '',
    description: '',
    image: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if ((name === 'startDate' || name === 'endDate') && updatedFormData.startDate && updatedFormData.endDate) {
      const start = new Date(updatedFormData.startDate);
      const end = new Date(updatedFormData.endDate);
      if (end < start) {
        setError('End date cannot be before start date.');
      } else {
        setError('');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.venue) {
      setError('Please fill in Event Title and Venue before generating AI description');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/admin/generate_event_description/', {
        title: formData.title,
        venue: formData.venue,
        start_date: formData.startDate,
        end_date: formData.endDate,
        cost: formData.cost,
      });

      if (response.data && response.data.description) {
        setFormData({ ...formData, description: response.data.description });
        setSuccess('AI description generated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      const sampleDescription = generateSampleDescription();
      setFormData({ ...formData, description: sampleDescription });
      setSuccess('Sample description generated!');
      setTimeout(() => setSuccess(''), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSampleDescription = () => {
    const { title, venue, startDate, cost } = formData;
    return `Join us for ${title || 'our exciting event'} at ${venue || 'the venue'}${startDate ? ` on ${new Date(startDate).toLocaleDateString()}` : ''}. This event promises to be an unforgettable experience with engaging activities, networking opportunities, and valuable insights. ${cost ? `Event fee: ₹${cost}` : 'Free entry'}. Don't miss out on this amazing opportunity!`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      setError('End date cannot be before start date.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/admin/create_event/', {
        title: formData.title,
        venue: formData.venue,
        start_time: formData.startTime,
        end_time: formData.endTime,
        start_date: formData.startDate,
        end_date: formData.endDate,
        cost: formData.cost,
        description: formData.description,
        image_base64: formData.image,
        use_ai: false,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSuccess('Event created successfully!');
        setFormData({
          title: '',
          venue: '',
          startTime: '',
          endTime: '',
          startDate: '',
          endDate: '',
          cost: '',
          description: '',
          image: null,
        });
        setImagePreview(null);
        setTimeout(() => {
          navigate('/events');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Error creating event:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-black mb-1">Event <span className="text-purple-600">Hive</span></h1>
          <h2 className="text-3xl font-semibold">Create Event</h2>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center mb-4 bg-green-50 p-3 rounded-md">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">Event Venue</label>
            <input
              type="text"
              name="venue"
              placeholder="Enter venue address"
              value={formData.venue}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">Start time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">End time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">Event Cost</label>
            <input
              type="number"
              name="cost"
              placeholder="Enter the cost of the event in INR"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Event preview" className="max-w-full max-h-48 mx-auto rounded-lg mb-4" />
                    <p className="text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <div className="mx-auto w-16 h-16 mb-4">
                      <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Here</p>
                    <p className="text-sm text-gray-500">Click to select an image file</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Event Description</label>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Generate
                  </>
                )}
              </button>
            </div>
            <textarea
              name="description"
              placeholder="Type here..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-vertical"
              required
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-lg font-semibold transition-colors">
            Create event
          </button>

          <div className="flex justify-center mt-6">
            <div className="bg-gray-300 rounded-full px-4 py-2 text-sm text-gray-600">2 / 2</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;