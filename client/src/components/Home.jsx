import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles.css"; // Your custom CSS for styling
import ProjectImage from "../Assets/project.jpg"; // Import the image for features section
import ProjectImage2 from "../Assets/project2.jpg"; // Import the new image for Security and Reliability section
import ContactUs from "./Contact"; // Import the ContactUs component

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
      <div className="home-page">
        <div className="centered-container">
          <div className="welcome-section">
            <h1>
              Discover, create, and manage your events effortlessly with our
              intuitive platform.
            </h1>
            <p>Your ultimate platform for managing events.</p>
            <div className="buttons">
              <button className="explore-btn">Explore Events</button>
              <button className="dashboard-btn">Go to Dashboard</button>
            </div>
          </div>
        </div>
  
        <div className="features-section">
          <img src={ProjectImage} alt="Project" className="feature-image" />
          <div className="feature-content">
            <h2>Why Choose Us?</h2>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="feature-text">
                <h3>Efficient Event Management</h3>
                <p>
                  Streamline event planning, scheduling, and attendee management.
                </p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="feature-text">
                <h3>Engage with Attendees</h3>
                <p>
                  Enhance attendee engagement with interactive features and
                  notifications.
                </p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="feature-text">
              <h3>Analyze Event Success</h3>
              <p>Track metrics and analyze data to improve future events.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="features-section2">
        <img src={ProjectImage2} alt="Project" className="feature-image2" />
        <div className="feature-content2">
          <h2>Security and Reliability</h2>  
            <p>
              Rest assured that your event data is safe and secure with our
              web app. We prioritize data protection and employ
              industry-standard security measures to safeguard your
              information. Our reliable infrastructure ensures that your event
              management process remains uninterrupted, allowing you to focus
              on what matters most – creating exceptional events.
            </p>
        </div>
      </div>

      <div className="centered-container">
        <div className="card-slider">
          <Slider {...settings}>
            <div className="card">
              <h3>Easy Creation Made Easy</h3>
              <p>
                Seamlessly create and manage events with our intuitive event creation feature. Specify event details, such as date, time, location, and description, to provide a clear picture for your attendees. Customize event settings, add event images, and set ticket options effortlessly.
              </p>

            </div>
            <div className="card">
              <h3>Easy Attendee Management</h3>
              <p>
                Keep track of attendees our comprehensive attendee management feature. Easily view and manage RSVPs, track attendance, and collect essential participant information. Scan QR Codes to check-in attendees and ensure a smooth event experience for all participants.
              </p>

            </div>
            <div className="card">
              <h3>Flexible Event Privacy</h3>
              <p>
                Take control over event visibility with our private and public event options. Host private gatherings with exclusive access for selected participants or organize public events to reach a wider audience. Customize privacy settings to suit the unique needs of each event.
              </p>

            </div>
            <div className="card">
              <h3>Seamless User Experience</h3>
              <p>
                Ensure a smooth registration process and track attendee responses for effective event management.
              </p>

            </div>
            {/* Add more slides as needed */}
          </Slider>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Event Hive. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;