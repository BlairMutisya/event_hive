import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom"; // Import useHistory hook
import "../styles.css"; // Import your custom styles

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function Login() {
  const history = useHistory(); // Initialize useHistory hook

  return (
    <div className="form-box">
      <div className="login-container">
        <h2>Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values, { setSubmitting }) => {
            fetch("http://localhost:5000/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                alert(`Welcome, ${data.username}!`); // Show a popup with welcome message
                localStorage.setItem("token", data.token); // Save the token to localStorage
                setSubmitting(false);
                history.push("/events"); // Redirect to '/events' page
              })
              .catch((error) => {
                console.error("Error logging in:", error);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="two-forms">
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
                Login
              </button>
            </Form>
          )}
        </Formik>
        <div className="top">
          <span>
            Don't have an account? <a href="#">Register</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
