import axios from 'axios';

// Get all events
export const getEvents = async () => {
  try {
    const res = await axios.get('/api/events');
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get a single event
export const getEvent = async (id) => {
  try {
    const res = await axios.get(`/api/events/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const res = await axios.post('/api/events', eventData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    const res = await axios.put(`/api/events/${id}`, eventData);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const res = await axios.delete(`/api/events/${id}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};