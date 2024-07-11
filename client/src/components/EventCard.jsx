import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event, onDelete }) => {
  return (
    <div className="event-card">
      <img
        className="event-card-image"
        src={event.image_url} // Ensure this path is correct
        alt={event.title}
      />
      <div className="event-card-details">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">{event.description}</p>
        <p className="event-card-date">Date: {event.date}</p>
        <p className="event-card-location">Location: {event.location}</p>
        <p className="event-card-medium">Medium: {event.medium}</p>
        <div className="event-card-buttons">
          <button className="event-card-button" onClick={() => onDelete(event.id)}>
            Delete
          </button>
          <Link to={`/events/${event.id}`} className="event-card-button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
