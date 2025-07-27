import React from "react";
import "./CSS/About.css";

const About = () => {
  return (
    <div className="about-page">
      <h1 className="page-title">About Infinitel</h1>
      <div className="about-content">
        <h2>Your Trusted Telecom Partner</h2>
        <p>
          Infinitel is a leading telecommunications provider committed to
          delivering seamless connectivity solutions to customers across the
          nation. With our cutting-edge network infrastructure, we ensure
          reliable and high-speed services for both personal and business needs.
        </p>

        <h2>Our Mission</h2>
        <p>
          To empower individuals and businesses with innovative communication
          solutions that bridge distances and foster connections. We strive to
          make communication simple, affordable, and accessible to everyone.
        </p>

        <h2>Our Services</h2>
        <p>
          Infinitel offers a comprehensive range of telecom services including
          mobile connectivity, data plans, broadband services, and enterprise
          solutions. Our flexible plans cater to diverse needs and budgets.
        </p>
      </div>
    </div>
  );
};

export default About;
