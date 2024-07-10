import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Fetch event details from API
    fetch(`http://localhost:5000/events/${id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error("Error fetching event details:", error));
  }, [id]);

  return (
    <div className="event-detail">
      {event ? (
        <>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
}

export default EventDetail;