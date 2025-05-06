import React, { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import EventModal from '../components/EventModal';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      
      // Format events for FullCalendar
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start_date,
        end: event.end_date,
        allDay: false,
        color: '#3788d8'
      }));
      
      setEvents(formattedEvents);
      setError('');
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (arg) => {
    setModalMode('add');
    setSelectedEvent({
      start: arg.dateStr,
      end: arg.dateStr
    });
    setShowModal(true);
  };

  const handleEventClick = (arg) => {
    setModalMode('edit');
    setSelectedEvent({
      id: arg.event.id,
      title: arg.event.title,
      description: arg.event.extendedProps.description,
      start: arg.event.start,
      end: arg.event.end,
      allDay: arg.event.allDay,
      color: arg.event.backgroundColor
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (formData) => {
    try {
      // Format data for API
      const eventData = {
        title: formData.title,
        description: formData.description,
        start_date: new Date(formData.start).toISOString(),
        end_date: new Date(formData.end).toISOString()
      };

      if (modalMode === 'add') {
        await createEvent(eventData);
      } else {
        await updateEvent(selectedEvent.id, eventData);
      }
      
      fetchEvents();
      handleCloseModal();
    } catch (err) {
      setError('Failed to save event');
      console.error(err);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !selectedEvent.id) return;
    
    try {
      await deleteEvent(selectedEvent.id);
      fetchEvents();
      handleCloseModal();
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Calendar</h1>
        <Button variant="primary" onClick={() => {
          setModalMode('add');
          setSelectedEvent(null);
          setShowModal(true);
        }}>
          Add Event
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
        />
      </div>
      
      <EventModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveEvent}
        selectedEvent={selectedEvent}
        mode={modalMode}
      />
      
      {modalMode === 'edit' && (
        <div className="text-center mt-3">
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete Event
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Calendar;