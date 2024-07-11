// EventList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("total");

  useEffect(() => {
    // Fetch events from API
    fetch("http://localhost:5000/events")
      .then((response) => response.json())
      .then((data) => {
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setEvents(data);
          setFilteredEvents(data); // Initialize filteredEvents with all events
        } else {
          console.error("Expected array of events, but received:", data);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  useEffect(() => {
    let filtered = events;

    if (filter !== "total") {
      filtered = filtered.filter(
        (event) => event.medium === filter || event.privacy === filter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filter]);

  const handleDeleteEvent = (eventId) => {
    // Implement delete logic here
    console.log("Deleting event with ID:", eventId);
    // Example: You can perform a DELETE request to the API
  };

  return (
    <div className="event-list-container">
      <div className="event-list-filter-container">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search"
          className="event-list-search-input"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="event-list-filter-select"
        >
          <option value="total">Total</option>
          <option value="private">Name</option>
          <option value="public">Date</option>
          <option value="offline">In-person</option>
          <option value="online">Online</option>
        </select>
      </div>
      <div className="event-list-card-container">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDeleteEvent}
            />
          ))
        ) : (
          <p className="event-list-no-events">No events found</p>
        )}
      </div>
      <Link to="/dashboard" className="event-list-create-event-link">
        Create New Event
      </Link>
    </div>
  );
};

export default EventList;
