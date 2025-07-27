import React, { useState, useEffect } from "react";
import PlanCard from "../Components/PlanCard/PlanCard";
import Navbar from "../Components/Navbar/Navbar";
import "./CSS/Home.css";
import locationicon from "../Assets/location-icon.png";
import phoneicon from "../Assets/phone-icon.png";
import emailicon from "../Assets/email-icon.png";

const Home = () => {
  const [section, setSection] = useState("home");
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/plans"); // update port if needed
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error("❌ Failed to fetch plans:", err);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="home-page">
      <Navbar onSectionChange={setSection} />

      {section === "home" && (
        <>
          <h1 className="page-title">Choose Your Perfect Plan</h1>
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan._id}
                _id={plan._id}
                name={plan.name}
                price={plan.price}
                features={plan.features}
                isPopular={plan.isPopular}
                payment_terms={plan.payment_terms}
              />
            ))}
          </div>
        </>
      )}

      {section === "about" && (
        <div className="about-section">
          <h2 className="about-title">About Us</h2>
          <p className="about-intro">
            Welcome to <strong>InfiniTel</strong> – your digital gateway to
            seamless connectivity!
          </p>

          <div className="about-content">
            <div className="about-feature">
              <img src="/images/fast-network.png" alt="Fast Network" />
              <h3>Lightning-Fast Network</h3>
              <p>
                Experience blazing-fast speeds with zero interruptions – perfect
                for streaming, gaming, and more.
              </p>
            </div>

            <div className="about-feature">
              <img src="/images/flexible-plans.png" alt="Flexible Plans" />
              <h3>Flexible Plans</h3>
              <p>
                Choose from a variety of data and talktime plans crafted for
                every lifestyle and budget.
              </p>
            </div>

            <div className="about-feature">
              <img src="/images/support.png" alt="24/7 Support" />
              <h3>24/7 Customer Support</h3>
              <p>
                Have questions? Our support team is just a message away, anytime
                you need assistance.
              </p>
            </div>
          </div>

          <p className="about-closing">
            At <strong>InfiniTel</strong>, we believe connectivity is a right –
            not a luxury. Join thousands of happy customers today!
          </p>
        </div>
      )}

      {section === "contact" && (
        <div className="contact-section">
          <h2 className="contact-title">Get in Touch</h2>
          <p className="contact-intro">
            We’d love to hear from you! Whether you have a question, need
            support, or just want to say hello – our team is here for you.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <img src={emailicon} alt="Email Icon" />
              <div>
                <h3>Email Us</h3>
                <p>support@infinitel.com</p>
              </div>
            </div>

            <div className="contact-item">
              <img src={phoneicon} alt="Phone Icon" />
              <div>
                <h3>Call Us</h3>
                <p>+123-456-7890</p>
              </div>
            </div>

            <div className="contact-item">
              <img src={locationicon} alt="Location Icon" />
              <div>
                <h3>Our Office</h3>
                <p>123 Telecom Street, Tech City, India</p>
              </div>
            </div>
          </div>

          <p className="contact-footer">
            Available 24/7 – Let’s stay connected.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
