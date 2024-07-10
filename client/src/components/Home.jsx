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

  