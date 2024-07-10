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