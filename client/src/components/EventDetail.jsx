import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "../styles.css"; // Import styles.css for styling

const EventDetail = () => {
  const { id } = useParams();
  const history = useHistory(); // Get the history object from React Router
  const [event, setEvent] = useState(null);
  const [editMode, setEditMode] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    image_url: "",
    medium: "", // Added medium field
  });

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data); // Assuming API returns event details for a given ID
        // Set initial form data from fetched event
        setFormData({
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          category: data.category,
          medium: data.medium,
          image_url: data.image_url,
        });
      })
      .catch((error) => console.error("Error fetching event details:", error));
  }, [id]);

  if (!event) {
    return <p>Loading event details...</p>;
  }

  const goBack = () => {
    history.goBack(); // Function to go back to the previous page
  };

  const handleUpdate = () => {
    // Perform update operation in backend
    fetch(`http://localhost:5000/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Update event state with updated data
        setEvent(data);
        setEditMode(false); // Exit edit mode after successful update
        console.log("Event updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="event-detail-container">
      <div className="event-detail-card">
        <img src={event.image_url} className="event-detail-img-top" alt={event.title} />
        <div className="event-detail-details">
          <h5 className="event-detail-title">{event.title}</h5>
          {editMode ? (
            <textarea
              className="event-detail-description-input"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          ) : (
            <p className="event-detail-description">{event.description}</p>
          )}
          <p className="event-detail-date">
            <strong>Date:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            ) : (
              event.date
            )}
          </p>
          <p className="event-detail-location">
            <strong>Location:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            ) : (
              event.location
            )}
          </p>
          <p className="event-detail-category">
            <strong>Category:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            ) : (
              event.category
            )}
          </p>
          <p className="event-detail-medium">
            <strong>Medium:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="medium"
                value={formData.medium}
                onChange={handleInputChange}
              />
            ) : (
              event.medium
            )}
          </p>

          {editMode ? (
            <button className="update-button" onClick={handleUpdate}>
              Update Event
            </button>
          ) : (
            <div className="button-container">
              <button className="back-button" onClick={goBack}>
                Go Back
              </button>
              <button className="update-button" onClick={() => setEditMode(true)}>
                Edit Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
