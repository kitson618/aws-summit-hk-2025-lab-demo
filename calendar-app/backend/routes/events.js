const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/events
// @desc    Get all events for a user
// @access  Private
router.get('/', eventController.getEvents);

// @route   GET /api/events/:id
// @desc    Get a single event
// @access  Private
router.get('/:id', eventController.getEvent);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', eventController.createEvent);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', eventController.deleteEvent);

module.exports = router;