import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import "../styles.css"; // Import your custom styles

const registerSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Register() {
  const [buttonText, setButtonText] = useState("Register");
  const history = useHistory();

  return (
    <div className="form-box">
      <div className="register-container">
        <h2>Register</h2>
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            fetch("http://localhost:5000/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("User registered:", data);
                setSubmitting(false);
                setButtonText("Registered!");
                resetForm(); // Reset the form fields
                setTimeout(() => {
                  history.push("/login"); // Redirect to the login page after 2 seconds
                }, 2000);
              })
              .catch((error) => {
                console.error("Error registering:", error);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="two-forms">
              <div className="input-box">
                <i className="fas fa-user"></i>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input-field"
                />
                <ErrorMessage name="username" component="div" className="error" />
              </div>
              <div className="input-box">
                <i className="fas fa-envelope"></i>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input-field"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div className="input-box">
                <i className="fas fa-lock"></i>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input-field"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="submit">
                {isSubmitting ? "Registering..." : buttonText}
              </button>
            </Form>
          )}
        </Formik>
        <div className="top">
          <span>Already have an account? <a href="/login">Login</a></span>
        </div>
      </div>
    </div>
  );
}

export default Register;
