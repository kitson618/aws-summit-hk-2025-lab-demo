const Event = require('../models/Event');

// Get all events for a user
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.getAll(req.user.id);
    res.json(events);
  } catch (error) {
    console.error('Error in getEvents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id, req.user.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error in getEvent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    
    const event = await Event.create({
      title,
      description,
      start_date,
      end_date,
      user_id: req.user.id
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error in createEvent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    
    const event = await Event.update(req.params.id, {
      title,
      description,
      start_date,
      end_date
    }, req.user.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error in updateEvent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const success = await Event.delete(req.params.id, req.user.id);
    
    if (!success) {
      return res.status(404).json({ message: 'Event not found or not authorized' });
    }
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};