import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import { v4 as uuidv4 } from 'uuid';
import { FiPlus, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import 'react-calendar/dist/Calendar.css';

const CalendarBlockContainer = styled.div`
  width: 100%;
`;

// Override react-calendar default styles
const StyledCalendarContainer = styled.div`
  .react-calendar {
    width: 100%;
    background: ${props => props.theme.background};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    font-family: inherit;
    line-height: 1.5;
  }
  
  .react-calendar__navigation {
    background: ${props => props.theme.backgroundSecondary};
    border-radius: 8px 8px 0 0;
    margin-bottom: 0;
    height: 44px;
  }
  
  .react-calendar__navigation button {
    color: ${props => props.theme.text};
    min-width: 44px;
    background: none;
    font-size: 16px;
    margin-top: 0;
  }
  
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: ${props => props.theme.backgroundTertiary};
  }
  
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-size: 0.75em;
    font-weight: bold;
    color: ${props => props.theme.textSecondary};
    padding: 8px 0;
  }
  
  .react-calendar__month-view__days__day--weekend {
    color: ${props => props.theme.accent};
  }
  
  .react-calendar__tile {
    color: ${props => props.theme.text};
    position: relative;
  }
  
  .react-calendar__tile--now {
    background: ${props => props.theme.backgroundTertiary};
  }
  
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: ${props => props.theme.backgroundTertiary};
  }
  
  .react-calendar__tile--active {
    background: ${props => props.theme.primary}40 !important;
    color: ${props => props.theme.primary};
    font-weight: bold;
  }
  
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${props => props.theme.primary}60;
  }
  
  .react-calendar__tile--hasActive {
    background: ${props => props.theme.primary}40;
  }
  
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: ${props => props.theme.primary}60;
  }
  
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: ${props => props.theme.backgroundTertiary};
  }
  
  .react-calendar__tile {
    height: 40px;
    
    &.has-events::after {
      content: "";
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${props => props.theme.primary};
    }
    
    &.has-events.react-calendar__tile--active::after {
      background-color: ${props => props.theme.background};
    }
  }
`;

const EventsContainer = styled.div`
  margin-top: 20px;
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 16px;
`;

const SelectedDateHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EventItem = styled.div`
  display: flex;
  padding: 8px;
  border-radius: 6px;
  background: ${props => props.theme.backgroundSecondary};
  position: relative;
  
  &:hover .event-delete {
    opacity: 1;
  }
`;

const EventTime = styled.div`
  margin-right: 12px;
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  min-width: 70px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EventContent = styled.div`
  flex-grow: 1;
`;

const EventTitle = styled.div`
  margin-bottom: 4px;
  font-weight: 500;
`;

const EventDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const EventDeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.danger};
    background-color: ${props => props.theme.backgroundTertiary};
  }
`;

const AddEventForm = styled.form`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${props => props.theme.backgroundSecondary};
  padding: 12px;
  border-radius: 6px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
`;

const FormInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: ${props => props.flex || 1};
`;

const FormLabel = styled.label`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const FormInput = styled.input`
  padding: 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
  }
`;

const FormTextarea = styled.textarea`
  padding: 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  
  &:focus {
    border-color: ${props => props.theme.primary};
    outline: none;
  }
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 16px;
  color: ${props => props.theme.textSecondary};
  font-style: italic;
`;

const CalendarBlock = ({ data, onUpdate }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: ''
  });
  
  // Initialize calendar data from block data
  useEffect(() => {
    if (data && data.content) {
      if (data.content.selectedDate) {
        setDate(new Date(data.content.selectedDate));
      }
      
      if (data.content.events) {
        setEvents(data.content.events);
      }
    }
  }, [data]);
  
  // Save changes to block data
  const saveChanges = (updatedDate, updatedEvents) => {
    onUpdate({
      content: {
        selectedDate: updatedDate.toISOString(),
        events: updatedEvents
      }
    });
  };
  
  // Handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
    saveChanges(newDate, events);
  };
  
  // Get events for the selected date
  const getEventsForDate = () => {
    const dateString = date.toDateString();
    return events.filter(event => new Date(event.date).toDateString() === dateString);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'All day';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch (e) {
      return timeString;
    }
  };
  
  // Add a new event
  const handleAddEvent = (e) => {
    e.preventDefault();
    
    if (newEvent.title.trim()) {
      const event = {
        id: uuidv4(),
        title: newEvent.title,
        description: newEvent.description,
        time: newEvent.time,
        date: date.toISOString()
      };
      
      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      saveChanges(date, updatedEvents);
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        time: ''
      });
      setIsAddingEvent(false);
    }
  };
  
  // Delete an event
  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveChanges(date, updatedEvents);
  };
  
  // Check if a date has events
  const hasEvents = (date) => {
    const dateString = date.toDateString();
    return events.some(event => new Date(event.date).toDateString() === dateString);
  };
  
  // Custom tile content to show event indicators
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasEvents(date)) {
      return <div className="has-events-indicator"></div>;
    }
    return null;
  };
  
  // Custom tile className to style dates with events
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && hasEvents(date)) {
      return 'has-events';
    }
    return null;
  };
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Events for the selected date
  const selectedDateEvents = getEventsForDate();
  
  return (
    <CalendarBlockContainer>
      <StyledCalendarContainer>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
        />
      </StyledCalendarContainer>
      
      <EventsContainer>
        <SelectedDateHeader>
          <div>{formatDate(date)}</div>
          <button
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: isAddingEvent ? 'inherit' : 'blue'
            }}
          >
            <FiPlus size={16} />
            {isAddingEvent ? 'Cancel' : 'Add Event'}
          </button>
        </SelectedDateHeader>
        
        {isAddingEvent && (
          <AddEventForm onSubmit={handleAddEvent}>
            <FormInputGroup>
              <FormLabel>Event Title</FormLabel>
              <FormInput
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
                required
                autoFocus
              />
            </FormInputGroup>
            
            <FormRow>
              <FormInputGroup flex={0.4}>
                <FormLabel>Time</FormLabel>
                <FormInput
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </FormInputGroup>
            </FormRow>
            
            <FormInputGroup>
              <FormLabel>Description (optional)</FormLabel>
              <FormTextarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Enter event description"
              />
            </FormInputGroup>
            
            <FormRow>
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Event
              </button>
            </FormRow>
          </AddEventForm>
        )}
        
        <EventsList>
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents
              .sort((a, b) => {
                if (!a.time) return 1;
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
              })
              .map(event => (
                <EventItem key={event.id}>
                  <EventTime>
                    <FiClock size={14} />
                    {formatTime(event.time)}
                  </EventTime>
                  
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    {event.description && (
                      <EventDescription>{event.description}</EventDescription>
                    )}
                  </EventContent>
                  
                  <EventDeleteButton
                    className="event-delete"
                    onClick={() => handleDeleteEvent(event.id)}
                    title="Delete event"
                  >
                    <FiTrash2 size={14} />
                  </EventDeleteButton>
                </EventItem>
              ))
          ) : (
            <NoEventsMessage>
              No events for this day. Click "Add Event" to create one.
            </NoEventsMessage>
          )}
        </EventsList>
      </EventsContainer>
    </CalendarBlockContainer>
  );
};

export default CalendarBlock; 