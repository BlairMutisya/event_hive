// EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onDelete }) => {
  const handleDelete = () => {
    onDelete(event.id); // Implement onDelete function in parent component to handle deletion
  };

  return (
    <div className="event-card">
      <img src={event.image_url} alt={event.title} className="event-card-image" />
      <div className="event-card-details">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">{event.description}</p>
        <p className="event-card-date">Date: {new Date(event.date).toLocaleDateString()}</p>
        <p className="event-card-location">Location: {event.location}</p>
        <div className="event-card-buttons">
          <Link to={`/events/${event.id}`} className="event-card-button">
            View Details
          </Link>
          <button className="event-card-button" onClick={handleDelete}>
            Delete
          </button>
          <Link to={`/events/${event.id}/edit`} className="event-card-button">
            Update
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
