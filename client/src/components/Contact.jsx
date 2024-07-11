import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ContactUs = () => {
  // Validation schema for Formik
  const ContactSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      alert("Email sent successfully!");
      resetForm(); // Clear the form fields
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-us-section">
      <h2>Contact Us</h2>
      <Formik
        initialValues={{ name: "", email: "", subject: "", message: "" }}
        validationSchema={ContactSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Field type="text" name="name" className="input-field" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className="input-field" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <Field type="text" name="subject" className="input-field" />
              <ErrorMessage name="subject" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <Field as="textarea" name="message" className="input-field" />
              <ErrorMessage name="message" component="div" className="error" />
            </div>
            <button type="submit" className="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUs;
