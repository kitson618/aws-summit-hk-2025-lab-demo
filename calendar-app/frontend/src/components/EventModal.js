import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EventModal = ({ show, handleClose, handleSave, selectedEvent, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    color: '#3788d8'
  });

  useEffect(() => {
    if (selectedEvent && mode === 'edit') {
      // Format dates for datetime-local input
      const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
      };

      setFormData({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        start: formatDate(selectedEvent.start),
        end: formatDate(selectedEvent.end),
        allDay: selectedEvent.allDay || false,
        color: selectedEvent.color || '#3788d8'
      });
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
        color: '#3788d8'
      });
    }
  }, [selectedEvent, mode, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'add' ? 'Add Event' : 'Edit Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="All Day"
              name="allDay"
              checked={formData.allDay}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;