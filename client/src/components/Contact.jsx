import React from 'react'

const Contact = () => {
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
          Origin: "http://localhost:3000/contact", // Specify the origin of the request
          // Add any other headers needed for your request
        },
        body: JSON.stringify(values),
        credentials: "same-origin", // Include credentials like cookies if necessary
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
}

export default Contact