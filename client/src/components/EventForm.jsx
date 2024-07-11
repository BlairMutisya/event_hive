import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EventForm = () => {
  const initialValues = {
    title: "",
    description: "",
    date: "",
    location: "",
    medium: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    category: "",
    acceptReservation: false,
    imageURL: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date().required("Date is required"),
    location: Yup.string().required("Location is required"),
    medium: Yup.string().required("Medium is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    maxParticipants: Yup.number().required("Max Participants is required"),
    category: Yup.string().required("Category is required"),
    acceptReservation: Yup.boolean().required("Accept Reservation is required"),
    imageURL: Yup.string()
      .url("Must be a valid URL")
      .required("Image URL is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const user_id = 1; // Replace with actual user ID
      const formData = {
        title: values.title,
        description: values.description,
        date: values.date,
        location: values.location,
        medium: values.medium,
        startDate: values.startDate,
        endDate: values.endDate,
        startTime: values.startTime,
        endTime: values.endTime,
        maxParticipants: parseInt(values.maxParticipants),
        category: values.category,
        acceptReservation: values.acceptReservation,
        imageURL: values.imageURL,
        user_id: user_id,
      };

      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.error}`);
      }

      const data = await response.json();
      console.log("Event created:", data);
      resetForm();
      setSubmitting(false);
      // Optionally handle success state or redirect
    } catch (error) {
      console.error("Error creating event:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="form-box">
      <h2>Create New Event</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field
                type="text"
                id="title"
                name="title"
                className="input-field"
              />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field
                type="text"
                id="description"
                name="description"
                className="input-field"
              />
              <ErrorMessage name="description" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <Field
                type="date"
                id="date"
                name="date"
                className="input-field"
              />
              <ErrorMessage name="date" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <Field
                type="text"
                id="location"
                name="location"
                className="input-field"
              />
              <ErrorMessage name="location" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="medium">Medium</label>
              <Field
                as="select"
                id="medium"
                name="medium"
                className="input-field"
              >
                <option value="">Select Medium</option>
                <option value="online">Online</option>
                <option value="in-person">In Person</option>
              </Field>
              <ErrorMessage name="medium" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <Field
                type="date"
                id="startDate"
                name="startDate"
                className="input-field"
              />
              <ErrorMessage name="startDate" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <Field
                type="date"
                id="endDate"
                name="endDate"
                className="input-field"
              />
              <ErrorMessage name="endDate" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <Field
                type="time"
                id="startTime"
                name="startTime"
                className="input-field"
              />
              <ErrorMessage name="startTime" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <Field
                type="time"
                id="endTime"
                name="endTime"
                className="input-field"
              />
              <ErrorMessage name="endTime" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="maxParticipants">Max Participants</label>
              <Field
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                className="input-field"
              />
              <ErrorMessage name="maxParticipants" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <Field
                as="select"
                id="category"
                name="category"
                className="input-field"
              >
                <option value="">Select Category</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
                <option value="networking">Networking</option>
              </Field>
              <ErrorMessage name="category" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="acceptReservation">
                <Field
                  type="checkbox"
                  id="acceptReservation"
                  name="acceptReservation"
                  className="checkbox-field"
                />
                Accept Reservation
              </label>
              <ErrorMessage name="acceptReservation" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="imageURL">Image URL</label>
              <Field
                type="text"
                id="imageURL"
                name="imageURL"
                className="input-field"
              />
              <ErrorMessage name="imageURL" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting} className="submit">
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventForm;
