import React, { useState } from "react";
import ContactForm from "../Components/ContactForm/ContactForm";
import "./CSS/Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <h1 className="page-title">Contact Us</h1>
      <div className="contact-container">
        <ContactForm />
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            Have questions or need assistance? Our team is here to help you.
          </p>
          <p>
            <strong>Customer Support:</strong>
          </p>
          <p className="contact-number">9845678904</p>
          <p>
            <strong>Email:</strong> support@infinitel.com
          </p>
          <p>
            <strong>Business Hours:</strong> 8:00 AM - 10:00 PM (Mon-Sun)
          </p>
          <p>
            <strong>Headquarters:</strong> 123 Telecom Plaza, Tech City, TC
            12345
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
