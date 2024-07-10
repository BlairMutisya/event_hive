// EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onDelete }) => {
  const handleDelete = () => {
    onDelete(event.id); // Implement onDelete function in parent component to handle deletion
  };

  return (
    <div className="card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <div className="buttons">
        <Link to={`/events/${event.id}`} className="explore-btn">
          View Details
        </Link>
        <button className="dashboard-btn" onClick={handleDelete}>
          Delete
        </button>
        <Link to={`/events/${event.id}/edit`} className="dashboard-btn">
          Update
        </Link>
      </div>
    </div>
  );
};

export default EventCard;